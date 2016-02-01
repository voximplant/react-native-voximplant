package com.voximplant.reactnative;

import android.util.Log;
import javax.annotation.Nullable;
import android.content.Context;
import com.facebook.react.uimanager.*;
import org.webrtc.SurfaceViewRenderer;

public class VoxImplantViewManager extends SimpleViewManager<VoxImplantRendererView>
{
  VoxImplantViewManager() {
  }

   @Override public String getName() {
      return "RCTVoxImplantRendererView";
  }

   @Override public VoxImplantRendererView createViewInstance(ThemedReactContext context) {
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
