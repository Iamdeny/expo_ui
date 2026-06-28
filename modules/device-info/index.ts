// modules/device-info/index.ts
import { NativeModules } from 'react-native';

const { MemoryInfo } = NativeModules;

export interface MemoryInfo {
  totalMemory: number;
  freeMemory: number;
  usedMemory: number;
}

/**
 * Получить информацию о памяти асинхронно.
 * Использует нативный метод `getMemoryInfoAsync`, определённый в MemoryInfoModule.kt
 */
export async function getMemoryInfoAsync(): Promise<MemoryInfo> {
  return await MemoryInfo.getMemoryInfoAsync();
}
