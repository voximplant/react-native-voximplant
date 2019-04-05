const should = require('should');
const { TEST_LOGIN,
    TEST_PASSWORD,
    TEST_USER_2,
    TEST_USER_3 } = TestHelpers.credentials;


describe('message', () => {
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


    it('send message - text and payload', async () => {
        messenger.should.be.not.null();

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

        const messageText = 'test message';
        const messagePayload = [
            {
                testString: 'test_string',
                testNumber: 12344,
                testBoolean: true,
                testArray: [1, 2, 4, 7]
            },
            {
                testObject: {
                    testString: 'test_string_2'
                }
            }
        ];

        let messageEvent = await conversation.sendMessage(messageText, messagePayload);
        console.log(JSON.stringify(messageEvent));
        should.equal(messageEvent.eventType, Voximplant.Messaging.MessengerEventTypes.SendMessage, 'eventType is unexpected');
        should.equal(messageEvent.action, Voximplant.Messaging.MessengerAction.sendMessage, 'action is unexpected');
        should.equal(messageEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(messageEvent.sequence, 2);
        should.exist(messageEvent.timestamp, 'timestamp should exist');
        should.exist(messageEvent.message);

        let message = messageEvent.message;
        (message).should.have.keys('conversation', 'uuid', 'text', 'sequence', 'payload');
        should.equal(message.conversation, conversation.uuid);
        should.equal(message.text, messageText);
        should.deepEqual(message.payload, messagePayload);
        should.equal(message.sequence, 2);
    });


    it('edit message', async () => {
        messenger.should.be.not.null();

        messenger.should.be.not.null();

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

        const messageText = 'test message';
        const messagePayload = [
            {
                testString: 'test_string',
                testNumber: 12344,
                testBoolean: true,
                testArray: [1, 2, 4, 7]
            },
            {
                testObject: {
                    testString: 'test_string_2'
                }
            }
        ];

        let messageEvent = await conversation.sendMessage(messageText, messagePayload);
        console.log(JSON.stringify(messageEvent));
        should.equal(messageEvent.eventType, Voximplant.Messaging.MessengerEventTypes.SendMessage, 'eventType is unexpected');
        should.equal(messageEvent.action, Voximplant.Messaging.MessengerAction.sendMessage, 'action is unexpected');
        should.equal(messageEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(messageEvent.sequence, 2);
        should.exist(messageEvent.timestamp, 'timestamp should exist');
        should.exist(messageEvent.message);

        let message = messageEvent.message;
        (message).should.have.keys('conversation', 'uuid', 'text', 'sequence', 'payload');
        should.equal(message.conversation, conversation.uuid);
        should.equal(message.text, messageText);
        should.deepEqual(message.payload, messagePayload);
        should.equal(message.sequence, 2);


        let messageNewText = 'new test message';
        let editMessageEvent = await message.update(messageNewText);
        console.log(JSON.stringify(editMessageEvent));
        should.equal(editMessageEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditMessage, 'eventType is unexpected');
        should.equal(editMessageEvent.action, Voximplant.Messaging.MessengerAction.editMessage, 'action is unexpected');
        should.equal(editMessageEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(editMessageEvent.sequence, 3);
        should.exist(editMessageEvent.timestamp, 'timestamp should exist');
        should.exist(editMessageEvent.message);

        let editedMessage = editMessageEvent.message;
        (editedMessage).should.have.keys('conversation', 'uuid', 'text', 'sequence', 'payload');
        should.equal(editedMessage.conversation, conversation.uuid);
        should.equal(editedMessage.text, messageNewText);
        should.deepEqual(editedMessage.payload, messagePayload);
        should.equal(editedMessage.sequence, 3);
    });

    it('remove message', async () => {
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

        let removeMessageEvent = await message.remove();
        console.log(JSON.stringify(removeMessageEvent));
        should.equal(removeMessageEvent.eventType, Voximplant.Messaging.MessengerEventTypes.RemoveMessage, 'eventType is unexpected');
        should.equal(removeMessageEvent.action, Voximplant.Messaging.MessengerAction.removeMessage, 'action is unexpected');
        should.equal(removeMessageEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(removeMessageEvent.sequence, 3, 'sequence is unexpected');
        should.exist(removeMessageEvent.timestamp);
        should.exist(removeMessageEvent.message);

        let removedMessage = removeMessageEvent.message;
        should.equal(removedMessage.conversation, conversation.uuid);
        should.equal(removedMessage.uuid, message.uuid);
        should.equal(removedMessage.sequence, 3);
    });

    it('mark as read', async () => {
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

        let markAsReadEvent = await conversation.markAsRead(message.sequence);
        console.log(JSON.stringify(markAsReadEvent));
        should.equal(markAsReadEvent.eventType, Voximplant.Messaging.MessengerEventTypes.Read, 'eventType is unexpected');
        should.equal(markAsReadEvent.action, Voximplant.Messaging.MessengerAction.read, 'action is unexpected');
        should.equal(markAsReadEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(markAsReadEvent.sequence, message.sequence);
        should.equal(markAsReadEvent.conversationUUID, conversation.uuid);

        let getConversationEvent = await messenger.getConversation(conversation.uuid);
        should.equal(getConversationEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetConversation, 'eventType is unexpected');
        should.equal(getConversationEvent.action, Voximplant.Messaging.MessengerAction.getConversation, 'action is unexpected');
        should.equal(getConversationEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.equal(getConversationEvent.conversation.participants[0].lastReadEventSequence, message.sequence);

    });

});