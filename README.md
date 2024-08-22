# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


## Dev Notes

https://docs.docker.com/engine/install/ubuntu/

iptables!

https://github.com/docker/for-linux/issues/1105

sudo update-alternatives --set iptables /usr/sbin/iptables-legacy

https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user

sudo groupadd docker
sudo usermod -aG docker $USER
(log in/out)

https://docs.docker.com/engine/install/linux-postinstall/#configure-docker-to-start-on-boot-with-systemd

sudo systemctl enable docker.service
sudo systemctl enable containerd.service

https://github.com/csci430-os/vscode-remote-devcontainer/issues/2
https://code.visualstudio.com/docs/devcontainers/containers#_working-with-git
https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials#_using-ssh-keys


"mounts": [
  "type=bind,source=${localEnv:HOME}/.ssh,target=/home/node/.ssh,type=bind,consistency=cached"
]

