/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import javax.annotation.Nullable;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class VoxImplantViewManager extends SimpleViewManager<VoxImplantRendererView>
{

  public static final String REACT_CLASS = "RCTVoxImplantRendererView";

  @Override 
  public String getName() {
      return REACT_CLASS;
  }

  @Override 
  public VoxImplantRendererView createViewInstance(ThemedReactContext context) {
      return new VoxImplantRendererView(context);
  }

  @ReactProp(name = "preview")
  public void setPreviewStatus(VoxImplantRendererView view, Boolean preview) {
    view.setPreviewStatus(preview);
    view.requestLayout();
  }

  @ReactProp(name = "callId")
  public void setCallId(VoxImplantRendererView view, @Nullable String callId) {
    view.setCallId(callId != null ? callId : "");
  }
}
