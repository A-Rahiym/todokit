import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Colors } from "../../utils/theme";
import { UnitOption } from "../../utils/conversions";
import * as Haptics from "expo-haptics";

interface UnitSelectorProps {
  selected: UnitOption;
  options: UnitOption[];
  onSelect: (unit: UnitOption) => void;
  label: string;
}

export function UnitSelector({ selected, options, onSelect, label }: UnitSelectorProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setVisible(true);
        }}
        style={styles.selector}
        activeOpacity={0.7}
      >
        <Text style={styles.selectorLabel}>{label}</Text>
        <View style={styles.selectorValue}>
          <Text style={styles.selectorText}>{selected.label}</Text>
          <Text style={styles.symbol}>{selected.symbol}</Text>
          <Text style={styles.chevron}>⌄</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
          activeOpacity={1}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Select Unit</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onSelect(opt);
                  setVisible(false);
                }}
                style={[
                  styles.option,
                  selected.value === opt.value && styles.optionSelected,
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, selected.value === opt.value && styles.optionTextSelected]}>
                  {opt.label}
                </Text>
                <Text style={styles.optionSymbol}>{opt.symbol}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
  },
  selectorLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  selectorValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectorText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
  },
  symbol: {
    fontSize: 13,
    color: Colors.accentPurple,
    fontWeight: "700",
  },
  chevron: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: "65%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  optionSelected: {
    backgroundColor: `${Colors.accentPurple}22`,
    borderWidth: 1,
    borderColor: `${Colors.accentPurple}44`,
  },
  optionText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: Colors.accentPurple,
    fontWeight: "700",
  },
  optionSymbol: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});