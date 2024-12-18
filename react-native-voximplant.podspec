fabric_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'

Pod::Spec.new do |s|
    s.name         = 'react-native-voximplant'
    s.author       = { 'Zingaya Inc.' => 'info@voximplant.com' }
    s.source_files = 'ios/*'
    s.platform     = :ios, '12.0'
    s.license      = 'MIT'
    s.homepage     = 'https://github.com/voximplant/react-native-voximplant'
    s.source       = {:path => './ios/'}
    s.summary      = 'RN voximplant'
    s.version      = '1.42.1'
    s.dependency   'VoxImplantSDK', '2.53.0'
    if fabric_enabled
      install_modules_dependencies(s)
    else
      s.dependency 'React'
    end
end
