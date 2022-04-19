### Test project

## Before you start
1. Create 3 Voximplant users
2. Replace required credentials with Voximplant users credentials in `tests/helpers/Credentials.js` 
3. Go to `android/build.gradle` and upgrade minSdkVersion to 21.
4. In terminal go to `tests` directory and run `yarn install`
6. In terminal run `yarn run packager-jet`
6. To run the tests on iOS, ensure [xcpretty](https://github.com/supermarin/xcpretty) is installed

## Run on android
1. Create android emulator with name `Pixel_3a_API_30_x86` and launch it
2. In terminal go to `tests` directory
3. Run `detox build -c android`
4. Run `detox test -c android`

## Run on iOS
1. Launch `iPhone 13` simulator
2. In terminal go to `tests/ios` directory and run `pod install`
3. Run `detox build -c ios`
4. Run `detox test -c ios`
