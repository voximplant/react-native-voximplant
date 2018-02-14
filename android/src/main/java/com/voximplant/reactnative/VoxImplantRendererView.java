/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import android.content.Context;
import org.webrtc.SurfaceViewRenderer;
import com.zingaya.voximplant.VoxImplantClient;

public class VoxImplantRendererView extends SurfaceViewRenderer
{
	private static int MAX_PROPERTIES = 2;

	VoxImplantRendererView(Context context) {
		super(context);
		this.preview = true;
		this.callId = new String();
		this.propertiesCounter = 0;
	}

	public void setPreviewStatus(Boolean preview) {
		this.preview = preview;
		applyProperties();
		if (preview) {
			setZOrderMediaOverlay(true);
		}
	}

	public void setCallId(String callId) {
		this.callId = callId;
		applyProperties();
	}

	private void applyProperties() {
		if (++this.propertiesCounter == VoxImplantRendererView.MAX_PROPERTIES) {
			if (this.preview)
        		VoxImplantClient.instance().setLocalPreview(this);
      		else
        		VoxImplantClient.instance().setRemoteView(this.callId, this);
    	}
	}

	@Override 
	protected void onDetachedFromWindow () {
		super.onDetachedFromWindow();
		if (this.preview)
			VoxImplantClient.instance().setLocalPreview(null);
		else
			VoxImplantClient.instance().setRemoteView(this.callId, null);
	}

	private Boolean preview;
	private String callId;
	private int propertiesCounter;
};