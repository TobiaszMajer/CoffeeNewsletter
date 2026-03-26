import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getProfileSummary } from "../../lib/catalog";

type ProfileSummary = {
  identityTitle: string;
  identityText: string;
  identityTags: string[];
  counts: {
    savedBeans: number;
    savedCafes: number;
    savedRoasters: number;
  };
  following: {
    cafes: { id: string; name: string; subtitle: string }[];
    roasters: { id: string; name: string; subtitle: string }[];
  };
};

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileSummary>({
    identityTitle: "Guest profile",
    identityText:
      "You are using a guest profile. Saved coffees and follows will shape this account over time.",
    identityTags: [],
    counts: {
      savedBeans: 0,
      savedCafes: 0,
      savedRoasters: 0,
    },
    following: {
      cafes: [],
      roasters: [],
    },
  });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function load() {
        try {
          setLoading(true);
          const data = await getProfileSummary();
          if (!isActive) return;
          setProfile(data);
        } catch (err) {
          if (isActive) {
            console.error("Failed to load profile summary", err);
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      }

      load();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const followingItems = [
    ...profile.following.cafes.map((item) => ({
      ...item,
      type: "cafe" as const,
    })),
    ...profile.following.roasters.map((item) => ({
      ...item,
      type: "roaster" as const,
    })),
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleRow}>
        <Text style={styles.title}>Profile</Text>
        {loading ? <ActivityIndicator color="#9A4600" /> : null}
      </View>

      <Text style={styles.subtitle}>
        Your taste identity, saved collections, and the places you follow.
      </Text>

      <View style={styles.identityCard}>
        <Text style={styles.identityEyebrow}>Taste identity</Text>
        <Text style={styles.identityTitle}>{profile.identityTitle}</Text>
        <Text style={styles.identityText}>{profile.identityText}</Text>

        <View style={styles.tagsRow}>
          {profile.identityTags.length > 0 ? (
            profile.identityTags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tag}>
              <Text style={styles.tagText}>Guest</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.countsRow}>
        <View style={styles.countCard}>
          <Text style={styles.countValue}>{profile.counts.savedBeans}</Text>
          <Text style={styles.countLabel}>Saved beans</Text>
        </View>
        <View style={styles.countCard}>
          <Text style={styles.countValue}>{profile.counts.savedCafes}</Text>
          <Text style={styles.countLabel}>Saved cafés</Text>
        </View>
        <View style={styles.countCard}>
          <Text style={styles.countValue}>{profile.counts.savedRoasters}</Text>
          <Text style={styles.countLabel}>Roasters</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Following</Text>

      {followingItems.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nothing followed yet</Text>
          <Text style={styles.emptyText}>
            Follow a café or roaster and it will appear here.
          </Text>
        </View>
      ) : (
        followingItems.map((item) => (
          <Pressable
            key={`${item.type}-${item.id}`}
            style={styles.followCard}
            onPress={() =>
              router.push(
                item.type === "cafe" ? `/cafe/${item.id}` : `/roaster/${item.id}`
              )
            }
          >
            <View
              style={item.type === "cafe" ? styles.followImageSoft : styles.followImageDark}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.followTitle}>{item.name}</Text>
              <Text style={styles.followSubtitle}>{item.subtitle}</Text>
            </View>
          </Pressable>
        ))
      )}

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
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
  emptyCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    lineHeight: 26,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    color: "#554339",
    fontSize: 15,
    lineHeight: 22,
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