import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

interface ToolCardProps {
  title: string;
  subtitle: string;
  icon: string;
  gradient: [string, string];
  onPress: () => void;
  size?: "normal" | "wide";
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function ToolCard({ title, subtitle, icon, gradient, onPress, size = "normal" }: ToolCardProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 20, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[animStyle, size === "wide" ? styles.wideCard : styles.card]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.inner}>
          <View style={styles.iconRow}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>
      </LinearGradient>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    overflow: "hidden",
  },
  wideCard: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    minHeight: 120,
  },
  gradient: {
    padding: 18,
    minHeight: 160,
    justifyContent: "space-between",
  },
  inner: {
    flex: 1,
    justifyContent: "space-between",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  icon: {
    fontSize: 36,
  },
  arrow: {
    fontSize: 18,
    color: "rgba(0,0,0,0.4)",
    fontWeight: "600",
  },
  textContainer: {
    marginTop: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E1B4B",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(30,27,75,0.65)",
    marginTop: 2,
    fontWeight: "500",
  },
});
