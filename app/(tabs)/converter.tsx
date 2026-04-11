import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { CategoryTabs } from "../../features/converter/CategoryTabs";
import { UnitSelector } from "../../features/converter/UnitSelector";
import { useConverterStore } from "../../store/converterStore";
import { Category, UNITS, UnitOption, convert, formatResult } from "../../utils/conversions";
import { Colors } from "../../utils/theme";

export default function ConverterScreen() {
  const [category, setCategory] = useState<Category>("length");
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState<UnitOption>(UNITS.length[0]);
  const [toUnit, setToUnit] = useState<UnitOption>(UNITS.length[1]);
  const [result, setResult] = useState("");

  const { history, loadHistory, addRecord } = useConverterStore();
  const swapRotate = useSharedValue(0);

  const swapAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${swapRotate.value}deg` }],
  }));

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    const units = UNITS[category];
    setFromUnit(units[0]);
    setToUnit(units[1] ?? units[0]);
    setInputValue("1");
  }, [category]);

  useEffect(() => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) {
      setResult("—");
      return;
    }
    const res = convert(num, fromUnit.value, toUnit.value, category);
    setResult(formatResult(res));
  }, [inputValue, fromUnit, toUnit, category]);

  const handleSwap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    swapRotate.value = withSequence(
      withTiming(180, { duration: 200 }),
      withTiming(0, { duration: 0 })
    );
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result && result !== "—") {
      setInputValue(result);
    }
  };

  const handleSave = () => {
    if (!result || result === "—") return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addRecord({
      from: fromUnit.value,
      to: toUnit.value,
      inputValue,
      result,
      category,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader title="Unit Converter" subtitle="Convert anything instantly" />
      <CategoryTabs selected={category} onSelect={setCategory} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        {/* Input Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>FROM</Text>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="numeric"
            placeholder="Enter value"
            placeholderTextColor={Colors.textMuted}
            selectTextOnFocus
          />
          <UnitSelector
            selected={fromUnit}
            options={UNITS[category]}
            onSelect={setFromUnit}
            label="From unit"
          />
        </View>

        {/* Swap Button */}
        <View style={styles.swapRow}>
          <View style={styles.line} />
          <TouchableOpacity onPress={handleSwap} activeOpacity={0.8}>
            <Animated.View style={[styles.swapBtn, swapAnimStyle]}>
              <Text style={styles.swapIcon}>⇅</Text>
            </Animated.View>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>

        {/* Result Card */}
        <View style={[styles.card, styles.resultCard]}>
          <Text style={styles.cardLabel}>TO</Text>
          <Text style={styles.resultText} numberOfLines={1} adjustsFontSizeToFit>
            {result || "—"}
          </Text>
          <UnitSelector
            selected={toUnit}
            options={UNITS[category]}
            onSelect={setToUnit}
            label="To unit"
          />
        </View>

        {/* Equivalence line */}
        {result && result !== "—" && (
          <View style={styles.equivRow}>
            <Text style={styles.equivText}>
              {inputValue} {fromUnit.symbol} = {result} {toUnit.symbol}
            </Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save ✓</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* History */}
        {history.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Recent</Text>
            {history.slice(0, 5).map((rec) => (
              <TouchableOpacity
                key={rec.id}
                style={styles.historyItem}
                onPress={() => {
                  const units = UNITS[rec.category as Category];
                  const from = units.find((u) => u.value === rec.from);
                  const to = units.find((u) => u.value === rec.to);
                  if (from && to) {
                    setCategory(rec.category as Category);
                    setTimeout(() => {
                      setFromUnit(from);
                      setToUnit(to);
                      setInputValue(rec.inputValue);
                    }, 50);
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.historyIcon}>🕐</Text>
                <Text style={styles.historyText}>
                  {rec.inputValue} {rec.from} → {rec.result} {rec.to}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  resultCard: {
    borderColor: `${Colors.accentPurple}33`,
    backgroundColor: `${Colors.accentPurple}0A`,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: Colors.textMuted,
    textTransform: "uppercase",
  },
  input: {
    fontSize: 40,
    fontWeight: "300",
    color: Colors.textPrimary,
    letterSpacing: -1,
    padding: 0,
  },
  resultText: {
    fontSize: 40,
    fontWeight: "300",
    color: Colors.accentPurple,
    letterSpacing: -1,
    minHeight: 50,
  },
  swapRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  swapBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentPurple,
    alignItems: "center",
    justifyContent: "center",
  },
  swapIcon: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
  equivRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    padding: 14,
    backgroundColor: Colors.bgElevated,
    borderRadius: 12,
  },
  equivText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  saveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: `${Colors.accentMint}22`,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.accentMint}44`,
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.accentMint,
  },
  historySection: {
    marginTop: 24,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  historyIcon: { fontSize: 14 },
  historyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
});
