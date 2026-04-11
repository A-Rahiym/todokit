import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { NoteCard } from "../../features/notes/NoteCard";
import { NoteEditor } from "../../features/notes/NoteEditor";
import { Note, useNotesStore } from "../../store/notesStore";
import { Colors } from "../../utils/theme";

export default function NotesScreen() {
  const {
    notes,
    storageError,
    loadNotes,
    addNote,
    updateNote,
    deleteNote,
  } = useNotesStore();
  const [editorVisible, setEditorVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [search, setSearch] = useState("");

  const fabScale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const filtered = search.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.content.toLowerCase().includes(search.toLowerCase())
      )
    : notes;

  const handleAdd = () => {
    fabScale.value = withSpring(0.9, { damping: 20, stiffness: 400 }, () => {
      fabScale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEditingNote(null);
    setEditorVisible(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setEditorVisible(true);
  };

  const handleSave = (title: string, content: string) => {
    if (editingNote) {
      updateNote(editingNote.id, title, content);
    } else {
      addNote(title, content);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader
        title="Notes"
        subtitle={`${notes.length} note${notes.length !== 1 ? "s" : ""}`}
      />

      {storageError ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{storageError}</Text>
        </View>
      ) : null}

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Notes List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onDelete={deleteNote}
            onPress={handleEdit}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📓</Text>
            <Text style={styles.emptyTitle}>
              {search ? "No matching notes" : "No notes yet"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {search ? "Try a different search" : "Tap + to capture your first thought"}
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <Animated.View style={[styles.fab, fabStyle]}>
        <TouchableOpacity
          onPress={handleAdd}
          style={styles.fabBtn}
          activeOpacity={0.9}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </Animated.View>

      <NoteEditor
        visible={editorVisible}
        note={editingNote}
        onSave={handleSave}
        onClose={() => setEditorVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  banner: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255, 197, 66, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 197, 66, 0.3)",
  },
  bannerText: {
    color: Colors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 100,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
  },
  fabBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accentAmber,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.accentAmber,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  fabIcon: {
    fontSize: 28,
    fontWeight: "300",
    color: "#1A1200",
    lineHeight: 32,
  },
});
