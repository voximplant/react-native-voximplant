Pod::Spec.new do |s|
    s.name         = 'react-native-voximplant'
    s.author       = { 'Zingaya Inc.' => 'info@voximplant.com' }
    s.source_files = 'ios/*'
    s.platform     = :ios, '8.0'
    s.license      = 'MIT'
    s.homepage     = 'https://github.com/voximplant/react-native-voximplant'
    s.source       = {:path => './ios/'}
    s.summary      = 'RN voximplant'
    s.version      = '0.1.8'
    s.dependency   'VoxImplantSDK', '~> 2.13.0'
    s.dependency   'React'
end
