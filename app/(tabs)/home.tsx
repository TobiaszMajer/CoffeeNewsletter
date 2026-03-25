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
import { getHomeBeans } from "../../lib/catalog";

type LiveHomeBean = {
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

const FALLBACK_BEANS = [
  {
    id: "guji-natural",
    name: "Guji Natural",
    roaster: "Dark Arts Coffee",
    notes: ["Blueberry", "Violet"],
    venue: "Rosslyn Coffee",
    freshness: "Updated today",
    type: "Filter",
  },
  {
    id: "washed-yirgacheffe",
    name: "Washed Yirgacheffe",
    roaster: "Square Mile",
    notes: ["Jasmine", "Bergamot"],
    venue: "Prufrock Coffee",
    freshness: "Updated 4h ago",
    type: "Espresso",
  },
];

export default function HomeScreen() {
  const [liveBeans, setLiveBeans] = useState<LiveHomeBean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getHomeBeans();
        if (!mounted) return;
        setLiveBeans(data as LiveHomeBean[]);
      } catch (err) {
        console.error("Failed to load home beans", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const homeBeans = useMemo(() => {
    if (liveBeans.length === 0) return FALLBACK_BEANS;

    return liveBeans.map((bean) => {
      const roaster = firstRelation(bean.roasters);
      const availability = bean.cafe_bean_availability?.[0];
      const cafe = firstRelation(availability?.cafes);

      return {
        id: bean.slug,
        name: bean.name,
        roaster: roaster?.name ?? "Unknown roaster",
        notes: (bean.flavor_notes ?? []).slice(0, 2),
        venue: cafe?.name ?? "Nearby café",
        freshness: availability?.freshness_note ?? "Recently updated",
        type: availability?.availability_types?.[0] ?? bean.roast_style ?? "Coffee",
      };
    });
  }, [liveBeans]);

  const heroBean = homeBeans[0];
  const freshBean = homeBeans[1] ?? homeBeans[0];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <Text style={styles.brand}>Oat & Ember</Text>
        {loading ? <ActivityIndicator color="#9A4600" /> : null}
      </View>

      <Text style={styles.title}>Good evening.</Text>
      <Text style={styles.subtitle}>
        Ready to discover beans that fit your taste?
      </Text>

      <Pressable
        style={styles.searchBox}
        onPress={() => router.push("/(tabs)/explore")}
      >
        <Text style={styles.searchText}>Search beans, roasters, or cafés...</Text>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Best matches near you</Text>
        <Pressable onPress={() => router.push("/(tabs)/explore")}>
          <Text style={styles.sectionLink}>See all</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.heroCard}
        onPress={() => router.push(`/bean/${heroBean.id}`)}
      >
        <View style={styles.heroImage} />
        <Text style={styles.cardTitle}>{heroBean.name}</Text>
        <Text style={styles.cardMeta}>by {heroBean.roaster}</Text>
        <Text style={styles.cardNotes}>
          {heroBean.notes.join(" • ")} • {heroBean.type}
        </Text>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fresh drops today</Text>
      </View>

      <Pressable
        style={styles.smallCard}
        onPress={() => router.push(`/bean/${freshBean.id}`)}
      >
        <Text style={styles.smallCardTitle}>{freshBean.name}</Text>
        <Text style={styles.smallCardText}>
          {freshBean.freshness} at {freshBean.venue}.
        </Text>
      </Pressable>
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  brand: {
    fontSize: 22,
    fontStyle: "italic",
    color: "#9A4600",
    fontWeight: "600",
  },
  title: {
    fontSize: 40,
    lineHeight: 44,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 25,
    color: "#554339",
    marginBottom: 24,
    maxWidth: 320,
  },
  searchBox: {
    backgroundColor: "#F1ECE5",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 28,
  },
  searchText: {
    color: "#7A675C",
    fontSize: 15,
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
  sectionLink: {
    color: "#9A4600",
    fontSize: 14,
    fontWeight: "600",
  },
  heroCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 28,
    padding: 16,
    marginBottom: 30,
  },
  heroImage: {
    height: 240,
    borderRadius: 22,
    backgroundColor: "#2C211C",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 28,
    lineHeight: 32,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 6,
  },
  cardMeta: {
    fontSize: 16,
    color: "#554339",
    marginBottom: 8,
  },
  cardNotes: {
    fontSize: 14,
    color: "#7A675C",
  },
  smallCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 24,
    padding: 18,
  },
  smallCardTitle: {
    fontSize: 20,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 8,
  },
  smallCardText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#554339",
  },
});