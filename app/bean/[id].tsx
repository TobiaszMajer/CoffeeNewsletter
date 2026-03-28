import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { mockBeans } from "../../lib/mock-data";
import { getBeanBySlug, getAvailabilityByBeanId } from "../../lib/catalog";
import {
  isEntityFavorited,
  toggleFavoriteEntity,
} from "../../lib/user-actions";
import {
  getLatestReactionForBean,
  setReactionForBean,
  type BeanReaction,
} from "../../lib/reactions";
import { colors, radius, shadows, spacing, typography } from "../theme";

type LiveBean = {
  id: string;
  slug: string;
  name: string;
  origin: string | null;
  producer_estate: string | null;
  process: string | null;
  roast_style: string | null;
  flavor_notes: string[] | null;
  description: string | null;
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
};

type LiveAvailability = {
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
};

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default function BeanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const slug = id ?? "guji-natural";

  const fallback = mockBeans[slug] ?? mockBeans["guji-natural"];

  const [liveBean, setLiveBean] = useState<LiveBean | null>(null);
  const [liveAvailability, setLiveAvailability] = useState<LiveAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const [currentReaction, setCurrentReaction] = useState<BeanReaction | null>(null);
  const [isReactionLoading, setIsReactionLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        const bean = await getBeanBySlug(slug);
        if (!mounted) return;

        if (bean) {
          setLiveBean(bean);

          const availability = await getAvailabilityByBeanId(bean.id);
          if (!mounted) return;
          setLiveAvailability(availability);
        } else {
          setLiveBean(null);
          setLiveAvailability([]);
        }
      } catch (err) {
        console.error("Failed to load bean", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const liveRoaster = firstRelation(liveBean?.roasters);
  const primaryAvailability = liveAvailability[0];
  const primaryCafe = firstRelation(primaryAvailability?.cafes);

  const beanTitle = liveBean?.name ?? fallback.name;
  const beanOrigin = liveBean?.origin ?? fallback.origin;
  const beanProcess = liveBean?.process ?? fallback.process;
  const beanRoast = liveBean?.roast_style ?? fallback.roast;
  const beanRoasterName = liveRoaster?.name ?? fallback.roaster;
  const beanRoasterSlug = liveRoaster?.slug ?? fallback.roasterSlug;
  const beanNotes = liveBean?.flavor_notes ?? fallback.notes;
  const beanDescription = liveBean?.description ?? fallback.matchText;

  const availabilityChips = useMemo(() => {
    const firstLiveTypes =
      liveAvailability.find((item) => (item.availability_types ?? []).length > 0)
        ?.availability_types ?? [];

    if (firstLiveTypes.length > 0) {
      return firstLiveTypes.slice(0, 3);
    }

    return fallback.availability;
  }, [liveAvailability, fallback.availability]);

  const cafes = useMemo(() => {
    if (liveAvailability.length > 0) {
      return liveAvailability
        .map((row) => {
          const cafe = firstRelation(row.cafes);
          if (!cafe) return null;

          return {
            name: cafe.name,
            slug: cafe.slug,
            distance: row.distance_label ?? "Nearby",
            freshness: row.freshness_note ?? "Recently updated",
            types: row.availability_types ?? [],
          };
        })
        .filter(Boolean) as {
        name: string;
        slug: string;
        distance: string;
        freshness: string;
        types: string[];
      }[];
    }

    return fallback.cafes;
  }, [liveAvailability, fallback.cafes]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadScreenState() {
        try {
          const [favorited, latestReaction] = await Promise.all([
            isEntityFavorited("bean", slug),
            liveBean?.id
              ? getLatestReactionForBean(liveBean.id)
              : Promise.resolve(null),
          ]);

          if (!active) return;

          setIsFavorited(favorited);
          setCurrentReaction(
            (latestReaction?.reaction as BeanReaction | undefined) ?? null
          );
        } catch (error) {
          console.error("Failed to load bean screen state", error);
        }
      }

      void loadScreenState();

      return () => {
        active = false;
      };
    }, [slug, liveBean?.id])
  );

  async function handleToggleFavorite() {
    if (isFavoriteLoading) return;

    try {
      setIsFavoriteLoading(true);
      const nextState = await toggleFavoriteEntity("bean", slug);
      setIsFavorited(nextState);
    } catch (error) {
      console.error(error);
      Alert.alert("Could not update favorite state");
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  async function handleSetReaction(nextReaction: BeanReaction) {
    if (!liveBean?.id || isReactionLoading) return;

    try {
      setIsReactionLoading(true);
      await setReactionForBean(liveBean.id, nextReaction);
      setCurrentReaction(nextReaction);
    } catch (error) {
      console.error(error);
      Alert.alert("Could not save reaction");
    } finally {
      setIsReactionLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroOverlay} />

          <View style={styles.heroTopRow}>
            <Pressable onPress={() => router.back()} style={styles.heroAction}>
              <Text style={styles.heroActionText}>Back</Text>
            </Pressable>

            <Pressable
              style={[
                styles.heroAction,
                isFavorited && styles.heroActionActive,
                isFavoriteLoading && styles.buttonDisabled,
              ]}
              onPress={handleToggleFavorite}
              disabled={isFavoriteLoading}
            >
              <Text style={styles.heroActionText}>
                {isFavoriteLoading ? "…" : isFavorited ? "♥" : "♡"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.heroBottom}>
            <Text style={styles.heroEyebrow}>Bean detail</Text>
            <Text style={styles.heroTitle}>{beanTitle}</Text>
            <Text style={styles.heroSubtitle}>
              {beanOrigin} • {beanProcess}
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <Pressable onPress={() => router.push(`/roaster/${beanRoasterSlug}`)}>
              <Text style={styles.roasterLink}>by {beanRoasterName}</Text>
            </Pressable>

            <View style={styles.roastPill}>
              <Text style={styles.roastPillText}>{beanRoast}</Text>
            </View>
          </View>

          <Text style={styles.summaryText}>{beanDescription}</Text>

          {primaryCafe ? (
            <View style={styles.localCue}>
              <Text style={styles.localCueEyebrow}>Nearby now</Text>
              <Text style={styles.localCueText}>
                Available at {primaryCafe.name}
                {primaryAvailability?.freshness_note
                  ? ` • ${primaryAvailability.freshness_note}`
                  : ""}
              </Text>
            </View>
          ) : null}

          <View style={styles.availabilityRow}>
            {availabilityChips.map((item) => (
              <View key={item} style={styles.availabilityChip}>
                <Text style={styles.availabilityChipText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Sensory profile</Text>
            <Text style={styles.sectionTitle}>Flavor notes</Text>
          </View>
          {loading ? <ActivityIndicator color={colors.accentPrimary} /> : null}
        </View>

        <View style={styles.notesWrap}>
          {beanNotes.map((note) => (
            <View key={note} style={styles.noteChip}>
              <Text style={styles.noteChipText}>{note}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Tasting memory</Text>
            <Text style={styles.sectionTitle}>How was it?</Text>
          </View>
        </View>

        <View style={styles.reactionRow}>
          {[
            { value: "loved_it" as BeanReaction, emoji: "♥", label: "Loved it" },
            { value: "liked_it" as BeanReaction, emoji: "👍", label: "Liked it" },
            { value: "not_for_me" as BeanReaction, emoji: "☹", label: "Not for me" },
          ].map((item) => {
            const active = currentReaction === item.value;

            return (
              <Pressable
                key={item.value}
                style={[
                  styles.reactionCard,
                  active && styles.reactionCardActive,
                  isReactionLoading && styles.buttonDisabled,
                ]}
                onPress={() => handleSetReaction(item.value)}
                disabled={isReactionLoading || !liveBean?.id}
              >
                <Text
                  style={[
                    styles.reactionEmoji,
                    active && styles.reactionEmojiActive,
                  ]}
                >
                  {item.emoji}
                </Text>
                <Text
                  style={[
                    styles.reactionText,
                    active && styles.reactionTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Nearby places</Text>
            <Text style={styles.sectionTitle}>Where to drink this</Text>
          </View>
          <Text style={styles.sectionLink}>See map</Text>
        </View>

        <View style={styles.cafesWrap}>
          {cafes.map((cafe) => (
            <Pressable
              key={`${beanTitle}-${cafe.slug}`}
              style={styles.cafeCard}
              onPress={() => router.push(`/cafe/${cafe.slug}`)}
            >
              <View style={styles.cafeImage} />

              <View style={styles.cafeBody}>
                <View style={styles.cafeTopRow}>
                  <Text style={styles.cafeName}>{cafe.name}</Text>
                  <Text style={styles.cafeDistance}>{cafe.distance}</Text>
                </View>

                <Text style={styles.cafeFreshness}>{cafe.freshness}</Text>

                <View style={styles.cafeTypesRow}>
                  {cafe.types.map((type) => (
                    <View key={type} style={styles.cafeTypeChip}>
                      <Text style={styles.cafeTypeChipText}>{type}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    paddingBottom: spacing.section,
  },
  hero: {
    height: 380,
    backgroundColor: colors.heroDark,
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
    paddingTop: 20,
    paddingBottom: spacing.xl,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  heroAction: {
    minWidth: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroActionActive: {
    backgroundColor: "rgba(255,255,255,0.24)",
  },
  heroActionText: {
    color: colors.textOnDark,
    fontSize: 15,
    fontWeight: "700",
  },
  heroBottom: {
    zIndex: 1,
    gap: spacing.sm,
  },
  heroEyebrow: {
    ...typography.eyebrow,
    color: "rgba(255,255,255,0.72)",
  },
  heroTitle: {
    fontSize: 42,
    lineHeight: 46,
    fontWeight: "700",
    color: colors.textOnDark,
    maxWidth: 300,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "rgba(255,255,255,0.84)",
  },
  summaryCard: {
    backgroundColor: colors.surface,
    marginTop: -32,
    marginHorizontal: spacing.screen,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    gap: spacing.lg,
    ...shadows.card,
  },
  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  roasterLink: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  roastPill: {
    backgroundColor: colors.successSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  roastPillText: {
    ...typography.pill,
    color: colors.successText,
    fontWeight: "700",
  },
  summaryText: {
    ...typography.bodyCompact,
  },
  localCue: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  localCueEyebrow: {
    ...typography.eyebrow,
  },
  localCueText: {
    ...typography.bodyCompact,
    color: colors.accentDeep,
  },
  availabilityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  availabilityChip: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  availabilityChipText: {
    ...typography.pill,
    color: colors.accentDeep,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: spacing.screen,
    marginTop: spacing.section,
    marginBottom: spacing.lg,
    gap: spacing.md,
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
    fontWeight: "700",
  },
  notesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingHorizontal: spacing.screen,
  },
  noteChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  noteChipText: {
    ...typography.bodyCompact,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  reactionRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.screen,
  },
  reactionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
  },
  reactionCardActive: {
    backgroundColor: colors.successSoft,
    borderWidth: 1.5,
    borderColor: colors.successBorder,
  },
  reactionEmoji: {
    fontSize: 18,
    color: colors.accentDeep,
  },
  reactionEmojiActive: {
    color: colors.successText,
  },
  reactionText: {
    ...typography.pill,
    color: colors.textSecondary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  reactionTextActive: {
    color: colors.successText,
  },
  cafesWrap: {
    gap: spacing.md,
    paddingHorizontal: spacing.screen,
  },
  cafeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
  },
  cafeImage: {
    width: 76,
    height: 76,
    borderRadius: radius.md,
    backgroundColor: colors.heroSoft,
  },
  cafeBody: {
    flex: 1,
    gap: spacing.sm,
    justifyContent: "center",
  },
  cafeTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  cafeName: {
    ...typography.cardTitleCompact,
    flex: 1,
  },
  cafeDistance: {
    ...typography.meta,
  },
  cafeFreshness: {
    color: colors.accentPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  cafeTypesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  cafeTypeChip: {
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  cafeTypeChipText: {
    ...typography.pill,
    color: colors.textSecondary,
    fontWeight: "700",
  },
});