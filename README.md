# Voximplant SDK for React Native

Voximplant Mobile SDK module for React Native. It lets developers embed realtime voice and video communication into React Native apps and works together with [Voximplant cloud platform](http://voximplant.com). The SDK uses WebRTC for media processing.

## Example
You can get the demo app from [http://github.com/voximplant/react-native-demo](http://github.com/voximplant/react-native-demo)

## Getting started

### iOS

#### Manual install

1. Make sure you have "React Native" project created with `react-native init`
2. `cd` into a project directory where `package.json` file is located.
3. Run `npm install react-native-voximplant@latest --save`.
4. Open or create ios/Podfile and add the following dependencies. Please use demo project Podfile ad a reference.
    ```
    pod 'React', :path => ‘../node_modules/react-native', :subspecs => [
        'Core',
        'RCTImage',
        'RCTNetwork',
        'RCTText',
        'RCTWebSocket',
        'DevSupport',
        'BatchedBridge'
        # Add any other subspecs you want to use in your project
    ]
    pod 'react-native-voximplant', path: '../node_modules/react-native-voximplant'
    pod 'Yoga', path: '../node_modules/react-native/ReactCommon/yoga'
    ```
5. Add `use_frameworks!` at the top of your target configuration
6. Run `pod install` from <your_project>/ios/
7. Start XCode and open generated <your_project>.xcworkspace
8. Check if there is no `*.xcodeproj` in the project navigation (see the  `Libraries` section). In case of any please remove them. 
   Since React dependencies are added via Podfile, double integration of its modules may lead to unpredictable/incorrect behavior of an application.
9. Run your project (`Cmd+R`)

### Android

#### Manual install

1. Make sure you have "React Native" project created with `react-native init`
2. `cd` into a project directory where `package.json` file is located.
3. Run `npm install react-native-voximplant@latest --save`
4. It is required to add Java 8 support. 
    - Open `android/app/build.gradle` file and add the following lines to ‘android’ section: 
        ```
        compileOptions {
            sourceCompatibility JavaVersion.VERSION_1_8
            targetCompatibility JavaVersion.VERSION_1_8
        }
        ```
    - If you're using gradle version < 3.0.0, do this step and the next one OR run the `gradle sync` command in Android Studio, then follow the provided hints. 
      Open the `android/build.gradle` file and update the Android plugin for gradle: 
        ```
        dependencies {
          // use the latest available version
          classpath 'com.android.tools.build:gradle:3.1.3'
        }​
        
        ```
    - Open the android/gradle/wrapper/gradle-wrapper.properties file and edit the distributionUrl to gradle-4.4-all.zip: 
        ```
        distributionUrl=https\://services.gradle.org/distributions/gradle-4.4-all.zip
        ```
5. Run the `react-native link` command to link react-native-voximplant Android dependency OR perform the following steps: 
    - Open up `android/app/main/java/[...]/MainApplication.java`
    - Add `import com.voximplant.reactnative.VoxImplantReactPackage;` to the imports at the top of the file
      
      Add `new VoxImplantReactPackage()` to the list returned by the `getPackages()` method
      
    - Append the following lines to `android/settings.gradle`:

        ```
        include ':react-native-voximplant'
        project(':react-native-voximplant').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-voximplant/android')
        ```
    - Insert the following lines inside the dependencies block in `android/app/build.gradle`:
    
        ```
        compile project(':react-native-voximplant')
        ```    

## Usage
You will need free Voximplant developer account setup for making and receiving calls using the SDK. 
Learn more at [quick start](https://voximplant.com/docs/references/articles/quickstart).

Official guides:
- [Using React Native SDK guide](https://voximplant.com/blog/using-react-native-sdk)
- [Migration guide](https://voximplant.com/blog/migration-guide-for-react-native-sdk)


## Todo
These are some features I think would be important/beneficial to have included with this module. Pull requests welcome!

- [ ] Add InstantMessaging/Presence support
