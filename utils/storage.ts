import AsyncStorage from "@react-native-async-storage/async-storage";

const memoryStorage = new Map<string, string>();
let storageWarningLogged = false;

function logStorageFallback() {
  if (__DEV__ && !storageWarningLogged) {
    console.warn(
      "AsyncStorage is unavailable in this runtime. Falling back to in-memory storage."
    );
    storageWarningLogged = true;
  }
}

export async function readStorageItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    logStorageFallback();
    return memoryStorage.get(key) ?? null;
  }
}

export async function writeStorageItem(
  key: string,
  value: string
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch {
    logStorageFallback();
    memoryStorage.set(key, value);
    return false;
  }
}

export async function removeStorageItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch {
    logStorageFallback();
    memoryStorage.delete(key);
    return false;
  }
}