import * as Haptics from "expo-haptics";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Category } from "../../utils/conversions";
import { Colors } from "../../utils/theme";

const CATEGORIES: { label: string; value: Category; icon: string }[] = [
  { label: "Length", value: "length", icon: "📏" },
  { label: "Temperature", value: "temperature", icon: "🌡️" },
  { label: "Weight", value: "weight", icon: "⚖️" },
  { label: "Currency", value: "currency", icon: "💱" },
];

interface CategoryTabsProps {
  selected: Category;
  onSelect: (cat: Category) => void;
}

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      style={styles.scroll}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.value}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSelect(cat.value);
          }}
          style={[styles.tab, selected === cat.value && styles.tabActive]}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{cat.icon}</Text>
          <Text style={[styles.label, selected === cat.value && styles.labelActive]}>
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    maxHeight: 56,
  },
  container: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 4,
    alignItems: "center",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    flexShrink: 0,
    alignSelf: "flex-start",
  },
  tabActive: {
    backgroundColor: `${Colors.accentPurple}22`,
    borderColor: Colors.accentPurple,
  },
  icon: {
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.accentPurple,
  },
});