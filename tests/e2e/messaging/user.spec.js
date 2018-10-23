const should = require('should');
const { TEST_LOGIN,
        TEST_PASSWORD } = TestHelpers.credentials;

describe('Messaging - User tests', () => {
    let client = null;
    let messenger = null;

    before(async() => {
        await device.reloadReactNative();

        client = Voximplant.getInstance();
        await client.connect();
        await client.login(TEST_LOGIN, TEST_PASSWORD);
        messenger = Voximplant.getMessenger();
    });

    after(async() => {
       await client.disconnect();
    });

    it('get me', () => {
        messenger.should.be.not.null();
        const me = messenger.getMe();
        TEST_LOGIN.should.containEql(me);
    });

});