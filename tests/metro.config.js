const { resolve, join } = require('path');
const { createBlacklist } = require('metro');
const { mergeConfig } = require('metro-config');
const { DEFAULT } = require('react-native/local-cli/util/Config');

const config = {
  resolver: {
    blackListRE: createBlacklist([
      new RegExp(`^${escape(resolve(__dirname, '..', 'node_modules'))}\\/.*$`),
    ]),
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          if (name === 'react-native-voximplant') {
            return join(__dirname, `../`);
          }
          return join(__dirname, `node_modules/${name}`);
        },
      }
    ),
    platforms: ['android', 'ios'],
  },
  watchFolders: [resolve(__dirname, '../')],
};

module.exports = mergeConfig(DEFAULT, config);
