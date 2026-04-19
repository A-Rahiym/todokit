import { CategoryItem } from "@/features/converter/categoryItem";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
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
      {
        CATEGORIES.map((cat) => (
          <CategoryItem
            key={cat.value}
            value={cat.value}
            icon={cat.icon}
            label={cat.label}
            selected={selected}
            Press={() => {onSelect(cat.value)}}
          />
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