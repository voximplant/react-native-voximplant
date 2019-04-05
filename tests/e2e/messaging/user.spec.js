const should = require('should');
const { TEST_LOGIN,
        TEST_PASSWORD,
        TEST_USER_2,
        TEST_USER_3 } = TestHelpers.credentials;

describe('user', () => {
    let client = null;
    let messenger = null;
    let myIMid;
    let myUser;
    let testUser2IMId;
    let testUser3IMId;

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

    it('get user (me) by name', async () => {
        messenger.should.be.not.null();

        let userEvent = await messenger.getUserByName(messenger.getMe());
        console.log(JSON.stringify(userEvent));
        should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetUser, 'eventType is unexpected');
        should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.getUser, 'action is unexpected');
        should.exist(userEvent.imUserId);
        should.exist(userEvent.user);
        const user = userEvent.user;
        (user).should.have.keys('imId', 'name', 'displayName', 'conversationList', 'leaveConversationList', 'notifications',
            'customData', 'privateCustomData', 'isDeleted');

        myIMid = user.imId;
        myUser = user;
        should.equal(user.name, messenger.getMe(), 'user name is unexpected');
        (user.isDeleted).should.be.false('user should not be deleted');
    });

    it('get user (me) by id', async () => {
        messenger.should.be.not.null();

        let userEvent = await messenger.getUserByIMId(myIMid);
        console.log(JSON.stringify(userEvent));

        should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetUser, 'eventType is unexpected');
        should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.getUser, 'action is unexpected');
        should.equal(userEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(userEvent.user);
        const user = userEvent.user;

        (user).should.have.properties({
            imId: myUser.imId,
            name: myUser.name,
            displayName: myUser.displayName,
            notifications: myUser.notifications,
            customData: myUser.customData,
            privateCustomData: myUser.privateCustomData,
            isDeleted: myUser.isDeleted
        });

        ((user.conversationList).sort()).should.deepEqual((myUser.conversationList).sort());
        ((user.leaveConversationList).sort()).should.deepEqual((myUser.leaveConversationList).sort());
    });

    it('get user (another) by name', async () => {
        messenger.should.be.not.null();

        let userEvent = await messenger.getUserByName(TEST_USER_2);
        console.log(JSON.stringify(userEvent));

        should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetUser, 'eventType is unexpected');
        should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.getUser, 'action is unexpected');
        should.equal(userEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(userEvent.user);
        const user = userEvent.user;

        (user).should.have.keys('imId', 'name', 'displayName', 'isDeleted', 'customData');
        (user).should.not.have.keys('conversationList', 'leaveConversationList', 'notifications', 'privateCustomData');
        should.equal(user.name, TEST_USER_2, 'user name is unexpected');
        (user.isDeleted).should.be.false('user should not be deleted');

        testUser2IMId = user.imId;
    });

    it('get user (another) by id', async () => {
        messenger.should.be.not.null();

        let userEvent = await messenger.getUserByIMId(testUser2IMId);
        console.log(JSON.stringify(userEvent));

        should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetUser, 'eventType is unexpected');
        should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.getUser, 'action is unexpected');
        should.equal(userEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(userEvent.user);
        const user = userEvent.user;

        (user).should.have.keys('imId', 'name', 'displayName', 'isDeleted', 'customData');
        (user).should.not.have.keys('conversationList', 'leaveConversationList', 'notifications', 'privateCustomData');
        should.equal(user.name, TEST_USER_2, 'user name is unexpected');
        should.equal(user.imId, testUser2IMId);
        (user.isDeleted).should.be.false('user should not be deleted');

        testUser2IMId = user.imId;
    });

    it('get users by name', async () => {
        messenger.should.be.not.null();

        const users = [messenger.getMe(), TEST_USER_2, TEST_USER_3];
        let userEvents = await messenger.getUsersByName(users);

        (userEvents).should.be.Array();
        (userEvents).should.have.size(users.length);

        for (const userEvent of userEvents) {
            console.log('USER: ');
            console.log(JSON.stringify(userEvent));
            should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetUser, 'eventType is unexpected');
            should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.getUsers, 'action is unexpected');
            should.equal(userEvent.imUserId, myIMid, 'imUserId is unexpected');
            should.exist(userEvent.user);

            const user = userEvent.user;
            if (user.imId === myIMid) {
                (user).should.have.keys('imId', 'name', 'displayName', 'conversationList', 'leaveConversationList', 'notifications',
                    'customData', 'privateCustomData', 'isDeleted');
            } else {
                (user).should.have.keys('imId', 'name', 'displayName', 'isDeleted', 'customData');
                (user).should.not.have.keys('conversationList', 'leaveConversationList', 'notifications', 'privateCustomData');
                if (user.name === TEST_USER_3) {
                    testUser3IMId = user.imId;
                }
            }
            (user.isDeleted).should.be.false('user should not be deleted');
        }
    });

    it('get users by im id', async () => {
        messenger.should.be.not.null();

        const users = [myIMid, testUser2IMId, testUser3IMId];
        let userEvents = await messenger.getUsersByIMId(users);

        (userEvents).should.be.Array();
        (userEvents).should.have.size(users.length);

        for (const userEvent of userEvents) {
            console.log('USER: ');
            console.log(JSON.stringify(userEvent));
            should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetUser, 'eventType is unexpected');
            should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.getUsers, 'action is unexpected');
            should.equal(userEvent.imUserId, myIMid, 'imUserId is unexpected');
            should.exist(userEvent.user);

            const user = userEvent.user;
            if (user.imId === myIMid) {
                (user).should.have.keys('imId', 'name', 'displayName', 'conversationList', 'leaveConversationList', 'notifications',
                    'customData', 'privateCustomData', 'isDeleted');
            } else {
                (user).should.have.keys('imId', 'name', 'displayName', 'isDeleted', 'customData');
                (user).should.not.have.keys('conversationList', 'leaveConversationList', 'notifications', 'privateCustomData');
                if (user.name === TEST_USER_3) {
                    testUser3IMId = user.imId;
                }
            }
            (user.isDeleted).should.be.false('user should not be deleted');
        }
    });

    it('edit user custom data with string', async () => {
        messenger.should.not.be.null();
        let customDataTest = {
            testCustomData : "Test custom data 111",
            testCustomData2 : "Test custom data 2222"
        };
        let privateCustomDataTest = {
            testPrivateData: "Test private data 111",
            testPrivateData2: "Test private data 2222"
        };


        let userEvent = await messenger.editUser(customDataTest, privateCustomDataTest);
        console.log(JSON.stringify(userEvent));

        should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditUser, 'eventType is unexpected');
        should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.editUser, 'action is unexpected');
        should.equal(userEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(userEvent.user);
        const user = userEvent.user;

        (user).should.have.keys('imId', 'name', 'displayName', 'conversationList', 'leaveConversationList', 'notifications',
            'customData', 'privateCustomData', 'isDeleted');
        (user.customData).should.eql(customDataTest);
        (user.privateCustomData).should.eql(privateCustomDataTest);
    });

    it('edit user custom data with number', async () => {
        messenger.should.not.be.null();
        let customDataTest = {
            testCustomData : 123,
            testCustomData2 : 456
        };
        let privateCustomDataTest = {
            testPrivateData: 789,
            testPrivateData2: 890
        };

        let userEvent = await messenger.editUser(customDataTest, privateCustomDataTest);
        console.log(JSON.stringify(userEvent));

        should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditUser, 'eventType is unexpected');
        should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.editUser, 'action is unexpected');
        should.equal(userEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(userEvent.user);
        const user = userEvent.user;

        (user).should.have.keys('imId', 'name', 'displayName', 'conversationList', 'leaveConversationList', 'notifications',
            'customData', 'privateCustomData', 'isDeleted');
        (user.customData).should.eql(customDataTest);
        (user.privateCustomData).should.eql(privateCustomDataTest);
    });

    it('edit user custom data with boolean', async () => {
        messenger.should.not.be.null();
        let customDataTest = {
            testCustomData : true,
            testCustomData2 : false
        };
        let privateCustomDataTest = {
            testPrivateData: false,
            testPrivateData2: true
        };

        let userEvent = await messenger.editUser(customDataTest, privateCustomDataTest);
        console.log(JSON.stringify(userEvent));

        should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditUser, 'eventType is unexpected');
        should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.editUser, 'action is unexpected');
        should.equal(userEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(userEvent.user);
        const user = userEvent.user;

        (user).should.have.keys('imId', 'name', 'displayName', 'conversationList', 'leaveConversationList', 'notifications',
            'customData', 'privateCustomData', 'isDeleted');
        (user.customData).should.eql(customDataTest);
        (user.privateCustomData).should.eql(privateCustomDataTest);
    });

    it('edit user custom data with array', async () => {
        messenger.should.not.be.null();
        let customDataTest = {
            testCustomData : ["data 1", "data 2"],
            testCustomData2 : [123, 456]
        };
        let privateCustomDataTest = {
            testPrivateData: [true, true],
            testPrivateData2: []
        };

        let userEvent = await messenger.editUser(customDataTest, privateCustomDataTest);
        console.log(JSON.stringify(userEvent));

        should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditUser, 'eventType is unexpected');
        should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.editUser, 'action is unexpected');
        should.equal(userEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(userEvent.user);
        const user = userEvent.user;

        (user).should.have.keys('imId', 'name', 'displayName', 'conversationList', 'leaveConversationList', 'notifications',
            'customData', 'privateCustomData', 'isDeleted');
        (user.customData).should.eql(customDataTest);
        (user.privateCustomData).should.eql(privateCustomDataTest);
    });

    it('edit user custom data with map', async () => {
        messenger.should.not.be.null();
        let customDataTest = {
            testCustomData : { data : "data"},
            testCustomData2 : { key : 12344}
        };
        let privateCustomDataTest = {
            testPrivateData: {data : true },
            testPrivateData2: { key : false }
        };

        let userEvent = await messenger.editUser(customDataTest, privateCustomDataTest);
        console.log(JSON.stringify(userEvent));

        should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditUser, 'eventType is unexpected');
        should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.editUser, 'action is unexpected');
        should.equal(userEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(userEvent.user);
        const user = userEvent.user;

        (user).should.have.keys('imId', 'name', 'displayName', 'conversationList', 'leaveConversationList', 'notifications',
            'customData', 'privateCustomData', 'isDeleted');
        (user.customData).should.eql(customDataTest);
        (user.privateCustomData).should.eql(privateCustomDataTest);
    });

    it('edit user only custom data', async () => {
        messenger.should.not.be.null();

        let getUserEvent = await messenger.getUserByIMId(myIMid);
        console.log('GET USER:');
        console.log(JSON.stringify(getUserEvent));
        const privateData = getUserEvent.user.privateCustomData;

        let customDataTest = {
            testCustomData : 67890,
            testCustomData2 : 3456788
        };

        let editUserEvent = await messenger.editUser(customDataTest, null);
        console.log('EDIT USER:');
        console.log(JSON.stringify(editUserEvent));

        should.equal(editUserEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditUser, 'eventType is unexpected');
        should.equal(editUserEvent.action, Voximplant.Messaging.MessengerAction.editUser, 'action is unexpected');
        should.equal(editUserEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(editUserEvent.user);
        const user = editUserEvent.user;

        (user).should.have.keys('imId', 'name', 'displayName', 'conversationList', 'leaveConversationList', 'notifications',
            'customData', 'privateCustomData', 'isDeleted');
        (user.customData).should.eql(customDataTest);
        (user.privateCustomData).should.eql(privateData);

    });

    it('edit user remove custom data', async ()=> {
        messenger.should.not.be.null();

        let editUserEvent = await messenger.editUser({}, null);
        console.log(JSON.stringify(editUserEvent));

        should.equal(editUserEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditUser, 'eventType is unexpected');
        should.equal(editUserEvent.action, Voximplant.Messaging.MessengerAction.editUser, 'action is unexpected');
        should.equal(editUserEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(editUserEvent.user);
        const user = editUserEvent.user;

        (user).should.have.keys('imId', 'name', 'displayName', 'conversationList', 'leaveConversationList', 'notifications',
            'customData', 'privateCustomData', 'isDeleted');

        (user.customData).should.eql({});
    });

    it('set status to online', async () => {
        messenger.should.be.not.null();

        let statusEvent = await messenger.setStatus(true);
        console.log(JSON.stringify(statusEvent));

        should.equal(statusEvent.eventType, Voximplant.Messaging.MessengerEventTypes.SetStatus);
        should.equal(statusEvent.action, Voximplant.Messaging.MessengerAction.setStatus);
        should.equal(statusEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(statusEvent.online);
        (statusEvent.online).should.be.true();
    });

    it('set status to offline', async () => {
        messenger.should.be.not.null();

        let statusEvent = await messenger.setStatus(false);
        console.log(JSON.stringify(statusEvent));

        should.equal(statusEvent.eventType, Voximplant.Messaging.MessengerEventTypes.SetStatus);
        should.equal(statusEvent.action, Voximplant.Messaging.MessengerAction.setStatus);
        should.equal(statusEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(statusEvent.online);
        (statusEvent.online).should.be.false();
    });


    it('subscribe to user2 and user3', async () => {
        messenger.should.be.not.null();

        let usersToSubscribe = [11694, 59468];

        let subscriptionEvent = await messenger.subscribe(usersToSubscribe);
        console.log(JSON.stringify(subscriptionEvent));

        should.equal(subscriptionEvent.eventType, Voximplant.Messaging.MessengerEventTypes.Subscribe);
        should.equal(subscriptionEvent.action, Voximplant.Messaging.MessengerAction.subscribe);
        should.equal(subscriptionEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(subscriptionEvent.users);
        ((subscriptionEvent.users)).should.deepEqual(usersToSubscribe);

        let getSubscriptionEvent = await messenger.getSubscriptions();
        console.log(JSON.stringify(getSubscriptionEvent));
        should.equal(getSubscriptionEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetSubscriptions);
        should.equal(getSubscriptionEvent.action, Voximplant.Messaging.MessengerAction.getSubscriptions);
        should.equal(getSubscriptionEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(getSubscriptionEvent.users);

        (getSubscriptionEvent.users).should.deepEqual(usersToSubscribe);
    });

    it('unsubscribe from user2', async () => {
        messenger.should.be.not.null();

        let getSubscriptionEvent = await messenger.getSubscriptions();
        console.log(JSON.stringify(getSubscriptionEvent));
        should.equal(getSubscriptionEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetSubscriptions);
        should.equal(getSubscriptionEvent.action, Voximplant.Messaging.MessengerAction.getSubscriptions);
        should.equal(getSubscriptionEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(getSubscriptionEvent.users);

        if (!(getSubscriptionEvent.users).includes(testUser2IMId)) {
            let subscriptionEvent = await messenger.subscribe([testUser2IMId]);
            console.log(JSON.stringify(subscriptionEvent));
        }

        let unsubscribeEvent = await messenger.unsubscribe([testUser2IMId]);
        console.log(JSON.stringify(unsubscribeEvent));
        should.equal(unsubscribeEvent.eventType, Voximplant.Messaging.MessengerEventTypes.Unsubscribe);
        should.equal(unsubscribeEvent.action, Voximplant.Messaging.MessengerAction.unsubscribe);
        should.equal(unsubscribeEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(unsubscribeEvent.users);
        (unsubscribeEvent.users).should.have.length(1);
        (unsubscribeEvent.users).should.containEql(testUser2IMId);
    });

    it('unsubscribe from all', async () => {
        messenger.should.be.not.null();
        let getSubscriptionEvent = await messenger.getSubscriptions();
        console.log(JSON.stringify(getSubscriptionEvent));
        should.equal(getSubscriptionEvent.eventType, Voximplant.Messaging.MessengerEventTypes.GetSubscriptions);
        should.equal(getSubscriptionEvent.action, Voximplant.Messaging.MessengerAction.getSubscriptions);
        should.equal(getSubscriptionEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(getSubscriptionEvent.users);

        let subscriptionNumber = getSubscriptionEvent.users.length;

        if (subscriptionNumber === 0) {
            let subscriptionEvent = await messenger.subscribe([testUser2IMId, testUser3IMId]);
            console.log(JSON.stringify(subscriptionEvent));

            subscriptionNumber = subscriptionEvent.users.length;
        }

        let unsubscribeEvent = await messenger.unsubscribeFromAll();
        console.log(JSON.stringify(unsubscribeEvent));
        should.equal(unsubscribeEvent.eventType, Voximplant.Messaging.MessengerEventTypes.Unsubscribe);
        should.equal(unsubscribeEvent.action, Voximplant.Messaging.MessengerAction.unsubscribe);
        should.equal(unsubscribeEvent.imUserId, myIMid, 'imUserId is unexpected');
        should.exist(unsubscribeEvent.users);

        (unsubscribeEvent.users.length).should.be.eql(subscriptionNumber);

    });

    it('enable SendMessage push notification', async () =>  {
        messenger.should.not.be.null();

        let userEvent = await messenger.managePushNotifications([Voximplant.Messaging.MessengerNotification.SendMessage]);
        console.log(JSON.stringify(userEvent));
        should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditUser, 'eventType is unexpected');
        should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.manageNotifications, 'action is unexpected');
        should.equal(userEvent.imUserId, myIMid, 'imUserId is unexpected');

        (userEvent.user).should.have.keys('imId', 'name', 'displayName', 'conversationList', 'leaveConversationList', 'notifications',
            'customData', 'privateCustomData', 'isDeleted');
        (userEvent.user.notifications).should.containEql(Voximplant.Messaging.MessengerNotification.SendMessage);
    });

    it('disable all push notifications', async () => {
        messenger.should.not.be.null();

        let userEvent = await messenger.managePushNotifications([]);
        console.log(JSON.stringify(userEvent));
        should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditUser, 'eventType is unexpected');
        should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.manageNotifications, 'action is unexpected');
        should.equal(userEvent.imUserId, myIMid, 'imUserId is unexpected');

        (userEvent.user).should.have.keys('imId', 'name', 'displayName', 'conversationList', 'leaveConversationList', 'notifications',
            'customData', 'privateCustomData', 'isDeleted');
        (userEvent.user.notifications).should.be.empty();
    });

    it('disable all push notifications via passing null', async () => {
        messenger.should.not.be.null();

        let userEvent = await messenger.managePushNotifications(null);
        console.log(JSON.stringify(userEvent));
        should.equal(userEvent.eventType, Voximplant.Messaging.MessengerEventTypes.EditUser, 'eventType is unexpected');
        should.equal(userEvent.action, Voximplant.Messaging.MessengerAction.manageNotifications, 'action is unexpected');
        should.equal(userEvent.imUserId, myIMid, 'imUserId is unexpected');

        (userEvent.user).should.have.keys('imId', 'name', 'displayName', 'conversationList', 'leaveConversationList', 'notifications',
            'customData', 'privateCustomData', 'isDeleted');
        (userEvent.user.notifications).should.be.empty();
    });
});