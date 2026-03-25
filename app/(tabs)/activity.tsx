import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";

const ENTRIES = [
  {
    id: "guji-natural",
    bean: "Guji Natural",
    venue: "Rosslyn Coffee",
    reaction: "Loved it",
    note: "Sweet and vivid, especially as filter.",
    tags: ["Blueberry", "Silky"],
    date: "Today",
  },
  {
    id: "washed-yirgacheffe",
    bean: "Washed Yirgacheffe",
    venue: "Prufrock Coffee",
    reaction: "Liked it",
    note: "Clean and bright, better than expected on espresso.",
    tags: ["Jasmine", "Citrus"],
    date: "Yesterday",
  },
  {
    id: "guji-natural",
    bean: "Guji Natural",
    venue: "Rosslyn Coffee",
    reaction: "Not for me",
    note: "Too sharp with milk, but beautiful on its own.",
    tags: ["Floral"],
    date: "3 days ago",
  },
];

export default function ActivityScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Activity</Text>
      <Text style={styles.subtitle}>
        A light memory of what you tried, liked, and want to return to.
      </Text>

      <View style={styles.insightCard}>
        <Text style={styles.insightEyebrow}>Taste insight</Text>
        <Text style={styles.insightTitle}>You’ve been leaning bright.</Text>
        <Text style={styles.insightText}>
          Floral and berry-led coffees are showing up more often in your recent reactions.
        </Text>
      </View>

      <View style={styles.stack}>
        {ENTRIES.map((entry, index) => (
          <Pressable
            key={`${entry.id}-${index}`}
            style={styles.entryCard}
            onPress={() => router.push(`/bean/${entry.id}`)}
          >
            <View style={styles.entryTopRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.entryBean}>{entry.bean}</Text>
                <Text style={styles.entryVenue}>{entry.venue}</Text>
              </View>
              <Text style={styles.entryDate}>{entry.date}</Text>
            </View>

            <View style={styles.reactionPill}>
              <Text style={styles.reactionPillText}>{entry.reaction}</Text>
            </View>

            <Text style={styles.entryNote}>{entry.note}</Text>

            <View style={styles.tagsRow}>
              {entry.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        ))}
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