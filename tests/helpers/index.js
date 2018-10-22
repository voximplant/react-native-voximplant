/* eslint-disable global-require */
global.sinon = require('sinon');
require('should-sinon');
global.should = require('should');

Object.defineProperty(global, 'Voximplant', {
  get() {
    return jet.module;
  },
});
