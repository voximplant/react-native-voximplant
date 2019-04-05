const should = require('should');

const { TEST_LOGIN,
    TEST_PASSWORD,
    TEST_USER_2,
    TEST_USER_3 } = TestHelpers.credentials;

describe('error - conversations', () => {
    let client = null;
    let messenger = null;

    let conversation = null;

    let myIMid;
    let testUser2IMId;
    let testUser3IMId;

    before(async () => {
        await device.reloadReactNative();

        client = Voximplant.getInstance();
        await client.connect();
        await client.login(TEST_LOGIN, TEST_PASSWORD);

        messenger = Voximplant.getMessenger();

        myIMid = (await messenger.getUserByName(messenger.getMe())).user.imId;
        testUser2IMId = (await messenger.getUserByName(TEST_USER_2)).user.imId;
        testUser3IMId = (await messenger.getUserByName(TEST_USER_3)).user.imId;
    });

    after(async () => {
        await client.disconnect();
    });

    it('error - create direct and public conversation', async () => {
        let conversationParticipant = {
            imUserId: testUser2IMId,
            canRemoveAllMessages: true,
            canManageParticipants: true
        };

        let conversationConfig = {
            participants: [conversationParticipant],
            publicJoin: true,
            direct: true
        };

        should.exist(messenger);
        try {
            await messenger.createConversation(conversationConfig);
        } catch (errorEvent) {
            console.log(JSON.stringify(errorEvent));
            should.equal(errorEvent.code, 34);
            should.equal(errorEvent.description, 'Direct conversation cannot be public or uber.');
            should.equal(errorEvent.eventType, Voximplant.Messaging.MessengerEventTypes.Error);
            should.equal(errorEvent.action, Voximplant.Messaging.MessengerAction.createConversation);
        }
    });

    it('error - create direct and uber conversation', async () => {
        let conversationParticipant = {
            imUserId: testUser2IMId,
            canRemoveAllMessages: true,
            canManageParticipants: true
        };

        let conversationConfig = {
            participants: [conversationParticipant],
            direct: true,
            uber: true
        };

        should.exist(messenger);
        try {
            await messenger.createConversation(conversationConfig);
        } catch (errorEvent) {
            console.log(JSON.stringify(errorEvent));
            should.equal(errorEvent.code, 34);
            should.equal(errorEvent.description, 'Direct conversation cannot be public or uber.');
            should.equal(errorEvent.eventType, Voximplant.Messaging.MessengerEventTypes.Error);
            should.equal(errorEvent.action, Voximplant.Messaging.MessengerAction.createConversation);
        }
    });

    it('error - create direct conversation without another participant', async () => {
        let conversationConfig = {
            direct: true
        };

        should.exist(messenger);
        try {
            await messenger.createConversation(conversationConfig);
        } catch (errorEvent) {
            console.log(JSON.stringify(errorEvent));
            should.equal(errorEvent.code, 35);
            should.equal(errorEvent.description, 'Direct conversation is allowed between two users only.');
            should.equal(errorEvent.eventType, Voximplant.Messaging.MessengerEventTypes.Error);
            should.equal(errorEvent.action, Voximplant.Messaging.MessengerAction.createConversation);
        }
    });

});