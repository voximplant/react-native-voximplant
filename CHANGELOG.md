# Changelog

### 1.5.0
- Introduce VideoView showOnTop prop for Android to indicate that the video view should be displayed on top of others.
  Fix for [#57](https://github.com/voximplant/react-native-voximplant/issues/57)
- Provide error description for Client.call promise rejection
- Specify RN supported versions in peerDependencies (RN >= 0.47.0)

### 1.4.0
- Update native Android and iOS modules to use Voximplant Andorid SDK 2.8.1 and Voximplant iOS SDK 2.18.0
- Fix to receive EndpointEvents after subscription in CallEvents.EndpointAdded event in case of incoming call
- Remove unused imports

### 1.3.1
- Update native Android and iOS modules to use Voximplant Andorid SDK 2.8.0 and Voximplant iOS SDK 2.17.0
- Introduce ClientConfig.requestAudioFocusMode option to specify when audio focus request should be performed by SDK 
  on Android
- Fix for crash on establishing the connection with the Voximplant Cloud with connectivity check enabled 
  (Android)

### 1.2.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.6.1 and Voximplant iOS SDK 2.16.0
- CallKit integration support for iOS
- Fix for [#45](https://github.com/voximplant/react-native-voximplant/issues/45)
- Fix: not able to get endpoints while processing incoming call event
- Fix: CallEvents.LocalVideoStreamRemoved is not invoked
- New API: Client.callConference API to create call to a dedicated conference without proxy session
- New API: VideoCodec enum to specify preferred video codec for calls.
- Replace H264First property with preferredVideoCodec property
- Add ability to specify video codec for a particular call on android
- Memory management improvements
- Stability improvements and bugfix

### 1.1.1
- Update native Android and iOS modules to use the latest Voximplant SDKs
- Fix: videoStream is undefined in RemoteVideoStreamRemoved event
- Rename native Android and iOS modules to avoid naming conflicts with other react native packages

### 1.1.0
- Introduce ClientConfig.bundleId property to specify Android application package name to enable 
  push notifications across several mobile applications on a specific platform (Android or iOS) 
  using a single Voximplant application.

### 1.0.1
- Update native Android module to use the Voximplant Android SDK 2.5.1

### 1.0.0
- New APIs with advanced functionality: 
    - Promises support
    - Ability to indicate video directions on call creation or answering
    - Easy way to subscribe to Voximplant React Native SDK events with on/off APIs 
      instead of DeviceEventEmitter 
    - Extended control for audio devices and camera with ability to handle events 
      about new audio device, audio device changes, camera errors
    - Video resize modes for android
    - Endpoints, Video streams and Video views
    
  See official guides for mode details.

### 0.2.2
- Fix for login fail with access token, if previously login was performed via one time key
- Fix for [#40](https://github.com/voximplant/react-native-voximplant/issues/40)

### 0.2.1
- Fix RN 0.54 compatibility

### 0.2.0
- Add push notifications support
- Change iOS integration to Podfile approach
- Update native iOS and Andorid SDKs to the latest versions
- Bugfixes and stability improvements
