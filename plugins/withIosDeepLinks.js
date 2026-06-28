// plugins/withIosDeepLinks.js
const { withInfoPlist } = require('@expo/config-plugins');

function withIosDeepLinks(config) {
  return withInfoPlist(config, (modConfig) => {
    const plist = modConfig.modResults;

    // Добавляем ассоциированные домены для Universal Links
    plist.AssociatedDomains = plist.AssociatedDomains || [];
    if (!plist.AssociatedDomains.includes('applinks:yourdomain.com')) {
      plist.AssociatedDomains.push('applinks:yourdomain.com');
    }

    return modConfig;
  });
}

module.exports = withIosDeepLinks;
