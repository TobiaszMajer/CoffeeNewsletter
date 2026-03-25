import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";

type SavedTab = "Beans" | "Cafés" | "Roasters";

const SAVED_BEANS = [
  {
    id: "guji-natural",
    name: "Guji Natural",
    roaster: "Dark Arts Coffee",
    notes: ["Blueberry", "Violet"],
    nearby: "Rosslyn Coffee",
    freshness: "Updated today",
  },
  {
    id: "washed-yirgacheffe",
    name: "Washed Yirgacheffe",
    roaster: "Square Mile",
    notes: ["Jasmine", "Bergamot"],
    nearby: "Prufrock Coffee",
    freshness: "Updated 4h ago",
  },
];

const SAVED_CAFES = [
  {
    id: "rosslyn-coffee",
    name: "Rosslyn Coffee",
    area: "City Center",
    tags: ["Work-friendly", "Brunch"],
    cue: "2 beans matching your profile",
  },
  {
    id: "prufrock-coffee",
    name: "Prufrock Coffee",
    area: "Bloomsbury",
    tags: ["Brunch", "Outdoor seating"],
    cue: "Fresh espresso option nearby",
  },
];

const SAVED_ROASTERS = [
  {
    id: "dark-arts-coffee",
    name: "Dark Arts Coffee",
    direction: "Berry-forward and vibrant",
    update: "New drop nearby",
  },
  {
    id: "square-mile",
    name: "Square Mile",
    direction: "Clean, citrus, balanced",
    update: "Updated 4h ago",
  },
];

export default function SavedScreen() {
  const [activeTab, setActiveTab] = useState<SavedTab>("Beans");

  const countText = useMemo(() => {
    if (activeTab === "Beans") return `${SAVED_BEANS.length} saved`;
    if (activeTab === "Cafés") return `${SAVED_CAFES.length} saved`;
    return `${SAVED_ROASTERS.length} saved`;
  }, [activeTab]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Saved</Text>
      <Text style={styles.subtitle}>
        Your calm collection of beans, cafés, and roasters worth returning to.
      </Text>

      <View style={styles.segmented}>
        {(["Beans", "Cafés", "Roasters"] as SavedTab[]).map((tab) => {
          const active = tab === activeTab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.segmentButton, active && styles.segmentButtonActive]}
            >
              <Text
                style={[
                  styles.segmentText,
                  active && styles.segmentTextActive,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryEyebrow}>Collection</Text>
        <Text style={styles.summaryTitle}>Near you now</Text>
        <Text style={styles.summaryText}>
          A few saved favorites already have nearby availability.
        </Text>
        <Text style={styles.summaryMeta}>{countText}</Text>
      </View>

      {activeTab === "Beans" && (
        <View style={styles.stack}>
          {SAVED_BEANS.map((bean) => (
            <Pressable
              key={bean.id}
              style={styles.card}
              onPress={() => router.push(`/bean/${bean.id}`)}
            >
              <View style={styles.image} />
              <Text style={styles.cardTitle}>{bean.name}</Text>
              <Text style={styles.cardSubtitle}>by {bean.roaster}</Text>

              <View style={styles.chipsRow}>
                {bean.notes.map((note) => (
                  <View key={note} style={styles.noteChip}>
                    <Text style={styles.noteChipText}>{note}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{bean.nearby}</Text>
                <Text style={styles.metaAccent}>{bean.freshness}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {activeTab === "Cafés" && (
        <View style={styles.stack}>
          {SAVED_CAFES.map((cafe) => (
            <Pressable
              key={cafe.id}
              style={styles.card}
              onPress={() => router.push(`/cafe/${cafe.id}`)}
            >
              <View style={styles.imageSoft} />
              <Text style={styles.cardTitle}>{cafe.name}</Text>
              <Text style={styles.cardSubtitle}>{cafe.area}</Text>

              <View style={styles.chipsRow}>
                {cafe.tags.map((tag) => (
                  <View key={tag} style={styles.softChip}>
                    <Text style={styles.softChipText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.metaAccentSingle}>{cafe.cue}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {activeTab === "Roasters" && (
        <View style={styles.stack}>
          {SAVED_ROASTERS.map((roaster) => (
            <Pressable
              key={roaster.id}
              style={styles.card}
              onPress={() => router.push(`/roaster/${roaster.id}`)}
            >
              <View style={styles.imageRoaster} />
              <Text style={styles.cardTitle}>{roaster.name}</Text>
              <Text style={styles.cardSubtitle}>{roaster.direction}</Text>
              <Text style={styles.metaAccentSingle}>{roaster.update}</Text>
            </Pressable>
          ))}
        </View>
      )}
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
    marginBottom: 22,
    maxWidth: 330,
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: "#F1ECE5",
    borderRadius: 999,
    padding: 4,
    marginBottom: 18,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  segmentButtonActive: { backgroundColor: "#9A4600" },
  segmentText: { color: "#554339", fontSize: 14, fontWeight: "700" },
  segmentTextActive: { color: "#FFFFFF" },
  summaryCard: {
    backgroundColor: "#EFE7DE",
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
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
    fontSize: 28,
    lineHeight: 32,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 8,
  },
  summaryText: { color: "#554339", fontSize: 15, lineHeight: 22, marginBottom: 10 },
  summaryMeta: { color: "#9A4600", fontSize: 14, fontWeight: "700" },
  stack: { gap: 16 },
  card: {
    backgroundColor: "#F1ECE5",
    borderRadius: 28,
    padding: 16,
  },
  image: {
    height: 150,
    borderRadius: 22,
    backgroundColor: "#2C211C",
    marginBottom: 14,
  },
  imageSoft: {
    height: 150,
    borderRadius: 22,
    backgroundColor: "#B89D88",
    marginBottom: 14,
  },
  imageRoaster: {
    height: 150,
    borderRadius: 22,
    backgroundColor: "#7B5B47",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 28,
    lineHeight: 32,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 15,
    color: "#554339",
    marginBottom: 10,
  },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  noteChip: {
    backgroundColor: "#E4EBDD",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  noteChipText: { color: "#4C5A49", fontSize: 12, fontWeight: "600" },
  softChip: {
    backgroundColor: "#FCF9F4",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  softChipText: { color: "#554339", fontSize: 12, fontWeight: "600" },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  metaText: { flex: 1, color: "#554339", fontSize: 14 },
  metaAccent: { color: "#9A4600", fontSize: 13, fontWeight: "700" },
  metaAccentSingle: { color: "#9A4600", fontSize: 14, fontWeight: "700" },
});