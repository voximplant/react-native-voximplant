fabric_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

Pod::Spec.new do |s|
    s.name         = 'react-native-voximplant'
    s.author       = { 'Zingaya Inc.' => 'info@voximplant.com' }
    s.source_files = 'ios/*'
    s.platform     = :ios, '11.0'
    s.license      = 'MIT'
    s.homepage     = 'https://github.com/voximplant/react-native-voximplant'
    s.source       = {:path => './ios/'}
    s.summary      = 'RN voximplant'
    s.version      = '1.40.1'
    s.dependency   'VoxImplantSDK', '2.50.0'
    if fabric_enabled
      s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
      s.pod_target_xcconfig    = {
          "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
          "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
          "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
      }

      s.dependency 'React-RCTFabric'
      s.dependency 'React-Codegen'
      s.dependency 'RCT-Folly'
      s.dependency 'RCTRequired'
      s.dependency 'RCTTypeSafety'
      s.dependency 'ReactCommon/turbomodule/core'
    else
      s.dependency   'React'
    end
end
