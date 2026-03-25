import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";

export default function ProfileScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>
        Your taste identity, saved collections, and the places you follow.
      </Text>

      <View style={styles.identityCard}>
        <Text style={styles.identityEyebrow}>Taste identity</Text>
        <Text style={styles.identityTitle}>Balanced & warm</Text>
        <Text style={styles.identityText}>
          You tend to lean toward caramel sweetness, soft fruit, and coffees that stay elegant without becoming too sharp.
        </Text>

        <View style={styles.tagsRow}>
          <View style={styles.tag}><Text style={styles.tagText}>Caramel</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>Nutty</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>Balanced</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>Milk drinks</Text></View>
        </View>
      </View>

      <View style={styles.countsRow}>
        <View style={styles.countCard}>
          <Text style={styles.countValue}>2</Text>
          <Text style={styles.countLabel}>Saved beans</Text>
        </View>
        <View style={styles.countCard}>
          <Text style={styles.countValue}>2</Text>
          <Text style={styles.countLabel}>Saved cafés</Text>
        </View>
        <View style={styles.countCard}>
          <Text style={styles.countValue}>2</Text>
          <Text style={styles.countLabel}>Roasters</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Following</Text>

      <Pressable
        style={styles.followCard}
        onPress={() => router.push("/cafe/rosslyn-coffee")}
      >
        <View style={styles.followImageSoft} />
        <View style={{ flex: 1 }}>
          <Text style={styles.followTitle}>Rosslyn Coffee</Text>
          <Text style={styles.followSubtitle}>City Center • Café</Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.followCard}
        onPress={() => router.push("/roaster/dark-arts-coffee")}
      >
        <View style={styles.followImageDark} />
        <View style={{ flex: 1 }}>
          <Text style={styles.followTitle}>Dark Arts Coffee</Text>
          <Text style={styles.followSubtitle}>Roaster • Berry-forward and vibrant</Text>
        </View>
      </Pressable>

      <Text style={styles.sectionTitle}>Settings</Text>

      <View style={styles.settingsCard}>
        <Pressable style={styles.settingRow}>
          <Text style={styles.settingText}>Edit taste profile</Text>
          <Text style={styles.settingArrow}>›</Text>
        </Pressable>
        <Pressable style={styles.settingRow}>
          <Text style={styles.settingText}>Notifications</Text>
          <Text style={styles.settingArrow}>›</Text>
        </Pressable>
        <Pressable style={styles.settingRow}>
          <Text style={styles.settingText}>Privacy</Text>
          <Text style={styles.settingArrow}>›</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FCF9F4" },
  content: { paddingHorizontal: 24, paddingTop: 64, paddingBottom: 32 },
  title: {
    fontSize: 38,
    lineHeight: 42,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#554339",
    marginBottom: 20,
    maxWidth: 330,
  },
  identityCard: {
    backgroundColor: "#EFE7DE",
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
  },
  identityEyebrow: {
    color: "#7A675C",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  identityTitle: {
    fontSize: 28,
    lineHeight: 32,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 8,
  },
  identityText: {
    color: "#554339",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "#FCF9F4",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  tagText: { color: "#554339", fontSize: 12, fontWeight: "600" },
  countsRow: { flexDirection: "row", gap: 12, marginBottom: 22 },
  countCard: {
    flex: 1,
    backgroundColor: "#F1ECE5",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  countValue: { color: "#1C1C19", fontSize: 26, fontWeight: "700", marginBottom: 4 },
  countLabel: {
    color: "#554339",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 28,
    lineHeight: 32,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 14,
  },
  followCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 24,
    padding: 14,
    flexDirection: "row",
    gap: 14,
    marginBottom: 12,
    alignItems: "center",
  },
  followImageSoft: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#B89D88",
  },
  followImageDark: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#7B5B47",
  },
  followTitle: {
    fontSize: 20,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 4,
  },
  followSubtitle: { color: "#554339", fontSize: 14 },
  settingsCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 24,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  settingText: { color: "#1C1C19", fontSize: 16, fontWeight: "600" },
  settingArrow: { color: "#7A675C", fontSize: 24, lineHeight: 24 },
});