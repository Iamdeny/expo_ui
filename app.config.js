// app.config.js
const appConfig = {
  expo: {
    name: process.env.APP_NAME || 'expo_ui', // ← динамическое имя
    slug: 'expo_ui',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'expoui',
    userInterfaceStyle: 'automatic',
    updates: {
      url: 'https://u.expo.dev/c922e657-1502-4f56-aef1-971893f99e62',
      enabled: true,
      fallbackToCacheTimeout: 10000,
      checkAutomatically: 'ON_LOAD',
    },
    ios: {
      icon: './assets/expo.icon',
      bundleIdentifier: 'yes',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
      package: 'com.debyweb.expo_ui',
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      './plugins/withMemoryInfo',
      './plugins/withVibratePermission',
      './plugins/withDeepLinks',
      './plugins/withIosDeepLinks',
      'expo-router',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#208AEF',
          android: {
            image: './assets/images/splash-icon.png',
            imageWidth: 76,
          },
        },
      ],
      'expo-secure-store',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: 'c922e657-1502-4f56-aef1-971893f99e62',
      },
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
  modules: ['./modules/device-info'],
};

module.exports = appConfig;
