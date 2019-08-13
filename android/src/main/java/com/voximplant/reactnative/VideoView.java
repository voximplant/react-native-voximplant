/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Point;
import android.view.ViewGroup;

import com.voximplant.sdk.call.IVideoStream;
import com.voximplant.sdk.call.RenderScaleType;

import org.webrtc.RendererCommon;
import org.webrtc.SurfaceViewRenderer;

import static com.voximplant.reactnative.Constants.SCALE_TYPE_FILL;
import static com.voximplant.reactnative.Constants.SCALE_TYPE_FIT;

class VideoView extends ViewGroup implements RendererCommon.RendererEvents {

    private String mVideoStreamId;
    private String mScaleType = SCALE_TYPE_FIT;
    private SurfaceViewRenderer mVideoViewRenderer;
    private int mFrameHeight;
    private int mFrameRotation;
    private int mFrameWidth;
    private final Object mLock = new Object();

    private final Runnable requestSurfaceViewRendererLayoutRunnable = this::requestSurfaceViewRendererLayout;

    VideoView(Context context) {
        super(context);
        mVideoViewRenderer = new SurfaceViewRenderer(context);
        ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        mVideoViewRenderer.setLayoutParams(layoutParams);
    }

    public void setVideoStreamId(String videoStreamId) {
        applyProperties(videoStreamId);
    }

    public void setScaleType(String scaleType) {
        mScaleType = scaleType;
        mVideoViewRenderer.setScalingType(mScaleType.equals(SCALE_TYPE_FILL) ? RendererCommon.ScalingType.SCALE_ASPECT_FILL : RendererCommon.ScalingType.SCALE_ASPECT_FIT);
    }

    public void setShowOnTop(boolean showOnTop) {
        mVideoViewRenderer.setZOrderMediaOverlay(showOnTop);
    }

    private void applyProperties(String videoStreamId) {
        if (mVideoStreamId == null || mVideoStreamId.isEmpty()) {
            mVideoStreamId = videoStreamId;
        }
        if (mVideoStreamId != null && !mVideoStreamId.equals(videoStreamId)) {
            IVideoStream videoStream = CallManager.getInstance().getVideoStreamById(mVideoStreamId);
            if (videoStream != null) {
                videoStream.removeVideoRenderer(mVideoViewRenderer);
            }
            removeView(mVideoViewRenderer);
            mVideoStreamId = videoStreamId;
        }
        if (mVideoStreamId != null && !mVideoStreamId.isEmpty()) {
            IVideoStream videoStream = CallManager.getInstance().getVideoStreamById(mVideoStreamId);
            if (videoStream != null) {
                addView(mVideoViewRenderer);
                videoStream.addVideoRenderer(mVideoViewRenderer,
                        mScaleType.equals(SCALE_TYPE_FILL) ? RenderScaleType.SCALE_FILL : RenderScaleType.SCALE_FIT,
                        this);
            }
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        IVideoStream videoStream = CallManager.getInstance().getVideoStreamById(mVideoStreamId);
        if (videoStream != null) {
            videoStream.removeVideoRenderer(mVideoViewRenderer);
            removeView(mVideoViewRenderer);
        }
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        int height = bottom - top;
        int width = right - left;

        if (height == 0 || width == 0) {
            left = top = right = bottom = 0;
        } else {
            int frameHeight;
            int frameRotation;
            int frameWidth;

            synchronized (mLock) {
                frameHeight = mFrameHeight;
                frameRotation = mFrameRotation;
                frameWidth = mFrameWidth;
            }

            switch (mScaleType) {
                case SCALE_TYPE_FILL:
                    right = width;
                    bottom = height;
                    left =  top = 0;
                    break;
                case SCALE_TYPE_FIT:
                default:
                    if (frameHeight == 0 || frameWidth == 0) {
                        left = top = right = bottom = 0;
                    } else {
                        float frameAspectRatio = (frameRotation % 180 == 0) ? frameWidth / (float) frameHeight
                                : frameHeight / (float) frameWidth;
                        Point frameDisplaySize = RendererCommon.getDisplaySize(
                                RendererCommon.ScalingType.SCALE_ASPECT_FIT,
                                frameAspectRatio, width, height);

                        left = (width - frameDisplaySize.x) / 2;
                        top = (height - frameDisplaySize.y) / 2;
                        right = left + frameDisplaySize.x;
                        bottom = top + frameDisplaySize.y;
                    }
                    break;
            }
        }
        mVideoViewRenderer.layout(left, top, right, bottom);
    }

    @Override
    public void onFirstFrameRendered() { }

    @Override
    public void onFrameResolutionChanged(int videoWidth, int videoHeight, int rotation) {
        boolean changed = false;

        synchronized (mLock) {
            if (mFrameHeight != videoHeight) {
                mFrameHeight = videoHeight;
                changed = true;
            }
            if (mFrameRotation != rotation) {
                mFrameRotation = rotation;
                changed = true;
            }
            if (mFrameWidth != videoWidth) {
                mFrameWidth = videoWidth;
                changed = true;
            }
        }
        if (changed) {
            post(requestSurfaceViewRendererLayoutRunnable);
        }

    }

    @SuppressLint("WrongCall")
    private void requestSurfaceViewRendererLayout() {
        mVideoViewRenderer.requestLayout();
        onLayout(false, getLeft(), getTop(), getRight(), getBottom());
    }

}

