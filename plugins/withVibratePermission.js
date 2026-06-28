const { withAndroidManifest } = require('@expo/config-plugins');

function withVibratePermission(config) {
  return withAndroidManifest(config, (modConfig) => {
    const androidManifest = modConfig.modResults;

    // Находим или создаём блок <uses-permission android:name="android.permission.VIBRATE" />
    const permissionName = 'android.permission.VIBRATE';

    if (!androidManifest.manifest['uses-permission']?.some(
      (perm) => perm.$['android:name'] === permissionName
    )) {
      androidManifest.manifest['uses-permission'] = [
        ...(androidManifest.manifest['uses-permission'] || []),
        { $: { 'android:name': permissionName } }
      ];
    }

    return modConfig;
  });
}

module.exports = withVibratePermission;
