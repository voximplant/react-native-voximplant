const path = require('path');

module.exports = {
    dependency: {
        platforms: {
            ios: {
                podspecPath: path.join(__dirname, 'react-native-voximplant.podspec')
            },
            android: {
                packageImportPath: 'import com.voximplant.reactnative.VoxImplantReactPackage;',
                packageInstance: 'new VoxImplantReactPackage()',
            },
        },
    },
};
