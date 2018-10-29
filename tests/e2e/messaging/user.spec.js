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
        messenger.on(Voximplant.Messaging.MessengerEventTypes.GetUser, (userEvent) => {
            console.log(JSON.stringify(userEvent));
            should.exist(userEvent.messengerEventType);
            should.equal(userEvent.messengerEventType, Voximplant.Messaging.MessengerEventTypes.GetUser);
            should.exist(userEvent.messengerAction);
            should.equal(userEvent.messengerAction, Voximplant.Messaging.MessengerAction.getUser);
            should.exist(userEvent.userId);
            should.equal(userEvent.userId, messenger.getMe());
            should.exist(userEvent.user);
            should.equal(userEvent.user.userId, TEST_USER_2);
            should.exist(userEvent.user.conversationsList);
            done();
        });
        messenger.getUser(TEST_USER_2);
    });

    it('set status', (done) => {
        messenger.should.be.not.null();
        messenger.on(Voximplant.Messaging.MessengerEventTypes.SetStatus, (statusEvent) => {
            console.log(JSON.stringify(statusEvent));
            should.exist(statusEvent.messengerEventType);
            should.equal(statusEvent.messengerEventType, Voximplant.Messaging.MessengerEventTypes.SetStatus);
            should.exist(statusEvent.messengerAction);
            should.equal(statusEvent.messengerAction, Voximplant.Messaging.MessengerAction.setStatus);
            should.exist(statusEvent.userId);
            should.equal(statusEvent.userId, messenger.getMe());
            should.exist(statusEvent.userStatus);
            should.exist(statusEvent.userStatus.online);
            (statusEvent.userStatus.online).should.be.true();
            should.exist(statusEvent.userStatus.timestamp);
            done();
        });
        messenger.setStatus(true);
    });

});