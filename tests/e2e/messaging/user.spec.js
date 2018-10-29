const should = require('should');
const { TEST_LOGIN,
        TEST_PASSWORD,
        TEST_USER_2 } = TestHelpers.credentials;

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

    it('get user', (done) => {
        messenger.should.be.not.null();
        let callback = sinon.spy();
        messenger.on(Voximplant.Messaging.MessengerEventTypes.GetUser, (userEvent) => {
            console.log(JSON.stringify(userEvent));
            should.exist(userEvent.messengerEventType);
            should.exist(userEvent.messengerAction);
            should.exist(userEvent.userId);
            should.exist(userEvent.user);
            done();
        });
        messenger.getUser(TEST_USER_2);
    });

});