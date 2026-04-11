import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Colors } from "../../utils/theme";
import { Note } from "../../store/notesStore";
import * as Haptics from "expo-haptics";

interface NoteEditorProps {
  visible: boolean;
  note?: Note | null;
  onSave: (title: string, content: string) => void;
  onClose: () => void;
}

export function NoteEditor({ visible, note, onSave, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (visible) {
      setTitle(note?.title ?? "");
      setContent(note?.content ?? "");
    }
  }, [visible, note]);

  const handleSave = () => {
    if (!title.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave(title.trim(), content.trim());
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>{note ? "Edit Note" : "New Note"}</Text>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveBtn, !title.trim() && styles.saveBtnDisabled]}
              disabled={!title.trim()}
            >
              <Text style={[styles.saveText, !title.trim() && styles.saveTextDisabled]}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
            <TextInput
              style={styles.titleInput}
              placeholder="Note title..."
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
              maxLength={80}
              autoFocus
              returnKeyType="next"
            />
            <View style={styles.divider} />
            <TextInput
              style={styles.contentInput}
              placeholder="Start writing..."
              placeholderTextColor={Colors.textMuted}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    minHeight: "70%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  heading: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  cancelBtn: {
    padding: 4,
    minWidth: 60,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  saveBtn: {
    padding: 4,
    minWidth: 60,
    alignItems: "flex-end",
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.accentMint,
  },
  saveTextDisabled: {
    color: Colors.textMuted,
  },
  body: {
    padding: 20,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 12,
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
    minHeight: 200,
    padding: 0,
  },
});
