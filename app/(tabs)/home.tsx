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
import { colors, radius, shadows, spacing, typography } from "../theme";

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

    void load();

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
        {loading ? <ActivityIndicator color={colors.accentPrimary} /> : null}
      </View>

      <View style={styles.introBlock}>
        <Text style={styles.eyebrow}>Today’s discovery</Text>
        <Text style={styles.title}>Good evening.</Text>
        <Text style={styles.subtitle}>
          A calmer way to find beans that fit your taste, nearby right now.
        </Text>
      </View>

      {/* <Pressable
        style={styles.searchBox}
        onPress={() => router.push("/(tabs)/explore")}
      >
        <Text style={styles.searchText}>Search beans, roasters, or cafés...</Text>
        <Text style={styles.searchHint}>Explore</Text>
      </Pressable> */}

      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionEyebrow}>For you</Text>
          <Text style={styles.sectionTitle}>Best matches nearby</Text>
        </View>

        <Pressable onPress={() => router.push("/(tabs)/explore")}>
          <Text style={styles.sectionLink}>See all</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.heroCard}
        onPress={() => router.push(`/bean/${heroBean.id}`)}
      >
        <View style={styles.heroImage} />

        <View style={styles.heroBody}>
          <View style={styles.heroMetaRow}>
            <Text style={styles.heroMeta}>{heroBean.roaster}</Text>
            <View style={styles.typePill}>
              <Text style={styles.typePillText}>{heroBean.type}</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>{heroBean.name}</Text>

          <Text style={styles.heroDescription}>
            Notes of {heroBean.notes.join(", ").toLowerCase()} — available at{" "}
            {heroBean.venue}.
          </Text>

          <View style={styles.heroFooter}>
            <Text style={styles.heroFreshness}>{heroBean.freshness}</Text>
            <Text style={styles.heroAction}>Open bean</Text>
          </View>
        </View>
      </Pressable>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionEyebrow}>Freshness</Text>
          <Text style={styles.sectionTitle}>Fresh drops today</Text>
        </View>
      </View>

      <Pressable
        style={styles.featureCard}
        onPress={() => router.push(`/bean/${freshBean.id}`)}
      >
        <View style={styles.featureTextBlock}>
          <Text style={styles.featureTitle}>{freshBean.name}</Text>
          <Text style={styles.featureText}>
            {freshBean.freshness} at {freshBean.venue}.
          </Text>
        </View>

        <View style={styles.featureBadge}>
          <Text style={styles.featureBadgeText}>{freshBean.type}</Text>
        </View>
      </Pressable>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionEyebrow}>Taste cue</Text>
          <Text style={styles.sectionTitle}>What suits you lately</Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Bright, floral, and clean.</Text>
        <Text style={styles.insightText}>
          Your recent profile leans toward lighter, expressive coffees with a
          softer filter-friendly feel.
        </Text>

        <View style={styles.insightTags}>
          {heroBean.notes.map((note) => (
            <View key={note} style={styles.insightTag}>
              <Text style={styles.insightTagText}>{note}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: 64,
    paddingBottom: spacing.section,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.section,
  },
  brand: {
    ...typography.brand,
  },
  introBlock: {
    marginBottom: spacing.xxl,
  },
  eyebrow: {
    ...typography.eyebrow,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.display,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    maxWidth: 320,
  },
  searchBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.section,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchText: {
    color: colors.textTertiary,
    fontSize: 15,
    flex: 1,
    marginRight: spacing.md,
  },
  searchHint: {
    color: colors.accentPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: spacing.lg,
  },
  sectionHeaderText: {
    gap: spacing.xs,
  },
  sectionEyebrow: {
    ...typography.eyebrow,
  },
  sectionTitle: {
    ...typography.sectionTitle,
  },
  sectionLink: {
    color: colors.accentPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    overflow: "hidden",
    marginBottom: spacing.section,
    ...shadows.card,
  },
  heroImage: {
    height: 300,
    backgroundColor: colors.heroDark,
  },
  heroBody: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  heroMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  heroMeta: {
    ...typography.meta,
    color: colors.textSecondary,
    flex: 1,
  },
  typePill: {
    backgroundColor: colors.successSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  typePillText: {
    ...typography.pill,
    color: colors.successText,
  },
  heroTitle: {
    ...typography.cardTitle,
  },
  heroDescription: {
    ...typography.bodyCompact,
  },
  heroFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  heroFreshness: {
    color: colors.accentPrimary,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  heroAction: {
    color: colors.textTertiary,
    fontSize: 14,
    fontWeight: "600",
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.section,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.lg,
  },
  featureTextBlock: {
    flex: 1,
    gap: spacing.sm,
  },
  featureTitle: {
    ...typography.cardTitleCompact,
  },
  featureText: {
    ...typography.bodyCompact,
  },
  featureBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  featureBadgeText: {
    ...typography.pill,
    color: colors.accentDeep,
    fontWeight: "700",
  },
  insightCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  insightTitle: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  insightText: {
    ...typography.bodyCompact,
  },
  insightTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  insightTag: {
    backgroundColor: colors.canvas,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  insightTagText: {
    ...typography.pill,
    color: colors.textSecondary,
  },
});