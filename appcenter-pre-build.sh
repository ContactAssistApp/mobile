
plutil -replace AppSecret -string $AppCenterKey ios/AppCenter-Config.plist 
sed -i tmp s/{APP_CENTER_KEY}/$AppCenterKey/g android/app/src/main/assets/appcenter-config.json
