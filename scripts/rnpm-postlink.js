#!/usr/bin/env node

'use strict';

var fs = require('fs');
var rnpm = require('rnpm/src/config');
var xcode = require('xcode');

// The current working directory should be project root of the app that is linking Realm.
var config = rnpm.getProjectConfig();

if (config.ios) {
    var pbxproj = config.ios.pbxprojPath;
    var project = xcode.project(pbxproj).parseSync();
    var target = project.getFirstTarget().uuid;

    // Create a Frameworks group if necessary.
    if (!project.pbxGroupByName('Frameworks')) {
        var group = project.pbxCreateGroup('Frameworks', '""');
        var mainGroup = project.getFirstProject().firstProject.mainGroup;

        project.getPBXGroupByKey(mainGroup).children.push({
            value: group,
            comment: 'Frameworks',
        });
    }

    project.addFramework('usr/lib/libc++.tbd', {
        lastKnownFileType: 'sourcecode.text-based-dylib-definition',
        sourceTree: 'SDKROOT',
        target: target,
    });

    ['VideoToolbox', 'GLKit'].forEach(function(name) {
        project.addFramework('usr/lib/' + name + '.framework', {
            lastKnownFileType: 'wrapper.framework',
            sourceTree: 'SDKROOT',
            target: target,
        });
    });

    project.addStaticLibrary(__dirname.replace("scripts", "") + 'ios/VoxImplantSDK/lib/libVoxImplantSDK.a', {
        lastKnownFileType: 'archive.ar',
        target: target,
        customFramework: true
    });

    fs.writeFileSync(pbxproj, project.writeSync());
}