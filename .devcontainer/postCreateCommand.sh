echo -e "\nStarting post creat command script..."
echo "Dev machine:"
uname -a
echo -e "\nInstalling expo boiler plate..."
# npm i -g create-expo-app@latest # only required for project setup
npm i -g @expo/ngrok
# npm install -g eas-cli # not used
npm install

echo -e "\n*******************************"
echo -e "\nDev container ready!".
echo -e "\n*******************************\n"