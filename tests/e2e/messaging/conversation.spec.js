const should = require('should');
const { TEST_LOGIN,
    TEST_PASSWORD,
    TEST_USER_2,
    TEST_USER_3 } = TestHelpers.credentials;

describe('conversation', () => {
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
        messenger.createConversation(participants, 'Test conversation 1', false, true, null);
    });

    it('get conversation', (done) => {
        messenger.should.be.not.null();

        let conversationEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.GetConversation);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.getConversation);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.sequence);
            (event.sequence).should.be.eql(1);
            should.exist(event.conversation);
            (event.conversation).should.have.properties({
                title: conversation.title,
                distinct: conversation.distinct,
                publicJoin: conversation.publicJoin,
                lastSeq: conversation.lastSeq,
                isUber: conversation.isUber,
                participants: conversation.participants,
                createdAt: conversation.createdAt,
                lastRead: conversation.lastRead,
                lastUpdate: conversation.lastUpdate,
                uuid: conversation.uuid
            });

            messenger.off(Voximplant.Messaging.MessengerEventTypes.GetConversation, conversationEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.GetConversation, conversationEvent);
        messenger.getConversation(conversation.uuid);
    });

    it('remove participants', (done) => {
        messenger.should.be.not.null();

        const me = messenger.getMe();
        let removedParticipants = [
            {
                userId: TEST_USER_3,
                canWrite: true,
                canManageParticipants: true
            }
        ];

        let resultParticipants = [
            {
                userId: me,
                canWrite: true,
                canManageParticipants: true
            },
            {
                userId: TEST_USER_2,
                canWrite: true,
                canManageParticipants: false
            }
        ];

        let conversationEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.EditConversation);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.removeParticipants);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.sequence);
            (event.sequence).should.be.eql(2);
            should.exist(event.conversation);
            (event.conversation).should.have.properties({
                title: conversation.title,
                distinct: conversation.distinct,
                publicJoin: conversation.publicJoin,
                lastSeq: 2,
                isUber: conversation.isUber,
                createdAt: conversation.createdAt,
                lastRead: conversation.lastRead,
                uuid: conversation.uuid
            });

            should.exist(event.conversation.participants);
            (event.conversation.participants).should.containDeep(resultParticipants);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.EditConversation, conversationEvent);

            conversation = event.conversation;
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.EditConversation, conversationEvent);
        conversation.removeParticipants(removedParticipants);
    });

    it('add participants', (done) => {
        messenger.should.be.not.null();

        const me = messenger.getMe();
        let addedParticipants = [
            {
                userId: TEST_USER_3,
                canWrite: true,
                canManageParticipants: true
            }
        ];

        let resultParticipants = [
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
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.EditConversation);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.addParticipants);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.sequence);
            (event.sequence).should.be.eql(3);
            should.exist(event.conversation);
            (event.conversation).should.have.properties({
                title: conversation.title,
                distinct: conversation.distinct,
                publicJoin: conversation.publicJoin,
                lastSeq: 3,
                isUber: conversation.isUber,
                createdAt: conversation.createdAt,
                lastRead: conversation.lastRead,
                uuid: conversation.uuid
            });

            should.exist(event.conversation.participants);
            (event.conversation.participants).should.containDeep(resultParticipants);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.EditConversation, conversationEvent);

            conversation = event.conversation;

            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.EditConversation, conversationEvent);
        conversation.addParticipants(addedParticipants);
    });

    it('edit participants', (done) => {
        messenger.should.be.not.null();

        const me = messenger.getMe();
        let editedParticipants = [
            {
                userId: TEST_USER_3,
                canWrite: true,
                canManageParticipants: false
            }
        ];

        let resultParticipants = [
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
                canManageParticipants: false
            }
        ];

        let conversationEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.EditConversation);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.editParticipants);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.sequence);
            (event.sequence).should.be.eql(4);
            should.exist(event.conversation);
            (event.conversation).should.have.properties({
                title: conversation.title,
                distinct: conversation.distinct,
                publicJoin: conversation.publicJoin,
                lastSeq: 4,
                isUber: conversation.isUber,
                createdAt: conversation.createdAt,
                lastRead: conversation.lastRead,
                uuid: conversation.uuid
            });

            should.exist(event.conversation.participants);
            (event.conversation.participants).should.containDeep(resultParticipants);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.EditConversation, conversationEvent);

            conversation = event.conversation;
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.EditConversation, conversationEvent);
        conversation.editParticipants(editedParticipants);
    });

    it('edit conversation', (done) => {
        messenger.should.be.not.null();
        let customData = {
            conversationCD: 'Conversation custom data test',
            testCD: '123456'
        };

        let conversationEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.EditConversation);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.editConversation);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.sequence);
            (event.sequence).should.be.eql(5);
            should.exist(event.conversation);
            (event.conversation).should.have.properties({
                title: 'New test conversation title',
                distinct: false,
                publicJoin: false,
                lastSeq: 5,
                isUber: conversation.isUber,
                createdAt: conversation.createdAt,
                lastRead: conversation.lastRead,
                uuid: conversation.uuid
            });

            should.exist(event.conversation.participants);
            (event.conversation.participants).should.containDeep(conversation.participants);

            should.exist(event.conversation.customData);
            (event.conversation.customData).should.containDeep(customData);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.EditConversation, conversationEvent);

            conversation = event.conversation;
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.EditConversation, conversationEvent);

        conversation.setPublicJoin(false);
        conversation.setDistinct(false);
        conversation.setCustomData(customData);
        conversation.setTitle('New test conversation title');
        conversation.update();
    });

    it('typing', (done) => {
        messenger.should.be.not.null();

        let conversationServiceEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.Typing);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.typing);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            (event.conversationUUID).should.be.eql(conversation.uuid);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.Typing, conversationServiceEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.Typing, conversationServiceEvent);
        conversation.typing();
    });

    it('retransmit events', (done) => {
        messenger.should.be.not.null();

        let retransmitEvent = (event) => {
            console.log(JSON.stringify(event));
            should.exist(event.messengerEventType);
            should.equal(event.messengerEventType, Voximplant.Messaging.MessengerEventTypes.RetransmitEvents);
            should.exist(event.messengerAction);
            should.equal(event.messengerAction, Voximplant.Messaging.MessengerAction.retransmitEvents);
            should.exist(event.userId);
            should.equal(event.userId, messenger.getMe());
            should.exist(event.events);
            event.events.forEach(retransmitEvent => {
                console.log(JSON.stringify(retransmitEvent));
                should.exist(retransmitEvent.conversation);
                (retransmitEvent.conversation.uuid).should.be.eql(conversation.uuid);
                (retransmitEvent.conversation).should.have.keys('title', 'distinct', 'publicJoin', 'participants',
                    'lastSeq', 'createdAt', 'isUber', 'lastRead');
            });

            messenger.off(Voximplant.Messaging.MessengerEventTypes.RetransmitEvents, retransmitEvent);
            done();
        };

        messenger.on(Voximplant.Messaging.MessengerEventTypes.RetransmitEvents, retransmitEvent);
        conversation.retransmitEvents(1, conversation.lastSeq);

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