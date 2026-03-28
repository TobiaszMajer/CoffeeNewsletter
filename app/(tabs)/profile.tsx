import React, { useCallback, useMemo, useState } from "react";
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
    favoriteBeans: number;
    favoriteCafes: number;
    favoriteRoasters: number;
    tastings: number;
  };
  recentReactions: {
    id: string;
    beanSlug: string;
    beanName: string;
    venueName: string | null;
    reaction: "loved_it" | "liked_it" | "not_for_me";
    createdAt: string;
  }[];
};

function formatReactionLabel(reaction: ProfileSummary["recentReactions"][number]["reaction"]) {
  if (reaction === "loved_it") return "Loved it";
  if (reaction === "liked_it") return "Liked it";
  return "Not for me";
}

function formatRelativeDate(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const dayDiff = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (dayDiff <= 0) return "Today";
  if (dayDiff === 1) return "Yesterday";
  if (dayDiff < 7) return `${dayDiff} days ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileSummary>({
    identityTitle: "Guest profile",
    identityText:
      "You are using a guest profile. Favorites and tastings will gradually shape this account.",
    identityTags: [],
    counts: {
      favoriteBeans: 0,
      favoriteCafes: 0,
      favoriteRoasters: 0,
      tastings: 0,
    },
    recentReactions: [],
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

      void load();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const summaryText = useMemo(() => {
    const totalFavorites =
      profile.counts.favoriteBeans +
      profile.counts.favoriteCafes +
      profile.counts.favoriteRoasters;

    if (totalFavorites === 0 && profile.counts.tastings === 0) {
      return "Start favoriting coffees or reacting to tastings and your profile will begin to take shape.";
    }

    return `${totalFavorites} favorite${
      totalFavorites === 1 ? "" : "s"
    } • ${profile.counts.tastings} tasting${
      profile.counts.tastings === 1 ? "" : "s"
    }`;
  }, [profile]);

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
        Your taste identity, favorites, and tasting memory.
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

      <View style={styles.summaryCard}>
        <Text style={styles.summaryEyebrow}>Snapshot</Text>
        <Text style={styles.summaryTitle}>Your profile at a glance</Text>
        <Text style={styles.summaryText}>{summaryText}</Text>
      </View>

      <View style={styles.countsGrid}>
        <View style={styles.countCard}>
          <Text style={styles.countValue}>{profile.counts.favoriteBeans}</Text>
          <Text style={styles.countLabel}>Favorite beans</Text>
        </View>

        <View style={styles.countCard}>
          <Text style={styles.countValue}>{profile.counts.favoriteCafes}</Text>
          <Text style={styles.countLabel}>Favorite cafés</Text>
        </View>

        <View style={styles.countCard}>
          <Text style={styles.countValue}>{profile.counts.favoriteRoasters}</Text>
          <Text style={styles.countLabel}>Favorite roasters</Text>
        </View>

        <View style={styles.countCard}>
          <Text style={styles.countValue}>{profile.counts.tastings}</Text>
          <Text style={styles.countLabel}>Tastings</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent tastings</Text>

      {profile.recentReactions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No tastings yet</Text>
          <Text style={styles.emptyText}>
            React to a coffee and your recent tasting memory will appear here.
          </Text>
        </View>
      ) : (
        profile.recentReactions.map((item) => (
          <Pressable
            key={item.id}
            style={styles.reactionCard}
            onPress={() => router.push(`/bean/${item.beanSlug}`)}
          >
            <View style={styles.reactionTopRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reactionTitle}>{item.beanName}</Text>
                <Text style={styles.reactionSubtitle}>
                  {item.venueName ?? "Coffee memory"}
                </Text>
              </View>

              <Text style={styles.reactionDate}>
                {formatRelativeDate(item.createdAt)}
              </Text>
            </View>

            <View style={styles.reactionPill}>
              <Text style={styles.reactionPillText}>
                {formatReactionLabel(item.reaction)}
              </Text>
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
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#FCF9F4",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  tagText: {
    color: "#554339",
    fontSize: 12,
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
  },
  summaryEyebrow: {
    color: "#7A675C",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 26,
    lineHeight: 30,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 8,
  },
  summaryText: {
    color: "#554339",
    fontSize: 15,
    lineHeight: 22,
  },
  countsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 22,
  },
  countCard: {
    width: "48.2%",
    backgroundColor: "#F1ECE5",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  countValue: {
    color: "#1C1C19",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },
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
  reactionCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  reactionTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  reactionTitle: {
    fontSize: 20,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 4,
  },
  reactionSubtitle: {
    color: "#554339",
    fontSize: 14,
  },
  reactionDate: {
    color: "#7A675C",
    fontSize: 13,
    fontWeight: "600",
  },
  reactionPill: {
    alignSelf: "flex-start",
    backgroundColor: "#E4EBDD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  reactionPillText: {
    color: "#4C5A49",
    fontSize: 12,
    fontWeight: "700",
  },
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
  settingText: {
    color: "#1C1C19",
    fontSize: 16,
    fontWeight: "600",
  },
  settingArrow: {
    color: "#7A675C",
    fontSize: 24,
    lineHeight: 24,
  },
});