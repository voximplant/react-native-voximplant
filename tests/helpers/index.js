/* eslint-disable global-require */
global.sinon = require('sinon');
require('should-sinon');
global.should = require('should');

Object.defineProperty(global, 'Voximplant', {
  get() {
    return jet.module;
  },
});

global.sleep = duration =>
    new Promise(resolve => setTimeout(resolve, duration));

global.TestHelpers = {
  credentials: require('./Credentials')
};
