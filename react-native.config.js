module.exports = {
    dependency: {
        platforms: {
            ios: {},
            android: {
                packageImportPath: 'import com.voximplant.reactnative.VoxImplantReactPackage;',
                packageInstance: 'new VoxImplantReactPackage()',
            },
        },
    },
};
