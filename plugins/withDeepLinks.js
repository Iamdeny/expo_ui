// plugins/withDeepLinks.js
const { withAndroidManifest } = require('@expo/config-plugins');

function withDeepLinks(config) {
  return withAndroidManifest(config, (modConfig) => {
    const androidManifest = modConfig.modResults;
    const mainActivity = androidManifest.manifest.application[0].activity.find(
      (activity) => activity.$['android:name'] === '.MainActivity',
    );

    if (!mainActivity) return modConfig;

    // Проверяем, существует ли уже intent-filter с нашей схемой
    const hasDeepLink = mainActivity['intent-filter']?.some((filter) =>
      filter.data?.some((data) => data.$['android:scheme'] === config.scheme),
    );

    if (!hasDeepLink) {
      const newIntentFilter = {
        action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
        category: [
          { $: { 'android:name': 'android.intent.category.DEFAULT' } },
          { $: { 'android:name': 'android.intent.category.BROWSABLE' } },
        ],
        data: [
          {
            $: {
              'android:scheme': config.scheme, // берём схему из app.js
              'android:host': '*', // любые хосты
            },
          },
        ],
      };
      mainActivity['intent-filter'] = [
        ...(mainActivity['intent-filter'] || []),
        newIntentFilter,
      ];
    }
    return modConfig;
  });
}

module.exports = withDeepLinks;
