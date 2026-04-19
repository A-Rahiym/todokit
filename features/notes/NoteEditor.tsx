import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Note } from "../../store/notesStore";
import { Colors } from "../../utils/theme";

interface NoteEditorProps {
  visible: boolean;
  note?: Note | null;
  onSave: (title: string, content: string, completed: boolean) => void;
  onClose: () => void;
}

export function NoteEditor({ visible, note, onSave, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle(note?.title ?? "");
      setContent(note?.content ?? "");
      setCompleted(note?.completed ?? false);
    }
  }, [visible, note]);

  const handleSave = () => {
    if (!title.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave(title.trim(), content.trim(), completed);
    onClose();
  };

  const handleToggleCompleted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCompleted((prev) => !prev);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>{note ? "Edit Task" : "New Task"}</Text>
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
              placeholder="Task title..."
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
  completionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bgElevated,
  },
  checkboxChecked: {
    borderColor: Colors.accentMint,
    backgroundColor: `${Colors.accentMint}33`,
  },
  checkMark: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.accentMint,
    lineHeight: 14,
  },
  completionLabel: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  contentInput: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
    minHeight: 200,
    padding: 0,
  },
});