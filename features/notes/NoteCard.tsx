import * as Haptics from "expo-haptics";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Note } from "../../store/notesStore";
import { Colors } from "../../utils/theme";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onPress: (note: Note) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function NoteCard({ note, onDelete, onToggle, onPress }: NoteCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 400 });
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Delete Note", `Delete "${note.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          opacity.value = withTiming(0, { duration: 200 }, (finished) => {
            if (finished) runOnJS(onDelete)(note.id);
          });
        },
      },
    ]);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getAccentColor = () => {
    const colors = [Colors.accentPurple, Colors.accentMint, Colors.accentAmber, Colors.accentBlue, Colors.accentRose];
    const safeIdSlice = note.id.replace(/\D/g, "").slice(-4);
    const idx = (parseInt(safeIdSlice || "0", 10) || 0) % colors.length;
    return colors[idx];
  };

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(note.id);
  };

  const accent = getAccentColor();

  return (
    <AnimatedTouchable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(note);
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[animStyle, styles.card]}
    >
      <View style={styles.leftCol}>
        <TouchableOpacity
          onPress={handleToggle}
          style={[styles.checkbox, note.completed && styles.checkboxChecked]}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {note.completed ? <Text style={styles.checkMark}>✓</Text> : null}
        </TouchableOpacity>
        <View style={[styles.accentBar, { backgroundColor: accent }]} />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.title, note.completed && styles.titleCompleted]} numberOfLines={1}>{note.title}</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.deleteIcon}>✕</Text>
          </TouchableOpacity>
        </View>
        {note.content ? (
          <Text style={[styles.preview, note.completed && styles.previewCompleted]} numberOfLines={2}>{note.content}</Text>
        ) : null}
        <Text style={[styles.date, note.completed && styles.dateCompleted]}>{formatDate(note.updatedAt)}</Text>
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  leftCol: {
    width: 44,
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 14,
    gap: 10,
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
  accentBar: {
    width: 4,
    backgroundColor: Colors.accentMint,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    flex: 1,
    letterSpacing: -0.2,
  },
  titleCompleted: {
    color: Colors.textSecondary,
    textDecorationLine: "line-through",
  },
  preview: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  previewCompleted: {
    color: Colors.textMuted,
  },
  date: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  dateCompleted: {
    color: Colors.textMuted,
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
