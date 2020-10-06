# ContactAssist

## To run code:
Run `pod install` under the `ios` directory

Open the `.xcworkspace` project file.

A few things that may be needed to set up React Native:

https://reactnative.dev/docs/environment-setup

`brew install node`

`brew install watchman`

Install the Pod package manager with

`sudo gem install cocoapods`

May need to run certain commands to get unstuck

`npm install`

## Demo
- Demo for symptom tracker https://www.youtube.com/watch?v=sylLsCnO8ZE&feature=youtu.be


## I18n

All strings are under `locales/*.json` and should be edited there.
There's a `i18n.py` script to help with translation maintenance by detecting missing and unused strings. Use it before a release.
The script doesn't try to detect direct strings in the app that haven't being translated.

# Debugger Tools
Follow the installation of [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- When running the app, click Command + D on iOS simulator and enable `DEBUG` mode.
- Open React Native Debugger app following the previous instruction and we can visualize the current app Redux state and action. 
