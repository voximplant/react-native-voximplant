# VoxImplant SDK for React Native

VoxImplant Mobile SDK module for React Native. It lets developers embed realtime voice and video communication into React Native apps and works together with [VoxImplant cloud platform](http://voximplant.com). The SDK uses WebRTC for media processing.

## Example
[![VoxImplant SDK demo](https://habrastorage.org/files/185/1b5/dd6/1851b5dd689e4a688c2f6e68fcf38d81.gif)](http://www.youtube.com/watch?v=gC2iDVl4RRM)

You can get the demo app from [http://github.com/voximplant/react-native-demo](http://github.com/voximplant/react-native-demo)

## Getting started
### iOS
1. `npm install react-native-voximplant@latest --save`
2. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
3. Go to `node_modules` ➜ `react-native-voximplant/ios` and add `VoxImplant.xcodeproj`
4. In XCode, in the project navigato r, select your project. Add `libvoximplant.a, react-native-voximplant/VoxImplantSDK/libVoxImplantSDK.a, libc++.dylib or libc++.tbd, GLKit.framework` to your project's `Build Phases` ➜ `Link Binary With Libraries`
5. Click `VoxImplant.xcodeproj` in the project navigator and go the `Build Settings` tab. Make sure 'All' is toggled on (instead of 'Basic'). Look for `Header Search Paths` and make sure it contains `$(SRCROOT)/../node_modules/react-native/React` and mark as `recursive`. Look for `Library Search Paths` and add `$(SRCROOT)/../node_modules/react-native-voximplant/ios/VoxImplantSDK/lib` 
5. Run your project (`Cmd+R`)

### Android
1. `npm install react-native-voximplant@latest --save`
2. Open up `android/app/main/java/[...]/MainActivity.java`
    - Add `import com.voximplant.reactnative.VoxImplantReactPackage;` to the imports at the top of the file
    - Add `new VoxImplantReactPackage()` to the list returned by the `getPackages()` method

3. Append the following lines to `android/settings.gradle`:

    ```
    include ':react-native-voximplant'
    project(':react-native-voximplant').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-voximplant/android')
    ```

4. Insert the following lines inside the dependencies block in `android/app/build.gradle`:

    ```
    compile project(':react-native-voximplant')
    ```    

5. And finally, in android/src/main/AndroidManifest.xml add user permissions

    ```
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.INTERNET" />
    ```

## Usage
`import` the `react-native-voximplant` module:

    import VoxImplant from "react-native-voximplant";

Add event listeners using `DeviceEventEmitter`:

    DeviceEventEmitter.addListener(
        'ConnectionSuccessful',
        () => {
            console.log('Connection successful');
        }
    );

All events are described at [http://voximplant.com/docs/references/mobilesdk/ios/Protocols/VoxImplantDelegate.html](http://voximplant.com/docs/references/mobilesdk/ios/Protocols/VoxImplantDelegate.html) 

Connect the SDK to the cloud:

    VoxImplant.SDK.connect();   
    
Make calls:
    
    VoxImplant.SDK.createCall(number, video, null, function(callId) {
      currentCallId = callId;      
      VoxImplant.SDK.startCall(callId);      
    });
    
Receive calls:

    DeviceEventEmitter.addListener(
      'IncomingCall',
        (incomingCall) => {
            console.log('Inbound call');
            currentCallId = incomingCall.callId;
            // answer call VoxImplant.SDK.answerCall(currentCallId);
            // or
            // reject call VoxImplant.SDK.declineCall(currentCallId);
        }
    );

All methods are described at [http://voximplant.com/docs/references/mobilesdk/ios/Classes/VoxImplant.html](http://voximplant.com/docs/references/mobilesdk/ios/Classes/VoxImplant.html)
    
Video view components:

        /* remote video */
        <VoxImplant.RemoteView style={styles.remotevideo}>
        </VoxImplant.RemoteView>
        /* camera preview (local) */
        <VoxImplant.Preview style={styles.selfview}>
        </VoxImplant.Preview>  

You will need free VoxImplant developer account setup for making and receiving calls using the SDK. Learn more at [http://voximplant.com/docs/quickstart/1/your-first-voximplant-application/](http://voximplant.com/docs/quickstart/1/your-first-voximplant-application/)


## Todo
These are some features I think would be important/beneficial to have included with this module. Pull requests welcome!

- [ ] Add InstantMessaging/Presence support
