package com.voximplant.reactnative;

import com.voximplant.reactnative.VoxImplantModule;
import com.voximplant.reactnative.VoxImplantViewManager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.JavaScriptModule;

import com.facebook.react.ReactPackage;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

import android.opengl.GLSurfaceView;
import android.content.Context;

import com.facebook.react.modules.fresco.FrescoModule;
import com.facebook.react.modules.network.NetworkingModule;
import com.facebook.react.modules.storage.AsyncStorageModule;
import com.facebook.react.modules.toast.ToastModule;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.views.drawer.ReactDrawerLayoutManager;
import com.facebook.react.views.image.ReactImageManager;
import com.facebook.react.views.progressbar.ReactProgressBarViewManager;
import com.facebook.react.views.scroll.ReactHorizontalScrollViewManager;
import com.facebook.react.views.scroll.ReactScrollViewManager;
import com.facebook.react.views.text.ReactRawTextManager;
import com.facebook.react.views.text.ReactTextViewManager;
import com.facebook.react.views.text.ReactVirtualTextViewManager;
import com.facebook.react.views.textinput.ReactTextInputManager;
import com.facebook.react.views.toolbar.ReactToolbarManager;
import com.facebook.react.views.view.ReactViewManager;

public class VoxImplantReactPackage implements ReactPackage
{
  @Override public List<NativeModule> createNativeModules( ReactApplicationContext reactContext) {
    return Arrays.<NativeModule>asList(
      new VoxImplantModule(reactContext));
  }

  @Override public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Arrays.<ViewManager>asList(new VoxImplantViewManager());
  }

  @Override public List<Class<? extends JavaScriptModule>> createJSModules() {
    return Arrays.asList();
  }
}
