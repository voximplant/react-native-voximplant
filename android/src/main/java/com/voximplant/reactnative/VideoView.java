/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import android.content.Context;

import com.voximplant.sdk.call.IVideoStream;
import com.voximplant.sdk.call.RenderScaleType;

import org.webrtc.SurfaceViewRenderer;

import static com.voximplant.reactnative.Constants.SCALE_TYPE_FILL;
import static com.voximplant.reactnative.Constants.SCALE_TYPE_FIT;

public class VideoView extends SurfaceViewRenderer {

    private String mVideoStreamId;
    private String mScaleType;
    
    VideoView(Context context) {
        super(context);
    }

    @Override
    protected void onDetachedFromWindow() {
        IVideoStream videoStream = CallManager.getInstance().getVideoStreamById(mVideoStreamId);
        if (videoStream != null) {
            videoStream.removeVideoRenderer(this);
        }
    }

    public void setVideoStreamId(String videoStreamId) {
        mVideoStreamId = videoStreamId;
        applyProperties();
    }

    public void setScaleType(String scaleType) {
        mScaleType = scaleType;
        applyProperties();
    }

    private void applyProperties() {
        if (mVideoStreamId != null && !mVideoStreamId.isEmpty() && mScaleType != null && !mScaleType.isEmpty()) {
            IVideoStream videoStream = CallManager.getInstance().getVideoStreamById(mVideoStreamId);
            if (videoStream != null) {
                RenderScaleType scaleType;
                switch (mScaleType) {
                    case SCALE_TYPE_FILL:
                        scaleType = RenderScaleType.SCALE_FILL;
                        break;
                    case SCALE_TYPE_FIT:
                    default:
                        scaleType = RenderScaleType.SCALE_FIT;
                        break;
                } 
                videoStream.addVideoRenderer(this, scaleType);
            }
        }
    }


}
