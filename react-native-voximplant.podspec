Pod::Spec.new do |s|
    s.name         = 'react-native-voximplant'
    s.author       = { 'Yulia Grigorieva' => 'grigorieva@zingaya.com' }
    s.source_files = 'ios/*'
    s.platform     = :ios, '7.0'
    s.license      = 'MIT'
    s.homepage     = 'https://github.com/voximplant'
    s.source       = {:path => './ios/'}
    s.summary      = 'RN voximplant'
    s.version      = '0.0.1'
    s.dependency     'VoxImplantSDK'
end
