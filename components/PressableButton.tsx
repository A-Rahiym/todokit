import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface PressableButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  haptic?: Haptics.ImpactFeedbackStyle;
  disabled?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function PressableButton({
  onPress,
  children,
  style,
  haptic = Haptics.ImpactFeedbackStyle.Light,
  disabled = false,
}: PressableButtonProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 20, stiffness: 500 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 500 });
  };

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(haptic);
      onPress();
    }
  };

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={disabled}
      style={[animStyle, style]}
    >
      {children}
    </AnimatedTouchable>
  );
}
