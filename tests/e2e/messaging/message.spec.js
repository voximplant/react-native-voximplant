const should = require('should');
const { TEST_LOGIN,
    TEST_PASSWORD,
    TEST_USER_2,
    TEST_USER_3 } = TestHelpers.credentials;


describe.only('message', () => {

    let client = null;
    let messenger = null;

    let conversation = null;

    let message = null;

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
                title: 'Test conversation 2',
                distinct: false,
                publicJoin: true,
                lastSeq: 1,
                isUber: false
            });
            (event.conversation.participants).should.deepEqual(expectedParticipants);
            should.exist(event.conversation.createdAt);
            should.exist(event.conversation.lastRead);
            should.exist(event.conversation.lastUpdate);
            should.exist(event.conversation.uuid);

            conversation = event.conversation;

            messenger.off(Voximplant.Messaging.MessengerEventTypes.CreateConversation, conversationEvent);

            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.CreateConversation, conversationEvent);
        messenger.createConversation(participants, 'Test conversation 2', false, true, null);
    });

    it('send message', (done) => {
        messenger.should.be.not.null();

        let messageEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.SendMessage);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.sendMessage);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.sequence);
            (event.sequence).should.be.eql(2);
            should.exist(event.message);

            const me = messenger.getMe();
            (event.message).should.have.properties({
                text: 'Test message 1',
                sender: me,
                sequence: 2,
                conversation: conversation.uuid
            });
            should.exist(event.message.uuid);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.SendMessage, messageEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.SendMessage, messageEvent);
        conversation.sendMessage('Test message 1');
    });

    it('send message with payload', (done) => {
        messenger.should.be.not.null();

        let payload = [
            {
                title: 'Test payload title',
                type: 'test',
                data: {
                    test1: "test data 1",
                    test2: "test data 2"
                }
            }
        ];

        let messageEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.SendMessage);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.sendMessage);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.sequence);
            (event.sequence).should.be.eql(3);
            should.exist(event.message);

            const me = messenger.getMe();
            (event.message).should.have.properties({
                text: 'Test message 2',
                sender: me,
                sequence: 3,
                conversation: conversation.uuid
            });
            should.exist(event.message.uuid);
            (event.message.payload).should.containDeep(payload);

            message = event.message;

            messenger.off(Voximplant.Messaging.MessengerEventTypes.SendMessage, messageEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.SendMessage, messageEvent);
        conversation.sendMessage('Test message 2', payload);
    });

    it('edit message', (done) => {
        messenger.should.be.not.null();

        let payload = [
            {
                title: 'Test payload title - edited',
                type: 'test - edited',
                data: {
                    test1: "test data 1 - edited",
                    test2: "test data 2 - edited"
                }
            }
        ];

        let messageEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.EditMessage);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.editMessage);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.sequence);
            (event.sequence).should.be.eql(4);
            should.exist(event.message);

            const me = messenger.getMe();
            (event.message).should.have.properties({
                text: 'Test message 2 - edited',
                sender: me,
                sequence: 4,
                conversation: conversation.uuid,
                uuid: message.uuid
            });
            should.exist(event.message.uuid);
            (event.message.payload).should.containDeep(payload);

            message = event.message;

            messenger.off(Voximplant.Messaging.MessengerEventTypes.EditMessage, messageEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.EditMessage, messageEvent);
        message.setText('Test message 2 - edited');
        message.setPayload(payload);
        message.update();
    });

    it('remove message', (done) => {
        messenger.should.be.not.null();

        let messageEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.RemoveMessage);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.removeMessage);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.sequence);
            (event.sequence).should.be.eql(5);
            should.exist(event.message);
            (event.message).should.have.properties({
                conversation: conversation.uuid,
                uuid: message.uuid
            });

            messenger.off(Voximplant.Messaging.MessengerEventTypes.RemoveMessage, messageEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.RemoveMessage, messageEvent);
        message.remove();
    });

    it('mark as delivered', (done) => {
        messenger.should.be.not.null();

        let conversationServiceEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.Delivered);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.delivered);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.conversationUUID);
            (event.conversationUUID).should.be.eql(conversation.uuid);
            should.exist(event.sequence);
            (event.sequence).should.be.eql(2);
            should.exist(event.timestamp);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.Delivered, conversationServiceEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.Delivered, conversationServiceEvent);
        conversation.markAsDelivered(2);
    });

    it('mark as read', (done) => {
        messenger.should.be.not.null();

        let conversationServiceEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.Read);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.read);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.conversationUUID);
            (event.conversationUUID).should.be.eql(conversation.uuid);
            should.exist(event.sequence);
            (event.sequence).should.be.eql(2);
            should.exist(event.timestamp);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.Read, conversationServiceEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.Read, conversationServiceEvent);
        conversation.markAsRead(2);
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
            (event.sequence).should.be.eql(6);
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