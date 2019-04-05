### Test project

## Before you start
1. Create 3 Voximplant users
2. Replace required credentials with Voximplant users credentials in `tests/helpers/Credentials.js` 
3. In terminal go to `tests` directory and run `npm install`
4. In terminal run `yarn run packager-jet`
5. To run the tests on iOS, ensure [xcpretty](https://github.com/supermarin/xcpretty) is installed

## Run on android
1. Create android emulator with name `TestingAVD` and launch it
2. In terminal go to `tests` directory
3. Run `yarn run build-android`
4. Run `yarn run test-android`

## Run on iOS
1. Launch `iPhone 7` simulator
2. In terminal go to `tests/ios` directory and run `pod install`
3. From `tests` directory run `yarn run build-ios`
4. From `tests` directory run `yarn run test-ios` 
