import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export interface ConversionRecord {
  id: string;
  from: string;
  to: string;
  inputValue: string;
  result: string;
  category: string;
  timestamp: number;
}

interface ConverterState {
  history: ConversionRecord[];
  isLoaded: boolean;
  storageError: string | null;
  loadHistory: () => Promise<void>;
  addRecord: (record: Omit<ConversionRecord, "id" | "timestamp">) => Promise<void>;
  clearHistory: () => Promise<void>;
}

const STORAGE_KEY = "@prodigykit_converter_history";
const memoryStorage = new Map<string, string>();

async function readStorageItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return memoryStorage.get(key) ?? null;
  }
}

async function writeStorageItem(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch {
    memoryStorage.set(key, value);
    return false;
  }
}

async function removeStorageItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch {
    memoryStorage.delete(key);
    return false;
  }
}

export const useConverterStore = create<ConverterState>((set, get) => ({
  history: [],
  isLoaded: false,
  storageError: null,

  loadHistory: async () => {
    try {
      const raw = await readStorageItem(STORAGE_KEY);
      const history = raw ? JSON.parse(raw) : [];
      set({ history, isLoaded: true, storageError: null });
    } catch {
      set({
        history: [],
        isLoaded: true,
        storageError:
          "Conversion history storage is unavailable. Changes will stay in memory for this session.",
      });
    }
  },

  addRecord: async (record) => {
    const newRecord: ConversionRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    const history = [newRecord, ...get().history].slice(0, 20);
    set({ history });
    const persisted = await writeStorageItem(STORAGE_KEY, JSON.stringify(history));
    if (!persisted) {
      set({
        storageError:
          "Conversion history storage is unavailable. Changes will stay in memory for this session.",
      });
    }
  },

  clearHistory: async () => {
    set({ history: [] });
    const persisted = await removeStorageItem(STORAGE_KEY);
    if (!persisted) {
      set({
        storageError:
          "Conversion history storage is unavailable. Changes will stay in memory for this session.",
      });
    }
  },
}));
