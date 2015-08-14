# VoxImplant SDK for React Native

VoxImplant Mobile SDK module for React Native. It lets developers embed realtime voice and video communication into React Native apps and works together with [VoxImplant cloud platform](http://voximplant.com). The SDK uses WebRTC for media processing.

## Example
[![VoxImplant SDK demo](http://static.voximplant.com/react-native-voximplant.gif)](http://www.youtube.com/watch?v=k4FJS1Dg5Mw)
You can download the demo app from http://github.com/voximplant/react-native-demo

## Getting started

1. `npm install react-native-voximplant@latest --save`
2. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
3. Go to `node_modules` ➜ `react-native-voximplant` and add `VoxImplant.xcodeproj`
4. In XCode, in the project navigator, select your project. Add `libvoximplant.a, react-native-voximplant/VoxImplantSDK/libVoxImplantSDK.a, libc++.dylib, GLKit.framework` to your project's `Build Phases` ➜ `Link Binary With Libraries`
5. Click `VoxImplant.xcodeproj` in the project navigator and go the `Build Settings` tab. Make sure 'All' is toggled on (instead of 'Basic'). Look for `Header Search Paths` and make sure it contains both `$(SRCROOT)/../react-native/React` and `$(SRCROOT)/../../React` - mark both as `recursive`.
5. Run your project (`Cmd+R`)

## Usage
`require` the `react-native-voximplant` module:

    var VoxImplant = require("react-native-voximplant");

Add event listeners using `RTCDeviceEventEmitter`:

    RCTDeviceEventEmitter.addListener(
        'ConnectionSuccessful',
        () => {
            console.log('Connection successful');
        }
    );

All events are described at http://voximplant.com/docs/references/mobilesdk/ios/Protocols/VoxImplantDelegate.html 

Connect the SDK to the cloud:

    VoxImplant.SDK.connect();   
    
Make and receive calls:
    
    VoxImplant.SDK.createCall(number, video, null, function(callId) {
      currentCallId = callId;      
      VoxImplant.SDK.startCall(callId);      
    });
    
All methods are described at http://voximplant.com/docs/references/mobilesdk/ios/Classes/VoxImplant.html
    
Video view components:

        /* remote video */
        <VoxImplant.RemoteView style={styles.remotevideo}>
        </VoxImplant.RemoteView>
        /* camera preview (local) */
        <VoxImplant.Preview style={styles.selfview}>
        </VoxImplant.Preview>  

You will need free VoxImplant developer account setup for making and receiving calls using the SDK. Learn more at http://voximplant.com/docs/quickstart/1/your-first-voximplant-application/


## Known Issues
Below is a list of known issues. Pull requests are welcome for any of these issues!

- Random flickering of local video preview
- Hasn't been tested with React 0.9-rc yet

## Todo
These are some features I think would be important/beneficial to have included with this module. Pull requests welcome!

- [ ] Upload demo application example on GitHub
- [ ] Test the SDK with React Native 0.9-rc
