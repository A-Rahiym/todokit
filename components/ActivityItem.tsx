import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../utils/theme";

interface ActivityItemProps {
  icon: string;
  label: string;
  status: string;
  statusColor: string;
  progressColor: string;
  progress: number;
}

export function ActivityItem({
  icon,
  label,
  status,
  statusColor,
  progressColor,
  progress,
}: ActivityItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.row}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: `${statusColor}22`, borderColor: `${statusColor}44` },
          ]}
        >
          <Text style={[styles.badgeText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            { width: `${Math.max(0, Math.min(100, progress))}%`, backgroundColor: progressColor },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  icon: { fontSize: 16 },
  label: { flex: 1, fontSize: 14, color: Colors.textPrimary, fontWeight: "500" },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.bgElevated,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: { height: "100%", borderRadius: 2 },
});
