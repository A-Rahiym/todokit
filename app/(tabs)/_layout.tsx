import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../utils/theme";

function TabIcon({ focused, icon, label }: { focused: boolean; icon: string; label: string }) {
  return (
    <View style={styles.tabItem}>
      {focused ? (
        <LinearGradient
          colors={["#A78BFA33", "#A78BFA11"]}
          style={styles.activePill}
        >
          <Text style={styles.icon}>{icon}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.inactivePill}>
          <Text style={[styles.icon, styles.iconInactive]}>{icon}</Text>
        </View>
      )}
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
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
            <TabIcon focused={focused} icon="🏠" label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="converter"
        options={{
          tabBarAccessibilityLabel: "Converter tab",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🔄" label="Convert" />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          tabBarAccessibilityLabel: "Calculator tab",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🧮" label="Calc" />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          tabBarAccessibilityLabel: "Notes tab",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="📝" label="Notes" />
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
    height: Platform.OS === "ios" ? 85 : 68,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    paddingTop: 8,
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
  icon: {
    fontSize: 18,
  },
  iconInactive: {
    opacity: 0.5,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: Colors.accentPurple,
  },
});
