const should = require('should');

const { TEST_LOGIN,
    TEST_PASSWORD,
    TEST_USER_2,
    TEST_USER_3 } = TestHelpers.credentials;

describe('error - invalid states', () => {

    it('use messenger before client', async () => {
        let messenger = Voximplant.getMessenger();

        should.exist(messenger);
        try {
            await messenger.getUserByName(TEST_USER_2);
        } catch (errorEvent) {
            console.log(JSON.stringify(errorEvent));
            should.equal(errorEvent.code, 10003);
            should.equal(errorEvent.description, 'Client is not logged in.');
            should.equal(errorEvent.eventType, Voximplant.Messaging.MessengerEventTypes.Error);
            should.equal(errorEvent.action, Voximplant.Messaging.MessengerAction.getUser);
        }

    });

});