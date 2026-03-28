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
import { getActivityFeed, type BeanReaction } from "../../lib/reactions";

type ActivityEntry = {
  id: string;
  beanSlug: string;
  beanName: string;
  venueName: string | null;
  reaction: BeanReaction;
  note: string | null;
  tags: string[];
  createdAt: string;
};

function formatReactionLabel(reaction: BeanReaction) {
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

export default function ActivityScreen() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        try {
          setLoading(true);
          const data = await getActivityFeed();
          if (!active) return;
          setEntries(data);
        } catch (error) {
          if (active) {
            console.error("Failed to load activity feed", error);
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      void load();

      return () => {
        active = false;
      };
    }, [])
  );

  const summaryText = useMemo(() => {
    if (entries.length === 0) {
      return "React to a coffee and your tasting memory will begin here.";
    }

    const lovedCount = entries.filter((entry) => entry.reaction === "loved_it").length;
    const likedCount = entries.filter((entry) => entry.reaction === "liked_it").length;

    return `${entries.length} tasting ${
      entries.length === 1 ? "entry" : "entries"
    } so far • ${lovedCount} loved • ${likedCount} liked`;
  }, [entries]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleRow}>
        <Text style={styles.title}>Activity</Text>
        {loading ? <ActivityIndicator color="#9A4600" /> : null}
      </View>

      <Text style={styles.subtitle}>
        A light memory of what you tried, liked, and want to return to.
      </Text>

      <View style={styles.insightCard}>
        <Text style={styles.insightEyebrow}>Tasting memory</Text>
        <Text style={styles.insightTitle}>Your recent coffee trail.</Text>
        <Text style={styles.insightText}>{summaryText}</Text>
      </View>

      {entries.length === 0 && !loading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No tastings yet</Text>
          <Text style={styles.emptyText}>
            Use the reaction buttons on a bean and it will appear here.
          </Text>
        </View>
      ) : null}

      <View style={styles.stack}>
        {entries.map((entry) => (
          <Pressable
            key={entry.id}
            style={styles.entryCard}
            onPress={() => router.push(`/bean/${entry.beanSlug}`)}
          >
            <View style={styles.entryTopRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.entryBean}>{entry.beanName}</Text>
                <Text style={styles.entryVenue}>
                  {entry.venueName ?? "Coffee memory"}
                </Text>
              </View>
              <Text style={styles.entryDate}>{formatRelativeDate(entry.createdAt)}</Text>
            </View>

            <View style={styles.reactionPill}>
              <Text style={styles.reactionPillText}>
                {formatReactionLabel(entry.reaction)}
              </Text>
            </View>

            {entry.note ? (
              <Text style={styles.entryNote}>{entry.note}</Text>
            ) : null}

            {entry.tags.length > 0 ? (
              <View style={styles.tagsRow}>
                {entry.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </Pressable>
        ))}
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
  insightCard: {
    backgroundColor: "#EFE7DE",
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
  },
  insightEyebrow: {
    color: "#7A675C",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 28,
    lineHeight: 32,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 8,
  },
  insightText: { color: "#554339", fontSize: 15, lineHeight: 22 },
  emptyCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 24,
    lineHeight: 28,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    color: "#554339",
    fontSize: 15,
    lineHeight: 22,
  },
  stack: { gap: 16 },
  entryCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 28,
    padding: 18,
    gap: 12,
  },
  entryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  entryBean: {
    fontSize: 24,
    lineHeight: 28,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 4,
  },
  entryVenue: { color: "#554339", fontSize: 15 },
  entryDate: { color: "#7A675C", fontSize: 13, fontWeight: "600" },
  reactionPill: {
    alignSelf: "flex-start",
    backgroundColor: "#E4EBDD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  reactionPillText: { color: "#4C5A49", fontSize: 12, fontWeight: "700" },
  entryNote: { color: "#554339", fontSize: 15, lineHeight: 22 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "#FCF9F4",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  tagText: { color: "#554339", fontSize: 12, fontWeight: "600" },
});