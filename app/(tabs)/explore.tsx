import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { getExploreBeans } from "../../lib/catalog";

type Mode = "map" | "list";

type LiveExploreBean = {
  id: string;
  slug: string;
  name: string;
  roast_style: string | null;
  flavor_notes: string[] | null;
  roasters:
    | {
        slug: string;
        name: string;
      }
    | {
        slug: string;
        name: string;
      }[]
    | null;
  cafe_bean_availability:
    | {
        freshness_note: string | null;
        distance_label: string | null;
        availability_types: string[] | null;
        cafes:
          | {
              slug: string;
              name: string;
            }
          | {
              slug: string;
              name: string;
            }[]
          | null;
      }[]
    | null;
};

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

const FALLBACK_RESULTS = [
  {
    id: "guji-natural",
    name: "Guji Natural",
    roaster: "Dark Arts Coffee",
    venue: "Rosslyn Coffee",
    distance: "0.3 mi",
    notes: ["Blueberry", "Violet"],
    type: "Filter",
    freshness: "Updated today",
  },
  {
    id: "washed-yirgacheffe",
    name: "Washed Yirgacheffe",
    roaster: "Square Mile",
    venue: "Prufrock Coffee",
    distance: "0.8 mi",
    notes: ["Jasmine", "Bergamot"],
    type: "Espresso",
    freshness: "Updated 4h ago",
  },
];

const FILTERS = [
  "Berry & Floral",
  "Light Roast",
  "Filter",
  "Open now",
];

export default function ExploreScreen() {
  const [mode, setMode] = useState<Mode>("map");
  const [selectedFilter, setSelectedFilter] = useState<string>("Berry & Floral");
  const [liveBeans, setLiveBeans] = useState<LiveExploreBean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getExploreBeans();
        if (!mounted) return;
        setLiveBeans(data as LiveExploreBean[]);
      } catch (err) {
        console.error("Failed to load explore beans", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const visibleResults = useMemo(() => {
    if (liveBeans.length === 0) return FALLBACK_RESULTS;

    return liveBeans.map((bean) => {
      const roaster = firstRelation(bean.roasters);
      const availability = bean.cafe_bean_availability?.[0];
      const cafe = firstRelation(availability?.cafes);

      return {
        id: bean.slug,
        name: bean.name,
        roaster: roaster?.name ?? "Unknown roaster",
        venue: cafe?.name ?? "Nearby café",
        distance: availability?.distance_label ?? "Nearby",
        notes: (bean.flavor_notes ?? []).slice(0, 2),
        type: availability?.availability_types?.[0] ?? bean.roast_style ?? "Coffee",
        freshness: availability?.freshness_note ?? "Recently updated",
      };
    });
  }, [liveBeans]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Explore</Text>
        {loading ? <ActivityIndicator color="#9A4600" /> : null}
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchText}>Search beans, roasters, or cafés...</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTERS.map((filter) => {
          const selected = selectedFilter === filter;
          return (
            <Pressable
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[styles.filterChip, selected && styles.filterChipSelected]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selected && styles.filterChipTextSelected,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.toggleWrap}>
        <Pressable
          onPress={() => setMode("map")}
          style={[styles.toggleButton, mode === "map" && styles.toggleButtonActive]}
        >
          <Text
            style={[
              styles.toggleText,
              mode === "map" && styles.toggleTextActive,
            ]}
          >
            Map
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setMode("list")}
          style={[styles.toggleButton, mode === "list" && styles.toggleButtonActive]}
        >
          <Text
            style={[
              styles.toggleText,
              mode === "list" && styles.toggleTextActive,
            ]}
          >
            List
          </Text>
        </Pressable>
      </View>

      {mode === "map" ? (
        <View style={styles.mapMock}>
          <View style={[styles.mapPin, { top: 68, left: 96 }]}>
            <Text style={styles.mapPinText}>☕</Text>
          </View>
          <View style={[styles.mapPin, { top: 132, right: 62 }]}>
            <Text style={styles.mapPinText}>☕</Text>
          </View>
          <View style={[styles.mapPin, { bottom: 74, left: 150 }]}>
            <Text style={styles.mapPinText}>☕</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby matches</Text>
        <Text style={styles.sectionMeta}>{visibleResults.length} results</Text>
      </View>

      <View style={styles.resultsWrap}>
        {visibleResults.map((item) => (
          <Pressable
            key={item.id}
            style={styles.resultCard}
            onPress={() => router.push(`/bean/${item.id}`)}
          >
            <View style={styles.resultImage} />

            <View style={styles.resultBody}>
              <View style={styles.resultTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultTitle}>{item.name}</Text>
                  <Text style={styles.resultRoaster}>by {item.roaster}</Text>
                </View>

                <View style={styles.saveCircle}>
                  <Text style={styles.saveCircleText}>⌑</Text>
                </View>
              </View>

              <View style={styles.notesRow}>
                {item.notes.map((note) => (
                  <View key={note} style={styles.noteChip}>
                    <Text style={styles.noteChipText}>{note}</Text>
                  </View>
                ))}
                <View style={styles.typeChip}>
                  <Text style={styles.typeChipText}>{item.type}</Text>
                </View>
              </View>

              <View style={styles.resultBottomRow}>
                <Text style={styles.venueText}>
                  {item.venue} • {item.distance}
                </Text>
                <Text style={styles.freshnessText}>{item.freshness}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FCF9F4",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 38,
    lineHeight: 42,
    color: "#1C1C19",
    fontWeight: "700",
  },
  searchBox: {
    backgroundColor: "#F1ECE5",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 18,
  },
  searchText: {
    color: "#7A675C",
    fontSize: 15,
  },
  filtersRow: {
    gap: 10,
    paddingBottom: 18,
  },
  filterChip: {
    backgroundColor: "#F1ECE5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
  filterChipSelected: {
    backgroundColor: "#9A4600",
  },
  filterChipText: {
    color: "#1C1C19",
    fontSize: 14,
    fontWeight: "600",
  },
  filterChipTextSelected: {
    color: "#FFFFFF",
  },
  toggleWrap: {
    flexDirection: "row",
    backgroundColor: "#F1ECE5",
    borderRadius: 999,
    padding: 4,
    marginBottom: 18,
    alignSelf: "center",
  },
  toggleButton: {
    minWidth: 110,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#9A4600",
  },
  toggleText: {
    color: "#554339",
    fontSize: 15,
    fontWeight: "700",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  mapMock: {
    height: 240,
    borderRadius: 28,
    backgroundColor: "#EEE8E1",
    marginBottom: 22,
    position: "relative",
    overflow: "hidden",
  },
  mapPin: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#9A4600",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  mapPinText: {
    fontSize: 18,
    color: "#9A4600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 28,
    lineHeight: 32,
    color: "#1C1C19",
    fontWeight: "700",
  },
  sectionMeta: {
    color: "#7A675C",
    fontSize: 13,
    fontWeight: "600",
  },
  resultsWrap: {
    gap: 16,
  },
  resultCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 28,
    padding: 16,
  },
  resultImage: {
    height: 170,
    borderRadius: 22,
    backgroundColor: "#2C211C",
    marginBottom: 14,
  },
  resultBody: {
    gap: 12,
  },
  resultTopRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  resultTitle: {
    fontSize: 28,
    lineHeight: 32,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 4,
  },
  resultRoaster: {
    fontSize: 15,
    color: "#554339",
  },
  saveCircle: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#FCF9F4",
    alignItems: "center",
    justifyContent: "center",
  },
  saveCircleText: {
    color: "#9A4600",
    fontSize: 18,
    fontWeight: "700",
  },
  notesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  noteChip: {
    backgroundColor: "#E4EBDD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  noteChipText: {
    color: "#4C5A49",
    fontSize: 12,
    fontWeight: "600",
  },
  typeChip: {
    backgroundColor: "#F0DED2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  typeChipText: {
    color: "#7D3400",
    fontSize: 12,
    fontWeight: "700",
  },
  resultBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  venueText: {
    flex: 1,
    color: "#554339",
    fontSize: 14,
  },
  freshnessText: {
    color: "#9A4600",
    fontSize: 13,
    fontWeight: "600",
  },
});