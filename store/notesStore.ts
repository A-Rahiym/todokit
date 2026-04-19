import { create } from "zustand";
import { readStorageItem, writeStorageItem } from "../utils/storage";

export interface Note {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

interface NotesState {
  notes: Note[];
  isLoaded: boolean;
  storageError: string | null;
  loadNotes: () => Promise<void>;
  addNote: (title: string, content: string, completed?: boolean) => Promise<void>;
  updateNote: (
    id: string,
    title: string,
    content: string,
    completed?: boolean
  ) => Promise<void>;
  toggleNote: (id: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const STORAGE_KEY = "@prodigykit_notes";

function generateNoteId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoaded: false,
  storageError: null,

  loadNotes: async () => {
    try {
      const raw = await readStorageItem(STORAGE_KEY);
      const notes = raw
        ? (JSON.parse(raw) as Array<Omit<Note, "completed"> & Partial<Pick<Note, "completed">>>).map(
            (note) => ({
              ...note,
              completed: note.completed ?? false,
            })
          )
        : [];
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

  addNote: async (title, content, completed = false) => {
    const note: Note = {
      id: generateNoteId(),
      title,
      content,
      completed,
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

  updateNote: async (id, title, content, completed) => {
    const notes = get().notes.map((n) =>
      n.id === id
        ? {
            ...n,
            title,
            content,
            completed: completed ?? n.completed,
            updatedAt: Date.now(),
          }
        : n
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

  toggleNote: async (id) => {
    const notes = get().notes.map((n) =>
      n.id === id ? { ...n, completed: !n.completed, updatedAt: Date.now() } : n
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
