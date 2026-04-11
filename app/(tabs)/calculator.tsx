import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { CalcKey } from "../../features/calculator/CalcKey";
import { CALC_BUTTONS, evaluateExpression } from "../../utils/calculator";
import { Colors } from "../../utils/theme";
import { ScreenHeader } from "../../components/ScreenHeader";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

export default function CalculatorScreen() {
  const [expression, setExpression] = useState("");
  const [displayResult, setDisplayResult] = useState("0");
  const [justEvaluated, setJustEvaluated] = useState(false);

  const flashScale = useSharedValue(1);

  const flashStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flashScale.value }],
  }));

  const triggerFlash = () => {
    flashScale.value = withSequence(
      withTiming(1.04, { duration: 80 }),
      withTiming(1, { duration: 120 })
    );
  };

  const handleButton = (value: string) => {
    switch (value) {
      case "AC":
        setExpression("");
        setDisplayResult("0");
        setJustEvaluated(false);
        break;

      case "=": {
        if (!expression) return;
        const res = evaluateExpression(expression);
        triggerFlash();
        if (res !== "Error") {
          setDisplayResult(res);
          setExpression(res);
          setJustEvaluated(true);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setDisplayResult("Error");
          setJustEvaluated(true);
        }
        break;
      }

      case "+/-": {
        if (expression && expression !== "0") {
          if (expression.startsWith("-")) {
            setExpression(expression.slice(1));
          } else {
            setExpression("-" + expression);
          }
          setJustEvaluated(false);
        }
        break;
      }

      default: {
        const isOperator = ["÷", "×", "−", "+", "%"].includes(value);
        let newExpr: string;

        if (justEvaluated && !isOperator) {
          newExpr = value;
        } else if (justEvaluated && isOperator) {
          newExpr = displayResult + value;
        } else {
          newExpr = expression + value;
        }

        setExpression(newExpr);
        setJustEvaluated(false);

        // Live preview
        if (!isOperator || expression) {
          const preview = evaluateExpression(newExpr);
          if (preview !== "Error" && preview !== newExpr) {
            setDisplayResult(preview);
          }
        }
      }
    }
  };

  const displayExpr = expression || "0";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader title="Calculator" subtitle="Arithmetic made simple" />

      {/* Display */}
      <View style={styles.display}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.exprScroll}
          style={styles.exprContainer}
        >
          <Text style={styles.exprText} numberOfLines={1}>
            {displayExpr}
          </Text>
        </ScrollView>
        <Animated.Text style={[styles.resultText, flashStyle]} numberOfLines={1} adjustsFontSizeToFit>
          {justEvaluated ? displayResult : (displayResult !== "0" && displayResult !== displayExpr ? `= ${displayResult}` : "")}
        </Animated.Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {CALC_BUTTONS.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.keyRow}>
            {row.map((btn) => (
              <CalcKey key={btn.value} btn={btn} onPress={handleButton} />
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  display: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    paddingBottom: 24,
  },
  exprContainer: {
    maxHeight: 52,
  },
  exprScroll: {
    alignItems: "center",
    flexDirection: "row-reverse",
    flexGrow: 1,
  },
  exprText: {
    fontSize: 38,
    fontWeight: "300",
    color: Colors.textSecondary,
    letterSpacing: -0.5,
    textAlign: "right",
  },
  resultText: {
    fontSize: 64,
    fontWeight: "200",
    color: Colors.textPrimary,
    textAlign: "right",
    letterSpacing: -2,
    marginTop: 4,
    minHeight: 76,
  },
  keypad: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 12,
  },
  keyRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
});
