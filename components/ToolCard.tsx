import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

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
        <View pointerEvents="none" style={styles.linesOverlay}>
          <Svg width="100%" height="100%" viewBox="0 0 220 170" preserveAspectRatio="none">
            <Path
              d="M-10 135 C 40 110, 80 155, 140 128 C 170 113, 195 120, 230 95"
              stroke="rgba(255,255,255,0.20)"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M-5 95 C 35 75, 75 115, 130 90 C 170 73, 200 82, 230 62"
              stroke="rgba(165,243,252,0.22)"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M-12 58 C 30 45, 75 78, 118 60 C 152 46, 188 55, 235 36"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
          </Svg>
        </View>
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
  linesOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  inner: {
    flex: 1,
    justifyContent: "space-between",
    zIndex: 1,
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
