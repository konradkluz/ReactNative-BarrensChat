#!/bin/sh


cp -r ./node_modules/react-native-background-fetch/ios/RNBackgroundFetch/TSBackgroundFetch.framework ./node_modules/react-native-background-geolocation/ios/RNBackgroundGeolocation


echo "require 'json'

      package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

      Pod::Spec.new do |s|
        s.name                = 'RNBackgroundGeolocation'
        s.version             = package['version']
        s.summary             = package['description']
        s.description         = <<-DESC
          Cross-platform background geolocation module for React Native with
          battery-saving circular stationary-region monitoring and stop detection.
        DESC
        s.homepage            = package['homepage']
        s.license             = package['license']
        s.author              = package['author']
        s.source              = { :git => 'https://github.com/transistorsoft/react-native-background-geolocation-android.git', :tag => s.version }
        s.platform            = :ios, '8.0'

        s.dependency 'React'
        s.dependency 'RNBackgroundFetch'
        s.dependency 'CocoaLumberjack', '~> 3.0'
        s.preserve_paths      = 'docs', 'CHANGELOG.md', 'LICENSE', 'package.json', 'RNBackgroundGeolocation.js'
        s.source_files        = 'ios/RNBackgroundGeolocation/*.{h,m}'
        s.libraries           = 'sqlite3'
        s.vendored_frameworks = 'ios/RNBackgroundGeolocation/TSLocationManager.framework'

        s.xcconfig = { 'FRAMEWORK_SEARCH_PATHS' => '"\${PODS_ROOT}/../../node_modules/react-native-background-fetch/ios/RNBackgroundFetch"' }
        s.xcconfig = { 'FRAMEWORK_SEARCH_PATHS' => '"\${PODS_ROOT}/../../node_modules/react-native-background-geolocation/ios/RNBackgroundGeolocation"' }

      end" > ./node_modules/react-native-background-geolocation/RNBackgroundGeolocation.podspec


