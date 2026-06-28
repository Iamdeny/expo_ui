// plugins/withMemoryInfo.js
const { withMainApplication } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '..', 'modules', 'device-info', 'android', 'src', 'main', 'java', 'com', 'debyweb', 'expo_ui', 'memory');
const targetDir = (modConfig) => path.join(modConfig.modRequest.projectRoot, 'android', 'app', 'src', 'main', 'java', 'com', 'debyweb', 'expo_ui', 'memory');

function copyFileSync(source, destination) {
  const dir = path.dirname(destination);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(source, destination);
}

function withMemoryInfo(config) {
  // Копируем исходные файлы модуля в android/app/... перед изменением MainApplication
  config = withMainApplication(config, (modConfig) => {
    const target = targetDir(modConfig);
    // Копируем оба файла
    copyFileSync(path.join(sourceDir, 'MemoryInfoModule.kt'), path.join(target, 'MemoryInfoModule.kt'));
    copyFileSync(path.join(sourceDir, 'MemoryInfoPackage.kt'), path.join(target, 'MemoryInfoPackage.kt'));

    let contents = modConfig.modResults.contents;

    // Импорт модуля
    if (!contents.includes('import com.debyweb.expo_ui.memory.MemoryInfoPackage')) {
      contents = contents.replace(
        /^(package .*\n)/m,
        '$1import com.debyweb.expo_ui.memory.MemoryInfoPackage\n'
      );
    }

    // Регистрация пакета
    if (!contents.includes('add(MemoryInfoPackage())')) {
      contents = contents.replace(
        /(PackageList\(this\)\.packages\.apply\s*\{)/,
        '$1\n            add(MemoryInfoPackage())'
      );
    }

    modConfig.modResults.contents = contents;
    return modConfig;
  });

  return config;
}

module.exports = withMemoryInfo;
