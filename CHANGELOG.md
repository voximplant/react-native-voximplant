# Changelog

### 1.23.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.20.3 and Voximplant iOS SDK 2.34.2

### 1.22.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.20.2 and Voximplant iOS SDK 2.34.1
- Fix for: [#120](https://github.com/voximplant/react-native-voximplant/issues/120)

### 1.21.0
- Add new API to improve CallKit integration on iOS:
  - Call.callKitUUID - JS API
  - [VIClientModule uuidForPushNotification] - Native iOS API

### 1.20.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.19.0 and Voximplant iOS SDK 2.32.1
- Introduce AudioFile API to play audio files

### 1.19.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.17.0 and Voximplant iOS SDK 2.31.0
- Add Call.localVideoStreams and Endpoint.videoStreams properties to access video streams

### 1.18.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.16.1 and Voximplant iOS SDK 2.29.0
- Introduce ClientConfig.h264RecoveryMode option that enables experimental packet recovery mode to decode broken h264 streams

### 1.17.0
- Update native iOS module to use Voximplant iOS SDK 2.28.0

### 1.16.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.16.0 and Voximplant iOS SDK 2.27.0
- Fix for [#106](https://github.com/voximplant/react-native-voximplant/issues/106)

### 1.15.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.15.0 and Voximplant iOS SDK 2.25.2
- Add VideoStream.type property to identify the video source type: video or screen sharing
- Remove deprecated properties for Android:
  * ClientConfig.enableHWAcceleration
  * ClientConfig.provideLocalFramesInByteBuffer

### 1.14.0
- Update native iOS module to use Voximplant iOS SDK 2.25.0
- Min supported iOS version is changed to 9.0. iOS 8.0 is no more supported.

### 1.13.0
- Update native Android module to use Voximplant Android SDK 2.14.1

### 1.12.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.14.0 and Voximplant iOS SDK 2.23.0
- Legacy API removal

### 1.11.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.13.0 and Voximplant iOS SDK 2.22.0
- Fix: build issue with Android Gradle Plugin 3.5.0

### 1.10.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.12.2 and Voximplant iOS SDK 2.21.3
- Improvements for VideoView component on Android: add/remove SurfaceViewRenderer to/from the parent ViewGroup on 
  the videoStreamId prop change 

### 1.9.2 
- Android: get compileSdkVersion and targetSdkVersion from the root project or use the version 28 as default

### 1.9.1
- Support React Native 0.60 autolinking

### 1.9.0
- Update native iOS module to use Voximplant iOS SDK 2.20.7
- Fix Client.tokenRefresh implementation

### 1.8.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.11.3 and Voximplant iOS SDK 2.20.6
- Introduce Client.setLoggerCallback API
- Fix for [#74](https://github.com/voximplant/react-native-voximplant/issues/74): add ability to remove anonymous 
  functions as event handlers
- Fix for error on getting endpoints after a call was ended
- Bugfix and improvements for iOS native implementation:
  - avoid retain cycles
  - use a serial queue as the delegate queue for Voximplant iOS SDK instead of the main queue
  - remove old video renderer from VideoView before creating a new one on videoStreamId property change

### 1.7.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.11.2 and Voximplant iOS SDK 2.20.3

### 1.6.0
- Update native Android and iOS modules to use Voximplant Android SDK 2.11.1 and Voximplant iOS SDK 2.20.0
- Introduce Messaging API
- `use_frameworks!` is no more required for Voximplant React Native SDK installation on iOS
- Remove deprecated LogLevel.MAX
- Remove ClientConfig.saveLogsToFile option for iOS

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
