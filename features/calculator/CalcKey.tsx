import React from "react";
import { Text, StyleSheet, Dimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { CalcButton } from "../../utils/calculator";
import { Colors } from "../../utils/theme";

const { width } = Dimensions.get("window");
const BUTTON_SIZE = (width - 40 - 36) / 4;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface CalcKeyProps {
  btn: CalcButton;
  onPress: (value: string) => void;
}

export function CalcKey({ btn, onPress }: CalcKeyProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 20, stiffness: 500 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(
      btn.type === "equals"
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light
    );
    onPress(btn.value);
  };

  const getColors = (): [string, string] => {
    switch (btn.type) {
      case "operator": return ["#6D53C8", "#5B44B0"];
      case "equals": return ["#A78BFA", "#8B5CF6"];
      case "action": return ["#2A2F45", "#222639"];
      case "special": return ["#2A2F45", "#222639"];
      default: return ["#1F2230", "#1A1D27"];
    }
  };

  const getTextColor = () => {
    switch (btn.type) {
      case "operator": return "#E0D9FF";
      case "equals": return "#FFFFFF";
      case "action": return Colors.accentPurple;
      case "special": return Colors.accentMint;
      default: return Colors.textPrimary;
    }
  };

  const buttonWidth = btn.wide ? BUTTON_SIZE * 2 + 12 : BUTTON_SIZE;

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[animStyle, { width: buttonWidth, height: BUTTON_SIZE }]}
    >
      <LinearGradient
        colors={getColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, { width: buttonWidth, height: BUTTON_SIZE }]}
      >
        <Text style={[styles.label, { color: getTextColor() }]}>{btn.label}</Text>
      </LinearGradient>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
});
