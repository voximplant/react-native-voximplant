# @voximplant/react-native-calls

Calls module of the [Voximplant React Native SDK](https://github.com/voximplant/react-native-voximplant). Use it to make and receive calls, join conferences, manage the camera, and read call statistics.

Connection and login are in [`@voximplant/react-native-core`](https://www.npmjs.com/package/@voximplant/react-native-core). Connect and log in before making a call.

[`@voximplant/react-native-shared`](https://www.npmjs.com/package/@voximplant/react-native-shared) (common types and utilities) is installed with this package. An app does not need to add it unless it imports that package directly.

Guides and the API reference: [voximplant.com/docs](https://voximplant.com/docs).

## Requirements

| Requirement | Minimum |
| --- | --- |
| react | ^19.2.0 |
| react-native | >=0.77.0 <1.0.0 |
| Android | API 24 |
| iOS | 12 |

## Install

Calls expects core to be installed in the app, so install both packages together.

```bash
npm install @voximplant/react-native-core 
npn install @voximplant/react-native-calls
```

### iOS

The Voximplant React Native SDK is built atop of Voximplant Android and iOS SDKs.

The Voximplant iOS SDK is distributed only through Swift Package Manager, so CocoaPods does not resolve it on its own. Add the podspecs for your React Native SDK version to the app `Podfile`, next to `use_native_modules!`. Then run `pod install` in the `ios` directory.

This package needs `VoximplantCalls` and `VoximplantWebRTC`. `@voximplant/react-native-core` also needs `VoximplantCore`.

| SDK version | VoximplantCalls | VoximplantWebRTC |
| --- | --- | --- |
| 2.0.0 | [3.3.0](https://github.com/voximplant/ios-sdk-releases/releases/download/3.3.0/VoximplantCalls.podspec) | [3.3.0](https://github.com/voximplant/ios-sdk-releases/releases/download/3.3.0/VoximplantWebRTC.podspec) |

Example. Replace `<version>` with the version from the table for your SDK version:

```ruby
target 'YourApp' do
  config = use_native_modules!

  pod 'VoximplantCore',   :podspec => 'https://github.com/voximplant/ios-sdk-releases/releases/download/<version>/VoximplantCore.podspec'
  pod 'VoximplantCalls',  :podspec => 'https://github.com/voximplant/ios-sdk-releases/releases/download/<version>/VoximplantCalls.podspec'
  pod 'VoximplantWebRTC', :podspec => 'https://github.com/voximplant/ios-sdk-releases/releases/download/<version>/VoximplantWebRTC.podspec'

  # use_react_native! and the rest of the target stay as they are
end
```

This package requires [NSCameraUsageDescription](https://developer.apple.com/documentation/bundleresources/information-property-list/nscamerausagedescription) and [NSMicrophoneUsageDescription](https://developer.apple.com/documentation/bundleresources/information-property-list/nsmicrophoneusagedescription) in the application `Info.plist`. iOS shows these strings when the app requests camera and microphone access.

## Start

Make and receive calls with `CallManager`. The [getting started guide](https://voximplant.com/docs/getting-started/platform/react-native) provides information about sign-in and a full call.

```ts
import { CallManager } from '@voximplant/react-native-calls';

const callManager = CallManager.getInstance();

const call = callManager.createCall('destination');
call?.start();
```

## License

The SDK is licensed under the [Apache License 2.0](LICENSE).
