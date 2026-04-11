import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface NotesState {
  notes: Note[];
  isLoaded: boolean;
  storageError: string | null;
  loadNotes: () => Promise<void>;
  addNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const STORAGE_KEY = "@prodigykit_notes";
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

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoaded: false,
  storageError: null,

  loadNotes: async () => {
    try {
      const raw = await readStorageItem(STORAGE_KEY);
      const notes = raw ? JSON.parse(raw) : [];
      set({ notes, isLoaded: true, storageError: null });
    } catch {
      set({
        notes: [],
        isLoaded: true,
        storageError:
          "Notes storage is unavailable. Changes will stay in memory for this session.",
      });
    }
  },

  addNote: async (title, content) => {
    const note: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const notes = [note, ...get().notes];
    set({ notes });
    const persisted = await writeStorageItem(STORAGE_KEY, JSON.stringify(notes));
    if (!persisted) {
      set({
        storageError:
          "Notes storage is unavailable. Changes will stay in memory for this session.",
      });
    }
  },

  updateNote: async (id, title, content) => {
    const notes = get().notes.map((n) =>
      n.id === id ? { ...n, title, content, updatedAt: Date.now() } : n
    );
    set({ notes });
    const persisted = await writeStorageItem(STORAGE_KEY, JSON.stringify(notes));
    if (!persisted) {
      set({
        storageError:
          "Notes storage is unavailable. Changes will stay in memory for this session.",
      });
    }
  },

  deleteNote: async (id) => {
    const notes = get().notes.filter((n) => n.id !== id);
    set({ notes });
    const persisted = await writeStorageItem(STORAGE_KEY, JSON.stringify(notes));
    if (!persisted) {
      set({
        storageError:
          "Notes storage is unavailable. Changes will stay in memory for this session.",
      });
    }
  },
}));
