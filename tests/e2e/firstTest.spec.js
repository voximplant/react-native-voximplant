const should = require('should');

describe('Example', () => {
    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('client exist', () => {
       const client = Voximplant.getInstance();
       should.exist(client);
    });

});