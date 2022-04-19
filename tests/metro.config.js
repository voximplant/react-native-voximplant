const { resolve, join } = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const config = {
  resolver: {
    blocklist: exclusionList([
      new RegExp(`^${escape(resolve(__dirname, '..', 'node_modules'))}\\/.*$`),
    ]),
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          if (typeof name !== 'string') {
            return target[name];
          }
          if (name && name.startsWith && name.startsWith('react-native-voximplant')) {
            return join(__dirname, `../`);
          }
          return join(__dirname, `node_modules/${name}`);
        },
      },
    ),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  watchFolders: [resolve(__dirname, '../')],
};

module.exports = config;
