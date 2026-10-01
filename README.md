# Voximplant React Native SDK

The Voximplant React Native SDK adds voice and video calls to React Native apps on iOS and Android.

The SDK ships as two packages:

| Package | What it is for |
| --- | --- |
| [`@voximplant/react-native-core`](packages/core) | Connection to the Voximplant Cloud, login, push notifications, and audio devices |
| [`@voximplant/react-native-calls`](packages/calls) | Calls, conferences, camera, and call statistics |

[`@voximplant/react-native-shared`](packages/shared) (common types and utilities) is installed with core and calls. An app does not need to add it unless it imports that package directly.

Guides and the API reference: [voximplant.com/docs](https://voximplant.com/docs).

## Requirements

| Requirement | Minimum |
| --- | --- |
| react | ^19.2.0 |
| react-native | >=0.77.0 <1.0.0 |
| Android | API 24 |
| iOS | 12 |

## Install

```bash
npm install @voximplant/react-native-core 
npn install @voximplant/react-native-calls
```

Calls expects core to be installed in the app, so install both packages together.

### iOS

The Voximplant React Native SDK is built atop of Voximplant Android and iOS SDKs. 

The Voximplant iOS SDK is distributed only through Swift Package Manager, so CocoaPods does not resolve it on its own. Add the podspecs for your React Native SDK version to the app `Podfile`, next to `use_native_modules!`. Then run `pod install` in the `ios` directory.

**@voximplant/react-native-core**

| SDK version | VoximplantCore |
| --- | --- |
| 2.0.0 | [3.3.0](https://github.com/voximplant/ios-sdk-releases/releases/download/3.3.0/VoximplantCore.podspec) |

**@voximplant/react-native-calls**

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

Apps that use `@voximplant/react-native-calls` should set [NSCameraUsageDescription](https://developer.apple.com/documentation/bundleresources/information-property-list/nscamerausagedescription) and [NSMicrophoneUsageDescription](https://developer.apple.com/documentation/bundleresources/information-property-list/nsmicrophoneusagedescription) in the application `Info.plist`. iOS shows these strings when the app requests camera and microphone access.

## Start

Connect to the node your Voximplant account belongs to, then log in. The [getting started guide](https://voximplant.com/docs/getting-started/platform/react-native) provides information about the node values and the sign-in steps.

```ts
import {
  Client,
  ConnectionNode,
} from '@voximplant/react-native-core';

const client = Client.getInstance();

await client.connect({ node: ConnectionNode.Node1 });
await client.login('user@app.account.voximplant.com', 'password');
```

Make and receive calls with `CallManager` from `@voximplant/react-native-calls`:

```ts
import { CallManager } from '@voximplant/react-native-calls';

const callManager = CallManager.getInstance();

const call = callManager.createCall('destination');
call?.start();
```

## License

The SDK is licensed under the Apache License 2.0.
