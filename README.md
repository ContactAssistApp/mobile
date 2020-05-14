# CovidSafe

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

All string authoring happens in the Android App (https://github.com/covidsafe/App-Android). All authoring must happen there.
To update the translations checkout the android app and then run the following command: 
```
python conv.py PATH_TO_ANDROID_APP
```
