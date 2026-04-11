import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToolCard } from "../../components/ToolCard";
import { useConverterStore } from "../../store/converterStore";
import { useNotesStore } from "../../store/notesStore";
import { Colors, ToolCards } from "../../utils/theme";
import MaterialIcons from "@react-native-vector-icons/material-icons";
type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];


function ActivityItem({
  icon,
  label,
  status,
  statusColor,
  progressColor,
  progress,
}: {
  icon: string;
  label: string;
  status: string;
  statusColor: string;
  progressColor: string;
  progress: number;
}) {
  return (
    <View style={actStyles.item}>
      <View style={actStyles.row}>
        <Text style={actStyles.icon}>{icon}</Text>
        <Text style={actStyles.label} numberOfLines={1}>{label}</Text>
        <View style={[actStyles.badge, { backgroundColor: `${statusColor}22`, borderColor: `${statusColor}44` }]}>
          <Text style={[actStyles.badgeText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>
      <View style={actStyles.progressTrack}>
        <View style={[actStyles.progressBar, { width: `${progress}%`, backgroundColor: progressColor }]} />
      </View>
    </View>
  );
}

const actStyles = StyleSheet.create({
  item: { marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  icon: { fontSize: 16 },
  label: { flex: 1, fontSize: 14, color: Colors.textPrimary, fontWeight: "500" },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.bgElevated,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: { height: "100%", borderRadius: 2 },
});

export default function HomeScreen() {
  const router = useRouter();
  const { notes, loadNotes } = useNotesStore();
  const { history, loadHistory } = useConverterStore();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const snackOpacity = useSharedValue(0);
  const snackTranslateY = useSharedValue(14);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const snackStyle = useAnimatedStyle(() => ({
    opacity: snackOpacity.value,
    transform: [{ translateY: snackTranslateY.value }],
  }));

  useEffect(() => {
    loadNotes();
    loadHistory();
    opacity.value = withDelay(100, withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) }));
    translateY.value = withDelay(100, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));
  }, [loadHistory, loadNotes, opacity, translateY]);

  const lastConversion = history[0];
  const lastNote = notes[0];

  const handleMoreToolsPress = () => {
    snackOpacity.value = withSequence(
      withTiming(1, { duration: 180 }),
      withDelay(1200, withTiming(0, { duration: 180 }))
    );
    snackTranslateY.value = withSequence(
      withTiming(0, { duration: 220 }),
      withDelay(1200, withTiming(14, { duration: 180 }))
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, fadeStyle]}>
          <View>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.title}>Manage Your Tools</Text>
          </View>
          <View style={styles.avatar}>
           <MaterialIcons name="account-circle" size={40} color={Colors.accentPurple} />
          </View>
        </Animated.View>

        {/* Tool Cards Grid */}
        <Animated.View style={[styles.grid, fadeStyle]}>
          <View style={styles.row}>
            {ToolCards.slice(0, 2).map((card) => (
              <ToolCard
                key={card.id}
                title={card.title}
                subtitle={card.subtitle}
                icon={card.icon}
                gradient={card.gradient}
                onPress={() => router.push(card.route as any)}
              />
            ))}
          </View>
          <View style={styles.row}>
            <ToolCard
              title={ToolCards[2].title}
              subtitle={ToolCards[2].subtitle}
              icon={ToolCards[2].icon}
              gradient={ToolCards[2].gradient}
              onPress={() => router.push(ToolCards[2].route as any)}
            />
            <TouchableOpacity
              style={styles.moreCard}
              activeOpacity={0.7}
              onPress={handleMoreToolsPress}
            >
              <Text style={styles.moreIcon}>⚙️</Text>
              <Text style={styles.moreTitle}>More Tools</Text>
              <Text style={styles.moreArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Ongoing Activity */}
        <Animated.View style={[styles.section, fadeStyle]}>
          <Text style={styles.sectionTitle}>Ongoing Activity</Text>
          {lastConversion ? (
            <ActivityItem
              icon="🔄"
              label={`Converted ${lastConversion.inputValue} ${lastConversion.from} to ${lastConversion.to}`}
              status="Completed"
              statusColor={Colors.accentPurple}
              progressColor={Colors.accentPurple}
              progress={100}
            />
          ) : (
            <ActivityItem
              icon="🔄"
              label="No conversions yet — try the converter!"
              status="Idle"
              statusColor={Colors.textMuted}
              progressColor={Colors.bgElevated}
              progress={0}
            />
          )}
          {lastNote ? (
            <ActivityItem
              icon="📝"
              label={`Note: "${lastNote.title}"`}
              status="In Progress"
              statusColor={Colors.accentAmber}
              progressColor={Colors.accentAmber}
              progress={60}
            />
          ) : (
            <ActivityItem
              icon="📝"
              label="No notes yet — capture your thoughts!"
              status="Idle"
              statusColor={Colors.textMuted}
              progressColor={Colors.bgElevated}
              progress={0}
            />
          )}
        </Animated.View>

        {/* Stats Row */}
        <Animated.View style={[styles.statsRow, fadeStyle]}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{notes.length}</Text>
            <Text style={styles.statLabel}>Notes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{history.length}</Text>
            <Text style={styles.statLabel}>Conversions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Tools</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View pointerEvents="none" style={[styles.snackBar, snackStyle]}>
        <Text style={styles.snackText}>More tools coming soon</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -0.8,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1B4B",
  },
  grid: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 28,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  moreCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 18,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 100,
    gap: 6,
  },
  moreIcon: { fontSize: 28 },
  moreTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  moreArrow: {
    position: "absolute",
    top: 16,
    right: 16,
    fontSize: 18,
    color: Colors.textMuted,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.accentPurple,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  snackBar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: Platform.OS === "ios" ? 96 : 78,
    backgroundColor: "rgba(21, 24, 36, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.35)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  snackText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.1,
  },
});
