import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeModules, Vibration } from 'react-native';
import * as Updates from 'expo-updates';

// Получаем нативный модуль MemoryInfo, зарегистрированный через MemoryInfoPackage
const { MemoryInfo } = NativeModules;

// Тип данных, возвращаемых модулем
interface MemoryInfoData {
  totalMemory: number;
  freeMemory: number;
  usedMemory: number;
}

export default function App() {
  const [memory, setMemory] = useState<MemoryInfoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('');

  // Асинхронный метод для получения памяти
  const fetchMemory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const info: MemoryInfoData = await MemoryInfo.getMemoryInfoAsync();
      setMemory(info);
    } catch (e: any) {
      setError(`Async failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Диагностика OTA-обновлений
  useEffect(() => {
    (async () => {
      try {
        const channel = Updates.channel;
        const check = await Updates.checkForUpdateAsync();
        setUpdateStatus(
          `Channel: ${channel} | Update available: ${check.isAvailable}`,
        );
      } catch (e: any) {
        setUpdateStatus(`Error: ${e.message}`);
      }
    })();
  }, []);

  // Получаем данные при первом рендере
  useEffect(() => {
    fetchMemory();
  }, [fetchMemory]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Memory Info (OTA test)</Text>
      <Text style={styles.subtitle}>via Native Module (ReactPackage)</Text>

      {/* Диагностическая строка */}
      {updateStatus !== '' && (
        <Text style={styles.updateStatus}>{updateStatus}</Text>
      )}

      {error ? (
        <View style={styles.card}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : memory ? (
        <View style={styles.card}>
          <InfoRow label='Total' value={formatBytes(memory.totalMemory)} />
          <InfoRow label='Used' value={formatBytes(memory.usedMemory)} />
          <InfoRow label='Free' value={formatBytes(memory.freeMemory)} />
        </View>
      ) : (
        <ActivityIndicator size='large' color='#007AFF' />
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.button}
          onPress={fetchMemory}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text style={styles.buttonText}>Refresh Memory (async)</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Vibration.vibrate(500)}
        >
          <Text style={styles.buttonText}>Vibrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function formatBytes(bytes: number): string {
  const gb = bytes / 1024 ** 3;
  if (gb >= 1) {
    return `${gb.toFixed(2)} GB`;
  }
  const mb = bytes / 1024 ** 2;
  return `${mb.toFixed(0)} MB`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  updateStatus: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 180,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
