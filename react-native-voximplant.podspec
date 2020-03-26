Pod::Spec.new do |s|
    s.name         = 'react-native-voximplant'
    s.author       = { 'Zingaya Inc.' => 'info@voximplant.com' }
    s.source_files = 'ios/*'
    s.platform     = :ios, '9.0'
    s.license      = 'MIT'
    s.homepage     = 'https://github.com/voximplant/react-native-voximplant'
    s.source       = {:path => './ios/'}
    s.summary      = 'RN voximplant'
    s.version      = '1.17.0'
    s.dependency   'VoxImplantSDK', '2.29.0'
    s.dependency   'React'
end
