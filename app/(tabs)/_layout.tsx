import MaterialIcons from "@react-native-vector-icons/material-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../utils/theme";
type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

function TabIcon({ focused, icon, label }: { focused: boolean; icon: MaterialIconName; label: string }) {
  const iconColor = focused ? Colors.accentPurple : Colors.textMuted;
  

  return (
    <View style={styles.tabItem}>
      {focused ? (
        <LinearGradient
          colors={["#A78BFA33", "#A78BFA11"]}
          style={styles.activePill}
        >
          <MaterialIcons name={icon} size={20} color={iconColor} />
        </LinearGradient>
      ) : (
        <View style={styles.inactivePill}>
          <MaterialIcons name={icon} size={20} color={iconColor} style={styles.iconInactive} />
        </View>
      )}
      <Text
        numberOfLines={1}
        style={[styles.tabLabel, focused && styles.tabLabelActive]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { height: deviceHeight } = useWindowDimensions();

  const baseTabHeight = deviceHeight < 700 ? 56 : deviceHeight > 900 ? 68 : 62;
  const bottomInset = Math.max(insets.bottom, Platform.OS === "ios" ? 10 : 8);
  const tabBarHeight = baseTabHeight + bottomInset;
  const tabBarTopPadding = deviceHeight < 700 ? 6 : 8;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: tabBarHeight,
          paddingBottom: bottomInset,
          paddingTop: tabBarTopPadding,
        },
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <View style={styles.tabBarBg}>
            <LinearGradient
              colors={["#13161E", "#0D0F14"]}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarAccessibilityLabel: "Home tab",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="home" label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="converter"
        options={{
          tabBarAccessibilityLabel: "Converter tab",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="swap-horiz" label="Convert" />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          tabBarAccessibilityLabel: "Calculator tab",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="calculate" label="Calc" />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          tabBarAccessibilityLabel: "Tasks tab",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="edit-note" label="Tasks" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "transparent",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: -1,
    elevation: 0,
  },
  tabBarBg: {
    flex: 1,
    overflow: "hidden",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingTop: 4,
  },
  activePill: {
    width: 44,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: `${Colors.accentPurple}33`,
  },
  inactivePill: {
    width: 44,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  iconInactive: {
    opacity: 0.5,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: Colors.textMuted,
    letterSpacing: 0.1,
    includeFontPadding: false,
  },
  tabLabelActive: {
    color: Colors.accentPurple,
  },
});