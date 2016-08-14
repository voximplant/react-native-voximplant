#!/usr/bin/env node

'use strict';

var fs = require('fs');
var rnpm = require('rnpm/src/config');
var xcode = require('xcode');

// The current working directory should be project root of the app that is linking Realm.
var config = rnpm.getProjectConfig();

if (config.ios) {
    var pbxproj = config.ios.pbxprojPath;
    // Make project compatible with node-xcode
    xcodeprojFix(pbxproj);
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

//  node-xcode has a subtle feature: while changing .xcodeproj file it
//  will only affect build configurations whose PRODUCT_NAME is set to
//  same value as first found configuration's PRODUCT_NAME. Normally XCode
//  sets all PRODUCT_NAME into "$(TARGET_NAME)". But 'react-native init'
//  creates a project with some properties set to "$(TARGET_NAME)" and some
//  to corresponding target's name string. While modifying such project,
//  'node-xcode' modifies build configurations only for some targets.
//
//  This function greps .xcodeproj and normalize it's structure so all
//  PRODUCT_NAME that are incorrectly set to target name strings are set to
//  "$(TARGET_NAME)".
function xcodeprojFix(filepath) {
  var text = fs.readFileSync(filepath, 'utf-8');
  var lines = text.split("\n");
  var lastObjectId = null;
  var lastReferencedConfigListId = null;
  var lastDefinedConfigListId = null;
  var configListForBuildConfig = {};
  var nameForConfigList = {};
  var errors = [];

  for (var i = 0; i < lines.length; i ++) {
    var result = parseXcodeprojLine(lines[i]);
    if (!result) continue;
    switch(result.type) {
      // buildConfigurations = (
      case 'configuration-list-open':
        lastDefinedConfigListId = lastObjectId;
        break;
      // );
      case 'list-close':
        lastDefinedConfigListId = null;
        break
      // BB5779111ACEBBC000F4F8F1 /* Debug */,
      case 'object-id':
        if (lastDefinedConfigListId) {
          configListForBuildConfig[result.id] = lastDefinedConfigListId;
        }
        break;
      // BB57790E1ACEBBC000F4F8F1 /* Debug */ = {
      case 'object-definition-open':
        lastObjectId = result.id;
        break;
      // buildConfigurationList = BB5779101ACEBBC000F4F8F1
      case 'config-list-reference':
        lastReferencedConfigListId = result.id;
        break
      // name = VoxImplantTests;
      case 'name-reference':
        if (lastReferencedConfigListId) {
          nameForConfigList[lastReferencedConfigListId] = result.name;
        }
        break
      // PRODUCT_NAME = VoxImplantTests;
      case 'product-name':
        // Save for later to handle forward declarations.
        errors.push({
          line: i,
          name: result.name,
          id: lastObjectId,
        });
        break;
    }
  }

  for (var i = 0; i < errors.length; i ++) {
    var error = errors[i];
    var listId = configListForBuildConfig[error.id];
    if (listId) {
      var name = nameForConfigList[listId];
      if (name === error.name) {
        // Found PRODUCT_NAME that is set to product name string instead
        // of "$(TARGET_NAME)".
        var pattern = /^(\s*PRODUCT_NAME\s*=\s*)\w+(\s*;\s*)$/;
        var replace = '$1"$(TARGET_NAME)"$2';
        lines[error.line] = lines[error.line].replace(pattern, replace);
      }
    }
  }

  fs.writeFileSync(filepath, lines.join("\n"), 'utf-8');
}


function parseXcodeprojLine(line) {
  var ABOUT_PATTERNS = [
    {
      pattern: /^\s*PRODUCT_NAME\s*=\s*(\w+)\s*;\s*$/,
      matches: ['name'],
      type: 'product-name',
    },
    {
      pattern: /^\s*([A-Z0-9]{24})\s*.*=\s*{.*$/,
      matches: ['id'],
      type: 'object-definition-open',
    },
    {
      pattern: /^\s*buildConfigurations\s*=\s*\(\s*$/,
      matches: [],
      type: 'configuration-list-open',
    },
    {
      pattern: /^\s*\)\s*;\s*$/,
      matches: [],
      type: 'list-close',
    },
    {
      pattern: /^\s*([A-Z0-9]{24})\s*.*$/,
      matches: ['id'],
      type: 'object-id',
    },
    {
      pattern: /^\s*buildConfigurationList\s*=\s*([A-Z0-9]{24})\s*.*$/,
      matches: ['id'],
      type: 'config-list-reference',
    },
    {
      pattern: /^\s*name\s*=\s*(\w+)\s*;\s*$/,
      matches: ['name'],
      type: 'name-reference',
    },
  ];
  for (var curAbout = 0; curAbout < ABOUT_PATTERNS.length; curAbout ++) {
    var ABOUT_PATTERN = ABOUT_PATTERNS[curAbout];
    var matches = line.match(ABOUT_PATTERN.pattern);
    if (matches && matches.length > ABOUT_PATTERN.matches.length) {
      var result = {type: ABOUT_PATTERN.type};
      for (var i = 0; i < ABOUT_PATTERN.matches.length; i ++) {
        result[ABOUT_PATTERN.matches[i]] = matches[i + 1];
      }
      return result;
    }
  }
}

