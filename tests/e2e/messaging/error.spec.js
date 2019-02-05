const should = require('should');
const { TEST_LOGIN,
    TEST_PASSWORD,
    TEST_USER_2,
    TEST_USER_3 } = TestHelpers.credentials;

describe('error', () => {
    let client = null;
    let messenger = null;
    let conversation = null;

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

    it('create conversation', (done) => {
        messenger.should.be.not.null();

        const me = messenger.getMe();
        let participants = [
            {
                userId: TEST_USER_2,
                canWrite: true,
                canManageParticipants: false
            },
            {
                userId: TEST_USER_3,
                canWrite: true,
                canManageParticipants: true
            }
        ];
        let expectedParticipants = [
            {
                userId: me,
                canWrite: true,
                canManageParticipants: true
            },
            {
                userId: TEST_USER_2,
                canWrite: true,
                canManageParticipants: false
            },
            {
                userId: TEST_USER_3,
                canWrite: true,
                canManageParticipants: true
            }
        ];
        let conversationEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.CreateConversation);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.createConversation);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.sequence);
            (event.sequence).should.be.eql(1);
            should.exist(event.conversation);
            (event.conversation).should.have.properties({
                title: 'Test conversation 1',
                distinct: false,
                publicJoin: true,
                lastSeq: 1,
                isUber: false
            });
            (event.conversation.participants).sort((a, b) => a.userId.localeCompare(b.userId))
                .should.deepEqual(expectedParticipants.sort((a, b) => a.userId.localeCompare(b.userId)));
            should.exist(event.conversation.createdAt);
            should.exist(event.conversation.lastRead);
            should.exist(event.conversation.lastUpdate);
            should.exist(event.conversation.uuid);

            conversation = event.conversation;

            messenger.off(Voximplant.Messaging.MessengerEventTypes.CreateConversation, conversationEvent);

            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.CreateConversation, conversationEvent);
        messenger.createConversation(participants, 'Test conversation 1', false, true, null);
    });

    it('user is already in participants list', (done) => {
        let participants = [
            {
                userId: TEST_USER_2,
                canWrite: true,
                canManageParticipants: false
            }
        ];

        let errorEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.Error);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.addParticipants);
            should.exist(event.code);
            (event.code).should.be.eql(13);
            should.exist(event.description);
            (event.description).should.be.eql('User is already in the participants list.');

            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.Error, errorEvent);
        conversation.addParticipants(participants);
    });

    it('remove conversation', (done) => {
        messenger.should.be.not.null();

        let conversationEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.RemoveConversation);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.removeConversation);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.sequence);
            (event.sequence).should.be.eql(2);
            should.exist(event.conversation);
            (event.conversation).should.have.properties({
                uuid: conversation.uuid
            });

            messenger.off(Voximplant.Messaging.MessengerEventTypes.RemoveConversation, conversationEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.RemoveConversation, conversationEvent);
        messenger.removeConversation(conversation.uuid);
    });

});