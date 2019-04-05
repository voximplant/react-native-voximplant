const should = require('should');
const { TEST_LOGIN,
    TEST_PASSWORD,
    TEST_USER_2,
    TEST_USER_3 } = TestHelpers.credentials;

describe('conversation', () => {
    let client = null;
    let messenger = null;

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

    it('create conversation - default config - no other participants', async () => {
        messenger.should.be.not.null();

        let conversationConfig = {

        };

        let conversationEvent = await messenger.createConversation(conversationConfig);
        console.log(JSON.stringify(conversationEvent));

        should.equal(conversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.CreateConversation, 'eventType is unexpected');
        should.equal(conversationEvent.action, Voximplant.Messaging.MessengerAction.createConversation, 'action is unexpected');
        should.equal(conversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(conversationEvent.sequence, 1);
        should.exist(conversationEvent.timestamp, 'timestamp should exist');

        let conversation = conversationEvent.conversation;
        (conversation).should.have.keys('direct', 'publicJoin', 'uber', 'title', 'uuid', 'createdTime',
            'customData', 'lastUpdateTime', 'lastSequence', 'participants');
        (conversation.direct).should.be.false();
        (conversation.publicJoin).should.be.false();
        (conversation.uber).should.be.false();
        should.equal(conversation.title, 'New conversation');
        should.equal(conversation.lastSequence, 1);
        (conversation.participants).should.be.an.Array();
        should.equal(conversation.participants.length, 1);

        let participant = conversation.participants[0];
        should.equal(participant.imUserId, myIMid);
        (participant.canWrite).should.be.true();
        (participant.canManageParticipants).should.be.true();
        (participant.canEditMessages).should.be.true();
        (participant.canEditAllMessages).should.be.true();
        (participant.canRemoveMessages).should.be.true();
        (participant.canRemoveAllMessages).should.be.true();
        (participant.owner).should.be.true();
    });

    it('create conversation - default config - with another user', async () => {
        messenger.should.be.not.null();

        //canWrite, canEditMessages, canRemoveMessages - true by default
        let conversationParticipant = {
            imUserId: testUser2IMId,
            canEditAllMessages: true,
            canManageParticipants: true
        };

        let conversationConfig = {
            participants: [conversationParticipant]
        };

        let conversationEvent = await messenger.createConversation(conversationConfig);
        console.log(JSON.stringify(conversationEvent));
        should.equal(conversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.CreateConversation, 'eventType is unexpected');
        should.equal(conversationEvent.action, Voximplant.Messaging.MessengerAction.createConversation, 'action is unexpected');
        should.equal(conversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(conversationEvent.sequence, 1);
        should.exist(conversationEvent.timestamp, 'timestamp should exist');

        let conversation = conversationEvent.conversation;
        (conversation).should.have.keys('direct', 'publicJoin', 'uber', 'title', 'uuid', 'createdTime',
            'customData', 'lastUpdateTime', 'lastSequence', 'participants');
        (conversation.direct).should.be.false();
        (conversation.publicJoin).should.be.false();
        (conversation.uber).should.be.false();
        should.equal(conversation.title, 'New conversation');
        should.equal(conversation.lastSequence, 1);
        (conversation.participants).should.be.an.Array();
        should.equal(conversation.participants.length, 2);

        for (const participant of conversationEvent.conversation.participants) {
            (participant.canWrite).should.be.true();
            (participant.canManageParticipants).should.be.true();
            (participant.canEditMessages).should.be.true();
            (participant.canEditAllMessages).should.be.true();
            (participant.canRemoveMessages).should.be.true();

            // creator has all permissions by default
            if (participant.imUserId === myIMid) {
                (participant.canRemoveAllMessages).should.be.true();
                (participant.owner).should.be.true();
            } else {
                (participant.canRemoveAllMessages).should.be.false();
                (participant.owner).should.be.false();
            }
        }
    });

    it('create conversation - public and uber', async () => {
        messenger.should.be.not.null();

        //canWrite, canEditMessages, canRemoveMessages - true by default
        let conversationParticipant = {
            imUserId: testUser2IMId,
            canRemoveAllMessages: true,
            canManageParticipants: true
        };

        let conversationConfig = {
            participants: [conversationParticipant],
            publicJoin: true,
            uber: true
        };

        let conversationEvent = await messenger.createConversation(conversationConfig);
        console.log(JSON.stringify(conversationEvent));
        should.equal(conversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.CreateConversation, 'eventType is unexpected');
        should.equal(conversationEvent.action, Voximplant.Messaging.MessengerAction.createConversation, 'action is unexpected');
        should.equal(conversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(conversationEvent.sequence, 1);
        should.exist(conversationEvent.timestamp, 'timestamp should exist');

        let conversation = conversationEvent.conversation;
        (conversation).should.have.keys('direct', 'publicJoin', 'uber', 'title', 'uuid', 'createdTime',
            'customData', 'lastUpdateTime', 'lastSequence', 'participants');
        (conversation.direct).should.be.false();
        (conversation.publicJoin).should.be.true();
        (conversation.uber).should.be.true();
        // 'New conversation' - default conversation title
        should.equal(conversation.title, 'New conversation');
        should.equal(conversation.lastSequence, 1);
        (conversation.participants).should.be.an.Array();
        should.equal(conversation.participants.length, 2);

        for (const participant of conversationEvent.conversation.participants) {
            (participant.canWrite).should.be.true();
            (participant.canManageParticipants).should.be.true();
            (participant.canEditMessages).should.be.true();
            (participant.canRemoveMessages).should.be.true();
            (participant.canRemoveAllMessages).should.be.true();

            // creator has all permissions by default
            if (participant.imUserId === myIMid) {
                (participant.canEditAllMessages).should.be.true();
                (participant.owner).should.be.true();
            } else {
                (participant.canEditAllMessages).should.be.false();
                (participant.owner).should.be.false();
            }
        }
    });

    it('create conversation - direct with title and custom data', async () => {
        messenger.should.be.not.null();

        //canWrite, canEditMessages, canRemoveMessages - true by default
        let conversationParticipant = {
            imUserId: testUser2IMId,
            canRemoveAllMessages: true,
            canManageParticipants: true
        };

        let customData = {
            testData: 'some_data'
        };

        let conversationConfig = {
            participants: [conversationParticipant],
            direct: true,
            customData: customData,
            title: 'Test conversation with test user 2'
        };

        let conversationEvent = await messenger.createConversation(conversationConfig);
        console.log(JSON.stringify(conversationEvent));
        should.equal(conversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.CreateConversation, 'eventType is unexpected');
        should.equal(conversationEvent.action, Voximplant.Messaging.MessengerAction.createConversation, 'action is unexpected');
        should.equal(conversationEvent.imUserId, myIMid, 'imUserId is unexpected');

        // if a direct conversation with the same user has been already created, the Messenger.createConversation will return already created conversation
        // sequence number may be not 1.
        should.exist(conversationEvent.sequence);
        should.exist(conversationEvent.timestamp, 'timestamp should exist');

        let conversation = conversationEvent.conversation;
        (conversation).should.have.keys('direct', 'publicJoin', 'uber', 'title', 'uuid', 'createdTime',
            'customData', 'lastUpdateTime', 'lastSequence', 'participants');
        (conversation.direct).should.be.true();
        (conversation.publicJoin).should.be.false();
        (conversation.uber).should.be.false();
        // 'New conversation' - default conversation title
        should.equal(conversation.title, 'Test conversation with test user 2');
        (conversation.participants).should.be.an.Array();
        should.equal(conversation.participants.length, 2);

        should.deepEqual(conversation.customData, customData);

        for (const participant of conversationEvent.conversation.participants) {
            (participant.canWrite).should.be.true();
            (participant.canManageParticipants).should.be.true();
            (participant.canEditMessages).should.be.true();
            (participant.canRemoveMessages).should.be.true();
            (participant.canRemoveAllMessages).should.be.true();

            // creator has all permissions by default
            if (participant.imUserId === myIMid) {
                (participant.canEditAllMessages).should.be.true();
                (participant.owner).should.be.true();
            } else {
                (participant.canEditAllMessages).should.be.false();
                (participant.owner).should.be.false();
            }
        }
    });

    it('get conversation - one of the current user', async () => {
        messenger.should.be.not.null();

        let userEvent = await messenger.getUserByIMId(myIMid);
        should.exist(userEvent.user.conversationList);
        if (userEvent.user.conversationList.length === 0) {
            console.warn('The current user does not have any conversations');
            return;
        }
        let conversationUUID = userEvent.user.conversationList[0];

        let conversationEvent = await messenger.getConversation(conversationUUID);
        console.log(JSON.stringify(conversationEvent));
        should.equal(conversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetConversation, 'eventType is unexpected');
        should.equal(conversationEvent.action, Voximplant.Messaging.MessengerAction.getConversation, 'action is unexpected');
        should.equal(conversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(conversationEvent.sequence, 'sequence should exist');
        should.exist(conversationEvent.timestamp, 'timestamp should exist');

        let conversation = conversationEvent.conversation;
        (conversation).should.have.keys('direct', 'publicJoin', 'uber', 'title', 'uuid', 'createdTime',
            'customData', 'lastUpdateTime', 'lastSequence', 'participants');
        (conversation.participants).should.be.an.Array();

        let foundMyselfInParticipants = false;
        for (const participant of conversationEvent.conversation.participants) {
            if (participant.imUserId === myIMid) {
                foundMyselfInParticipants = true;
                break;
            }
        }

        foundMyselfInParticipants.should.be.true();
    });

    it('get conversations - first 30 from my conversations', async () => {
        messenger.should.be.not.null();
        let userEvent = await messenger.getUserByIMId(myIMid);
        should.exist(userEvent.user.conversationList);
        if (userEvent.user.conversationList.length === 0) {
            console.warn('The current user does not have any conversations');
            return;
        }

        let myConversations = userEvent.user.conversationList.slice(0, 30);

        let myConversationsNumber = myConversations.length;

        let conversationsEvent = await messenger.getConversations(myConversations);
        (conversationsEvent).should.be.an.Array();
        should.equal(conversationsEvent.length, myConversationsNumber);
        for (const event of conversationsEvent) {
            console.log(JSON.stringify(event));
            (event).should.not.be.null();
            should.equal(event.eventType, Voximplant.Messaging.MessengerEventTypes.GetConversation, 'eventType is unexpected');
            should.equal(event.action, Voximplant.Messaging.MessengerAction.getConversations, 'action is unexpected');
            should.equal(event.imUserId, myIMid, 'imUserId is unexpected');
            should.exist(event.sequence, 'sequence should exist');
            should.exist(event.timestamp, 'timestamp should exist');

            let conversation = event.conversation;
            (conversation).should.have.keys('direct', 'publicJoin', 'uber', 'title', 'uuid', 'createdTime',
                'customData', 'lastUpdateTime', 'lastSequence', 'participants');
            (conversation.participants).should.be.an.Array();

            let foundMyselfInParticipants = false;
            for (const participant of event.conversation.participants) {
                if (participant.imUserId === myIMid) {
                    foundMyselfInParticipants = true;
                    break;
                }
            }
            foundMyselfInParticipants.should.be.true();
        }
    });

    it('get public conversations - first 30', async () => {
        messenger.should.be.not.null();

        let conversationListEvent = await messenger.getPublicConversations();
        console.log(JSON.stringify(conversationListEvent));
        should.equal(conversationListEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetPublicConversations, 'eventType is unexpected');
        should.equal(conversationListEvent.action, Voximplant.Messaging.MessengerAction.getPublicConversations, 'action is unexpected');
        should.equal(conversationListEvent.imUserId, myIMid, 'imUserId is unexpected');

        let conversations = conversationListEvent.conversationList.slice(0, 30);
        let conversationsNumber = conversations.length;

        let conversationsEvent = await messenger.getConversations(conversations);
        (conversationsEvent).should.be.an.Array();
        should.equal(conversationsEvent.length, conversationsNumber);

        for (const event of conversationsEvent) {
            console.log(JSON.stringify(event));
            (event).should.not.be.null();
            should.equal(event.eventType, Voximplant.Messaging.MessengerEventTypes.GetConversation, 'eventType is unexpected');
            should.equal(event.action, Voximplant.Messaging.MessengerAction.getConversations, 'action is unexpected');
            should.equal(event.imUserId, myIMid, 'imUserId is unexpected');
            should.exist(event.sequence, 'sequence should exist');
            should.exist(event.timestamp, 'timestamp should exist');

            let conversation = event.conversation;
            (conversation).should.have.keys('direct', 'publicJoin', 'uber', 'title', 'uuid', 'createdTime',
                'customData', 'lastUpdateTime', 'lastSequence', 'participants');
            (conversation.participants).should.be.an.Array();
            (conversation.publicJoin).should.be.true();

        }
    });

    it('add participants', async () => {
        messenger.should.be.not.null();

        let conversationParticipant = {
            imUserId: testUser2IMId,
            canEditAllMessages: true,
            canManageParticipants: true
        };

        let conversationConfig = {
            participants: [conversationParticipant]
        };

        let conversationEvent = await messenger.createConversation(conversationConfig);
        should.equal(conversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.CreateConversation, 'eventType is unexpected');
        should.equal(conversationEvent.action, Voximplant.Messaging.MessengerAction.createConversation, 'action is unexpected');
        should.equal(conversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(conversationEvent.sequence, 1);
        should.exist(conversationEvent.timestamp, 'timestamp should exist');

        let conversation = conversationEvent.conversation;
        (conversation).should.not.be.null();

        let newParticipant = {
            imUserId: testUser3IMId
        };

        let addParticipantEvent = await conversation.addParticipants([newParticipant]);
        console.log(JSON.stringify(addParticipantEvent));
        should.equal(addParticipantEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditConversation, 'eventType is unexpected');
        should.equal(addParticipantEvent.action, Voximplant.Messaging.MessengerAction.addParticipants, 'action is unexpected');
        should.equal(addParticipantEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(addParticipantEvent.sequence, 2);
        should.exist(addParticipantEvent.timestamp, 'timestamp should exist');

        (addParticipantEvent.conversation).should.have.properties({
            uber: conversation.uber,
            publicJoin: conversation.publicJoin,
            direct: conversation.direct,
            createdTime: conversation.createdTime,
            uuid: conversation.uuid,
            customData: conversation.customData
        });

        should.equal(addParticipantEvent.conversation.lastSequence, 2);

        let participants = addParticipantEvent.conversation.participants;
        (participants).should.be.an.Array();
        should.equal(participants.length, 3);

        for (const participant of participants) {
            (participant.canWrite).should.be.true();
            (participant.canEditMessages).should.be.true();
            (participant.canRemoveMessages).should.be.true();

            // creator has all permissions by default
            if (participant.imUserId === myIMid) {
                (participant.canRemoveAllMessages).should.be.true();
                (participant.owner).should.be.true();
                (participant.canManageParticipants).should.be.true();
                (participant.canEditAllMessages).should.be.true();
            } else if (participant.imUserId === testUser2IMId) {
                (participant.canRemoveAllMessages).should.be.false();
                (participant.owner).should.be.false();
                (participant.canManageParticipants).should.be.true();
                (participant.canEditAllMessages).should.be.true();
            } else if (participant.imUserId === testUser3IMId) {
                (participant.canRemoveAllMessages).should.be.false();
                (participant.owner).should.be.false();
                (participant.canManageParticipants).should.be.false();
                (participant.canEditAllMessages).should.be.false();
            }
        }
    });

    it('edit participants', async () => {
        messenger.should.be.not.null();

        let conversationConfig = {
            participants: [
                {
                    imUserId: testUser2IMId,
                },
                {
                    imUserId: testUser3IMId
                }
            ]
        };

        let conversationEvent = await messenger.createConversation(conversationConfig);
        should.equal(conversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.CreateConversation, 'eventType is unexpected');
        should.equal(conversationEvent.action, Voximplant.Messaging.MessengerAction.createConversation, 'action is unexpected');
        should.equal(conversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(conversationEvent.sequence, 1);
        should.exist(conversationEvent.timestamp, 'timestamp should exist');

        let conversation = conversationEvent.conversation;
        (conversation).should.not.be.null();

        let editedParticipants = [
            {
                imUserId: testUser3IMId,
                canManageParticipants: true,
                canRemoveMessages: false
            }
        ];

        let editParticipantEvent = await conversation.editParticipants(editedParticipants);
        console.log(JSON.stringify(editParticipantEvent));
        should.equal(editParticipantEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditConversation, 'eventType is unexpected');
        should.equal(editParticipantEvent.action, Voximplant.Messaging.MessengerAction.editParticipants, 'action is unexpected');
        should.equal(editParticipantEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(editParticipantEvent.sequence, 2);
        should.exist(editParticipantEvent.timestamp, 'timestamp should exist');

        should.equal(editParticipantEvent.conversation.lastSequence, 2);

        let participants = editParticipantEvent.conversation.participants;
        (participants).should.be.an.Array();
        should.equal(participants.length, 3);

        for (const participant of participants) {
            (participant.canWrite).should.be.true();
            (participant.canEditMessages).should.be.true();

            // creator has all permissions by default
            if (participant.imUserId === myIMid) {
                (participant.canRemoveAllMessages).should.be.true();
                (participant.owner).should.be.true();
                (participant.canRemoveMessages).should.be.true();
                (participant.canEditAllMessages).should.be.true();
                (participant.canManageParticipants).should.be.true();
            } else if (participant.imUserId === testUser2IMId) {
                (participant.canRemoveAllMessages).should.be.false();
                (participant.owner).should.be.false();
                (participant.canRemoveMessages).should.be.true();
                (participant.canManageParticipants).should.be.false();
                (participant.canEditAllMessages).should.be.false();
                (participant.canManageParticipants).should.be.false();
            } else if (participant.imUserId === testUser3IMId) {
                (participant.canRemoveAllMessages).should.be.false();
                (participant.owner).should.be.false();
                (participant.canManageParticipants).should.be.true();
                (participant.canRemoveMessages).should.be.false();
                (participant.canEditAllMessages).should.be.false();
            }
        }
    });

    it('remove participants', async () => {
        messenger.should.be.not.null();

        let conversationConfig = {
            participants: [
                {
                    imUserId: testUser2IMId,
                },
                {
                    imUserId: testUser3IMId
                }
            ]
        };

        let conversationEvent = await messenger.createConversation(conversationConfig);
        should.equal(conversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.CreateConversation, 'eventType is unexpected');
        should.equal(conversationEvent.action, Voximplant.Messaging.MessengerAction.createConversation, 'action is unexpected');
        should.equal(conversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(conversationEvent.sequence, 1);
        should.exist(conversationEvent.timestamp, 'timestamp should exist');

        let conversation = conversationEvent.conversation;
        (conversation).should.not.be.null();

        let removeParticipants = [
            {
                imUserId: testUser3IMId
            }
        ];

        let removeConversationEvent = await conversation.removeParticipants(removeParticipants);
        console.log(JSON.stringify(removeConversationEvent));
        should.equal(removeConversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditConversation, 'eventType is unexpected');
        should.equal(removeConversationEvent.action, Voximplant.Messaging.MessengerAction.removeParticipants, 'action is unexpected');
        should.equal(removeConversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(removeConversationEvent.sequence, 2);
        should.exist(removeConversationEvent.timestamp, 'timestamp should exist');

        should.equal(removeConversationEvent.conversation.lastSequence, 2);

        let participants = removeConversationEvent.conversation.participants;
        (participants).should.be.an.Array();
        should.equal(participants.length, 2);

        for (const participant of participants) {
            (participant.canWrite).should.be.true();
            (participant.canEditMessages).should.be.true();
            (participant.canRemoveMessages).should.be.true();

            // creator has all permissions by default
            if (participant.imUserId === myIMid) {
                (participant.canRemoveAllMessages).should.be.true();
                (participant.owner).should.be.true();
                (participant.canEditAllMessages).should.be.true();
                (participant.canManageParticipants).should.be.true();
            } else if (participant.imUserId === testUser2IMId) {
                (participant.canRemoveAllMessages).should.be.false();
                (participant.owner).should.be.false();
                (participant.canManageParticipants).should.be.false();
                (participant.canEditAllMessages).should.be.false();
                (participant.canManageParticipants).should.be.false();
            }
        }
    });


    it('edit conversation', async () => {
        messenger.should.be.not.null();

        let conversationConfig = {};

        let conversationEvent = await messenger.createConversation(conversationConfig);
        console.log(JSON.stringify(conversationEvent));

        should.equal(conversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.CreateConversation, 'eventType is unexpected');
        should.equal(conversationEvent.action, Voximplant.Messaging.MessengerAction.createConversation, 'action is unexpected');
        should.equal(conversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(conversationEvent.sequence, 1);
        should.exist(conversationEvent.timestamp, 'timestamp should exist');

        let conversation = conversationEvent.conversation;
        (conversation).should.have.keys('direct', 'publicJoin', 'uber', 'title', 'uuid', 'createdTime',
            'customData', 'lastUpdateTime', 'lastSequence', 'participants');
        (conversation.direct).should.be.false();
        (conversation.publicJoin).should.be.false();
        (conversation.uber).should.be.false();
        should.equal(conversation.title, 'New conversation');
        should.equal(conversation.lastSequence, 1);
        (conversation.participants).should.be.an.Array();
        should.equal(conversation.participants.length, 1);

        conversation.title = 'Conversation title';
        conversation.publicJoin = true;

        let customData = {
            testData: 'some_data'
        };
        conversation.customData = customData;

        let updateConversationEvent = await conversation.update();
        console.log(JSON.stringify(updateConversationEvent));
        should.equal(updateConversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditConversation, 'eventType is unexpected');
        should.equal(updateConversationEvent.action, Voximplant.Messaging.MessengerAction.editConversation, 'action is unexpected');
        should.equal(updateConversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(updateConversationEvent.sequence, 2);
        should.exist(updateConversationEvent.timestamp, 'timestamp should exist');

        should.exist(updateConversationEvent.conversation);
        (updateConversationEvent.conversation).should.have.keys('direct', 'publicJoin', 'uber', 'title', 'uuid', 'createdTime',
            'customData', 'lastUpdateTime', 'lastSequence', 'participants');
        (updateConversationEvent.conversation.direct).should.be.false();
        (updateConversationEvent.conversation.publicJoin).should.be.true();
        (updateConversationEvent.conversation.uber).should.be.false();
        should.equal(updateConversationEvent.conversation.title, 'Conversation title');
        should.equal(updateConversationEvent.conversation.lastSequence, 2);
        (updateConversationEvent.conversation.participants).should.be.an.Array();
        should.equal(updateConversationEvent.conversation.participants.length, 1);
        should.exist(updateConversationEvent.conversation.customData);
        should.deepEqual(updateConversationEvent.conversation.customData, customData);
    });

    it('typing', async () => {
        messenger.should.be.not.null();

        let conversationConfig = {};

        let conversationEvent = await messenger.createConversation(conversationConfig);
        console.log(JSON.stringify(conversationEvent));

        should.equal(conversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.CreateConversation, 'eventType is unexpected');
        should.equal(conversationEvent.action, Voximplant.Messaging.MessengerAction.createConversation, 'action is unexpected');
        should.equal(conversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(conversationEvent.sequence, 1);
        should.exist(conversationEvent.timestamp, 'timestamp should exist');

        let conversation = conversationEvent.conversation;
        (conversation).should.have.keys('direct', 'publicJoin', 'uber', 'title', 'uuid', 'createdTime',
            'customData', 'lastUpdateTime', 'lastSequence', 'participants');
        (conversation.direct).should.be.false();
        (conversation.publicJoin).should.be.false();
        (conversation.uber).should.be.false();
        should.equal(conversation.title, 'New conversation');
        should.equal(conversation.lastSequence, 1);
        (conversation.participants).should.be.an.Array();
        should.equal(conversation.participants.length, 1);

        let typingEvent = await conversation.typing();
        console.log(JSON.stringify(typingEvent));
        should.equal(typingEvent.eventType, Voximplant.Messaging.MessengerEventTypes.Typing, 'eventType is unexpected');
        should.equal(typingEvent.action, Voximplant.Messaging.MessengerAction.typing, 'action is unexpected');
        should.equal(typingEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(typingEvent.conversationUUID, conversation.uuid);
    });

    it('send message - text only', async () => {
        messenger.should.be.not.null();

        let conversationConfig = {};

        let conversationEvent = await messenger.createConversation(conversationConfig);
        console.log(JSON.stringify(conversationEvent));

        should.equal(conversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.CreateConversation, 'eventType is unexpected');
        should.equal(conversationEvent.action, Voximplant.Messaging.MessengerAction.createConversation, 'action is unexpected');
        should.equal(conversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(conversationEvent.sequence, 1);
        should.exist(conversationEvent.timestamp, 'timestamp should exist');

        let conversation = conversationEvent.conversation;
        (conversation).should.have.keys('direct', 'publicJoin', 'uber', 'title', 'uuid', 'createdTime',
            'customData', 'lastUpdateTime', 'lastSequence', 'participants');

        let messageEvent = await conversation.sendMessage('test message');
        console.log(JSON.stringify(messageEvent));
        should.equal(messageEvent.eventType, Voximplant.Messaging.MessengerEventTypes.SendMessage, 'eventType is unexpected');
        should.equal(messageEvent.action, Voximplant.Messaging.MessengerAction.sendMessage, 'action is unexpected');
        should.equal(messageEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(messageEvent.sequence, 2, 'sequence is unexpected');
        should.exist(messageEvent.timestamp);
        should.exist(messageEvent.message);

        let message = messageEvent.message;
        (message).should.have.keys('conversation', 'uuid', 'text', 'sequence');
        should.equal(message.text, 'test message');
        should.equal(message.conversation, conversation.uuid);
    });

    it('leave join a public conversation', async () => {
        messenger.should.be.not.null();

        let conversationListEvent = await messenger.getPublicConversations();
        console.log(JSON.stringify(conversationListEvent));
        should.equal(conversationListEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetPublicConversations, 'eventType is unexpected');
        should.equal(conversationListEvent.action, Voximplant.Messaging.MessengerAction.getPublicConversations, 'action is unexpected');
        should.equal(conversationListEvent.imUserId, myIMid, 'imUserId is unexpected');

        let conversationUUID = null;

        if (conversationListEvent.conversationList.length === 0) {
            console.log('No public conversations available, create a new one');
            let conversationConfig = {
                publicJoin: true,
                participants: [
                    {
                        imUserId: testUser2IMId
                    }
                ]
            };
            let createConversationEvent = await messenger.createConversation(conversationConfig);
            console.log(JSON.stringify(createConversationEvent));
            should.equal(createConversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.CreateConversation, 'eventType is unexpected');
            should.equal(createConversationEvent.action, Voximplant.Messaging.MessengerAction.createConversation, 'action is unexpected');
            should.equal(createConversationEvent.imUserId, myIMid, 'imUserId is unexpected');
            should.exist(createConversationEvent.conversation);

            conversationUUID = createConversationEvent.conversation.uuid;
        } else {
            console.log('Public conversations are available, use the first one');

            let getConversationEvent = await messenger.getConversation(conversationListEvent.conversationList[0]);
            console.log(JSON.stringify(getConversationEvent));
            should.equal(getConversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetConversation, 'eventType is unexpected');
            should.equal(getConversationEvent.action, Voximplant.Messaging.MessengerAction.getConversation, 'action is unexpected');
            should.equal(getConversationEvent.imUserId, myIMid, 'imUserId is unexpected');
            should.exist(getConversationEvent.conversation);

            conversationUUID = getConversationEvent.conversation.uuid;

            for (const participant of getConversationEvent.conversation.participants) {
                if (participant.imUserId === myIMid) {
                    let leaveConversationEvent = await messenger.leaveConversation(conversationUUID);
                    console.log(JSON.stringify(leaveConversationEvent));
                    should.equal(leaveConversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditConversation, 'eventType is unexpected');
                    should.equal(leaveConversationEvent.action, Voximplant.Messaging.MessengerAction.leaveConversation, 'action is unexpected');
                    should.equal(leaveConversationEvent.imUserId, myIMid, 'imUserId is unexpected');

                    conversationUUID = leaveConversationEvent.conversation.uuid;
                    break;
                }
            }
        }

        let joinConversationEvent = await messenger.joinConversation(conversationUUID);
        console.log(JSON.stringify(joinConversationEvent));
        should.equal(joinConversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditConversation, 'eventType is unexpected');
        should.equal(joinConversationEvent.action, Voximplant.Messaging.MessengerAction.joinConversation, 'action is unexpected');
        should.equal(joinConversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(joinConversationEvent.conversation);
        should.equal(joinConversationEvent.conversation.uuid, conversationUUID);
        should.equal(joinConversationEvent.conversation.publicJoin, true);

        let containsMeAsParticipant = false;
        for (const participant of joinConversationEvent.conversation.participants) {
            if (participant.imUserId === myIMid) {
                containsMeAsParticipant = true;
                break;
            }
        }
        should.equal(containsMeAsParticipant, true);

        let leaveConversationEvent = await messenger.leaveConversation(conversationUUID);
        console.log(JSON.stringify(leaveConversationEvent));
        should.equal(leaveConversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditConversation, 'eventType is unexpected');
        should.equal(leaveConversationEvent.action, Voximplant.Messaging.MessengerAction.leaveConversation, 'action is unexpected');
        should.equal(leaveConversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(leaveConversationEvent.conversation);
        should.equal(leaveConversationEvent.conversation.uuid, conversationUUID);
        should.equal(leaveConversationEvent.conversation.publicJoin, true);

        let getUserEvent = await messenger.getUserByIMId(myIMid);
        console.log(JSON.stringify(getUserEvent));
        should.equal(getUserEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetUser, 'eventType is unexpected');
        should.equal(getUserEvent.action, Voximplant.Messaging.MessengerAction.getUser, 'action is unexpected');
        should.equal(getUserEvent.imUserId, myIMid, 'imUserId is unexpected');
        (getUserEvent.user.leaveConversationList).should.containEql(conversationUUID);


    });

    describe('retransmit events', () => {
        const retransmitModes = ['FROM_TO', 'FROM_COUNT', 'TO_COUNT'];
        let i = 0;

        // 1. create conversation
        // 2. send message
        // 3. edit conversation (title)
        // 4. edit message
        // 5. send message
        // 6. remove message
        // 7. retransmit events all events
        it('retransmit events different modes', async () => {
            while (i < 3) {

                console.log('======== retransmit mode: ' + retransmitModes[i] + ' ========');
                messenger.should.be.not.null();

                // 1. create conversation
                let conversationConfig = {
                    participants: [
                        {
                            imUserId: testUser2IMId,
                            canRemoveAllMessages: true,
                            canManageParticipants: true
                        }
                    ]
                };

                let createConversationEvent = await messenger.createConversation(conversationConfig);
                should.equal(createConversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.CreateConversation, 'eventType is unexpected');
                should.equal(createConversationEvent.action, Voximplant.Messaging.MessengerAction.createConversation, 'action is unexpected');
                should.equal(createConversationEvent.imUserId, myIMid, 'imUserId is unexpected');
                should.equal(createConversationEvent.sequence, 1);
                should.exist(createConversationEvent.timestamp, 'timestamp should exist');

                let conversation = createConversationEvent.conversation;
                should.exist(conversation);

                // 2. send message
                let sendMessageEvent = await conversation.sendMessage('test message');
                should.equal(sendMessageEvent.eventType, Voximplant.Messaging.MessengerEventTypes.SendMessage, 'eventType is unexpected');
                should.equal(sendMessageEvent.action, Voximplant.Messaging.MessengerAction.sendMessage, 'action is unexpected');
                should.equal(sendMessageEvent.imUserId, myIMid, 'imUserId is unexpected');
                should.equal(sendMessageEvent.sequence, 2, 'sequence is unexpected');
                should.exist(sendMessageEvent.timestamp);
                should.exist(sendMessageEvent.message);
                let message = sendMessageEvent.message;

                // 3. edit conversation title
                conversation.title = 'Test conversation';
                let editConversationEvent = await conversation.update();
                should.equal(editConversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditConversation, 'eventType is unexpected');
                should.equal(editConversationEvent.action, Voximplant.Messaging.MessengerAction.editConversation, 'action is unexpected');
                should.equal(editConversationEvent.imUserId, myIMid, 'imUserId is unexpected');
                should.equal(editConversationEvent.sequence, 3, 'sequence is unexpected');
                conversation = editConversationEvent.conversation;

                // 4. edit message
                let editMessageEvent = await message.update('updated test message', null);
                should.equal(editMessageEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditMessage, 'eventType is unexpected');
                should.equal(editMessageEvent.action, Voximplant.Messaging.MessengerAction.editMessage, 'action is unexpected');
                should.equal(editMessageEvent.imUserId, myIMid, 'imUserId is unexpected');
                should.equal(editMessageEvent.sequence, 4, 'sequence is unexpected');

                // 5. send message
                let sendMessageEvent2 = await conversation.sendMessage('another test message');
                should.equal(sendMessageEvent2.eventType, Voximplant.Messaging.MessengerEventTypes.SendMessage, 'eventType is unexpected');
                should.equal(sendMessageEvent2.action, Voximplant.Messaging.MessengerAction.sendMessage, 'action is unexpected');
                should.equal(sendMessageEvent2.imUserId, myIMid, 'imUserId is unexpected');
                should.equal(sendMessageEvent2.sequence, 5, 'sequence is unexpected');
                should.exist(sendMessageEvent2.timestamp);
                should.exist(sendMessageEvent2.message);
                message = sendMessageEvent2.message;

                // 6. remove message
                let removeMessageEvent = await message.remove();
                should.equal(removeMessageEvent.eventType, Voximplant.Messaging.MessengerEventTypes.RemoveMessage, 'eventType is unexpected');
                should.equal(removeMessageEvent.action, Voximplant.Messaging.MessengerAction.removeMessage, 'action is unexpected');
                should.equal(removeMessageEvent.imUserId, myIMid, 'imUserId is unexpected');
                should.equal(removeMessageEvent.sequence, 6, 'sequence is unexpected');
                should.exist(removeMessageEvent.timestamp);
                should.exist(removeMessageEvent.message);


                let retransmitMode = retransmitModes[i];
                let retransmitEvent = null;

                if (retransmitMode === 'FROM_TO') {
                    retransmitEvent = await conversation.retransmitEvents(1, 6);
                } else if (retransmitMode === 'FROM_COUNT') {
                    retransmitEvent = await conversation.retransmitEventsFrom(1, 6);
                } else if (retransmitMode === 'TO_COUNT') {
                    retransmitEvent = await conversation.retransmitEventsTo(6, 6);
                } else {
                    this.fail('unexpected retransmit mode');
                }
                console.log(JSON.stringify(retransmitEvent));
                should.equal(retransmitEvent.eventType, Voximplant.Messaging.MessengerEventTypes.RetransmitEvents, 'eventType is unexpected');
                should.equal(retransmitEvent.action, Voximplant.Messaging.MessengerAction.retransmitEvents, 'action is unexpected');
                should.equal(retransmitEvent.imUserId, myIMid, 'imUserId is unexpected');
                should.equal(retransmitEvent.from, 1);
                should.equal(retransmitEvent.to, 6);
                should.exist(retransmitEvent.events);
                (retransmitEvent.events).should.be.an.Array();
                should.equal(retransmitEvent.events.length, 6);

                // check retransmit events
                let retransmittedCreateConversationEvent = retransmitEvent.events[0];
                console.log('Original event #1');
                console.log(JSON.stringify(createConversationEvent));
                console.log('Retransmitted event #1');
                console.log(JSON.stringify(retransmittedCreateConversationEvent));
                should.equal(retransmittedCreateConversationEvent.eventType, createConversationEvent.eventType);
                should.equal(retransmittedCreateConversationEvent.action, createConversationEvent.action);
                should.equal(retransmittedCreateConversationEvent.imUserId, createConversationEvent.imUserId);
                should.equal(retransmittedCreateConversationEvent.sequence, createConversationEvent.sequence);
                should.equal(retransmittedCreateConversationEvent.timestamp, createConversationEvent.timestamp);
                (retransmittedCreateConversationEvent.conversation).should.have.properties({
                    title: 'New conversation',
                    uber: createConversationEvent.conversation.uber,
                    publicJoin: createConversationEvent.conversation.publicJoin,
                    direct: createConversationEvent.conversation.direct,
                    createdTime: createConversationEvent.conversation.createdTime,
                    uuid: createConversationEvent.conversation.uuid,
                    customData: createConversationEvent.conversation.customData,
                    lastUpdateTime: createConversationEvent.conversation.lastUpdateTime,
                    lastSequence: createConversationEvent.conversation.lastSequence
                });


                let retransmittedSendMessageEvent = retransmitEvent.events[1];
                console.log('Original event #2');
                console.log(JSON.stringify(sendMessageEvent));
                console.log('Retransmitted event #2');
                console.log(JSON.stringify(retransmittedSendMessageEvent));
                should.equal(retransmittedSendMessageEvent.eventType, sendMessageEvent.eventType);
                should.equal(retransmittedSendMessageEvent.action, sendMessageEvent.action);
                should.equal(retransmittedSendMessageEvent.imUserId, sendMessageEvent.imUserId);
                should.equal(retransmittedSendMessageEvent.sequence, sendMessageEvent.sequence);
                should.equal(retransmittedSendMessageEvent.timestamp, sendMessageEvent.timestamp);
                (retransmittedSendMessageEvent.message).should.have.properties({
                    text: sendMessageEvent.message.text,
                    payload: sendMessageEvent.message.payload,
                    sequence: sendMessageEvent.message.sequence,
                    conversation: sendMessageEvent.message.conversation,
                    uuid: sendMessageEvent.message.uuid
                });

                let retransmittedEditConversationEvent = retransmitEvent.events[2];
                console.log('Original event #3');
                console.log(JSON.stringify(editConversationEvent));
                console.log('Retransmitted event #3');
                console.log(JSON.stringify(retransmittedEditConversationEvent));
                should.equal(retransmittedEditConversationEvent.eventType, editConversationEvent.eventType);
                should.equal(retransmittedEditConversationEvent.action, editConversationEvent.action);
                should.equal(retransmittedEditConversationEvent.imUserId, editConversationEvent.imUserId);
                should.equal(retransmittedEditConversationEvent.sequence, editConversationEvent.sequence);
                should.equal(retransmittedEditConversationEvent.timestamp, editConversationEvent.timestamp);
                (retransmittedEditConversationEvent.conversation).should.have.properties({
                    title: editConversationEvent.conversation.title,
                    uber: editConversationEvent.conversation.uber,
                    publicJoin: editConversationEvent.conversation.publicJoin,
                    direct: editConversationEvent.conversation.direct,
                    createdTime: editConversationEvent.conversation.createdTime,
                    uuid: editConversationEvent.conversation.uuid,
                    customData: editConversationEvent.conversation.customData,
                    lastUpdateTime: editConversationEvent.conversation.lastUpdateTime,
                    lastSequence: editConversationEvent.conversation.lastSequence
                });

                let retransmittedEditMessageEvent = retransmitEvent.events[3];
                console.log('Original event #4');
                console.log(JSON.stringify(editMessageEvent));
                console.log('Retransmitted event #4');
                console.log(JSON.stringify(retransmittedEditMessageEvent));
                should.equal(retransmittedEditMessageEvent.eventType, editMessageEvent.eventType);
                should.equal(retransmittedEditMessageEvent.action, editMessageEvent.action);
                should.equal(retransmittedEditMessageEvent.imUserId, editMessageEvent.imUserId);
                should.equal(retransmittedEditMessageEvent.sequence, editMessageEvent.sequence);
                should.equal(retransmittedEditMessageEvent.timestamp, editMessageEvent.timestamp);
                (retransmittedEditMessageEvent.message).should.have.properties({
                    text: editMessageEvent.message.text,
                    payload: editMessageEvent.message.payload,
                    sequence: editMessageEvent.message.sequence,
                    conversation: editMessageEvent.message.conversation,
                    uuid: editMessageEvent.message.uuid
                });

                let retransmittedSendMessageEvent2 = retransmitEvent.events[4];
                console.log('Original event #5');
                console.log(JSON.stringify(sendMessageEvent2));
                console.log('Retransmitted event #5');
                console.log(JSON.stringify(retransmittedSendMessageEvent2));
                should.equal(retransmittedSendMessageEvent2.eventType, sendMessageEvent2.eventType);
                should.equal(retransmittedSendMessageEvent2.action, sendMessageEvent2.action);
                should.equal(retransmittedSendMessageEvent2.imUserId, sendMessageEvent2.imUserId);
                should.equal(retransmittedSendMessageEvent2.sequence, sendMessageEvent2.sequence);
                should.equal(retransmittedSendMessageEvent2.timestamp, sendMessageEvent2.timestamp);
                (retransmittedSendMessageEvent2.message).should.have.properties({
                    text: sendMessageEvent2.message.text,
                    payload: sendMessageEvent2.message.payload,
                    sequence: sendMessageEvent2.message.sequence,
                    conversation: sendMessageEvent2.message.conversation,
                    uuid: sendMessageEvent2.message.uuid
                });

                let retransmittedRemoveMessageEvent = retransmitEvent.events[5];
                console.log('Original event #6');
                console.log(JSON.stringify(removeMessageEvent));
                console.log('Retransmitted event #6');
                console.log(JSON.stringify(retransmittedRemoveMessageEvent));
                should.equal(retransmittedRemoveMessageEvent.eventType, removeMessageEvent.eventType);
                should.equal(retransmittedRemoveMessageEvent.action, removeMessageEvent.action);
                should.equal(retransmittedRemoveMessageEvent.imUserId, removeMessageEvent.imUserId);
                should.equal(retransmittedRemoveMessageEvent.sequence, removeMessageEvent.sequence);
                should.equal(retransmittedRemoveMessageEvent.timestamp, removeMessageEvent.timestamp);
                (retransmittedRemoveMessageEvent.message).should.have.properties({
                    text: removeMessageEvent.message.text,
                    payload: removeMessageEvent.message.payload,
                    sequence: removeMessageEvent.message.sequence,
                    conversation: removeMessageEvent.message.conversation,
                    uuid: removeMessageEvent.message.uuid
                });
                i++;
            }
        });

    });

});