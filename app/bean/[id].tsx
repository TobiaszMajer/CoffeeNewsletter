import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { mockBeans } from "../../lib/mock-data";
import { getBeanBySlug, getAvailabilityByBeanId } from "../../lib/catalog";
import { Alert } from "react-native";
import { saveEntity, followEntity } from "../../lib/user-actions";

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
        }
      } catch (err) {
        console.error("Failed to load bean", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const liveRoaster = firstRelation(liveBean?.roasters);

  const beanTitle = liveBean?.name ?? fallback.name;
  const beanOrigin = liveBean?.origin ?? fallback.origin;
  const beanProcess = liveBean?.process ?? fallback.process;
  const beanRoast = liveBean?.roast_style ?? fallback.roast;
  const beanRoasterName = liveRoaster?.name ?? fallback.roaster;
  const beanRoasterSlug = liveRoaster?.slug ?? fallback.roasterSlug;
  const beanNotes = liveBean?.flavor_notes ?? fallback.notes;

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.topMetaRow}>
            <Text style={styles.originMeta}>
              {beanOrigin} • {beanProcess}
            </Text>
            <View style={styles.roastChip}>
              <Text style={styles.roastChipText}>{beanRoast}</Text>
            </View>
          </View>

          <Text style={styles.title}>{beanTitle}</Text>
          <Pressable onPress={() => router.push(`/roaster/${beanRoasterSlug}`)}>
            <Text style={styles.roaster}>Roaster: {beanRoasterName}</Text>
          </Pressable>

          <View style={styles.matchBox}>
            <Text style={styles.matchText}>{fallback.matchText}</Text>
          </View>

          <View style={styles.availabilityRow}>
            {fallback.availability.map((item) => (
              <View key={item} style={styles.availabilityChip}>
                <Text style={styles.availabilityChipText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={styles.primaryButton}
              onPress={async () => {
                try {
                  await saveEntity("bean", slug);
                  Alert.alert("Saved", "Bean saved to your collection.");
                } catch (error) {
                  console.error(error);
                  Alert.alert("Could not save bean");
                }
              }}
            >
              <Text style={styles.primaryButtonText}>Save Bean</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={async () => {
                try {
                  await followEntity("roaster", beanRoasterSlug);
                  Alert.alert("Following", "Roaster added to your follows.");
                } catch (error) {
                  console.error(error);
                  Alert.alert("Could not follow roaster");
                }
              }}
            >
              <Text style={styles.secondaryButtonText}>Follow Roaster</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionHeaderSimple}>
          <Text style={styles.sectionTitle}>Flavor Notes</Text>
          {loading ? <ActivityIndicator color="#9A4600" /> : null}
        </View>

        <View style={styles.notesWrap}>
          {beanNotes.map((note) => (
            <View key={note} style={styles.noteChip}>
              <Text style={styles.noteChipText}>{note}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>How was it?</Text>
        <View style={styles.reactionRow}>
          <Pressable style={styles.reactionCard}>
            <Text style={styles.reactionEmoji}>♥</Text>
            <Text style={styles.reactionText}>Loved it</Text>
          </Pressable>
          <Pressable style={styles.reactionCard}>
            <Text style={styles.reactionEmoji}>👍</Text>
            <Text style={styles.reactionText}>Liked it</Text>
          </Pressable>
          <Pressable style={styles.reactionCard}>
            <Text style={styles.reactionEmoji}>☹</Text>
            <Text style={styles.reactionText}>Not for me</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Where to drink this nearby</Text>
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
    backgroundColor: "#FCF9F4",
  },
  screen: {
    flex: 1,
    backgroundColor: "#FCF9F4",
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    height: 300,
    backgroundColor: "#2C211C",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  backText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#F1ECE5",
    marginTop: -28,
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 20,
    gap: 14,
  },
  topMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  originMeta: {
    color: "#7A675C",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  roastChip: {
    backgroundColor: "#DFE8D8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  roastChipText: {
    color: "#5A6A54",
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
    color: "#1C1C19",
    fontWeight: "700",
  },
  roaster: {
    color: "#554339",
    fontSize: 16,
  },
  matchBox: {
    backgroundColor: "#F8F3EE",
    borderRadius: 16,
    padding: 14,
  },
  matchText: {
    color: "#7D3400",
    fontSize: 15,
    fontWeight: "600",
  },
  availabilityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  availabilityChip: {
    backgroundColor: "#EFE7DE",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
  },
  availabilityChipText: {
    color: "#6B4B38",
    fontSize: 12,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#9A4600",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#9A4600",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "#FCF9F4",
  },
  secondaryButtonText: {
    color: "#9A4600",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionHeaderSimple: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 26,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 28,
    lineHeight: 32,
    color: "#1C1C19",
    fontWeight: "700",
    marginTop: 26,
    marginBottom: 14,
    paddingHorizontal: 24,
  },
  notesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 24,
  },
  noteChip: {
    backgroundColor: "#F1ECE5",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  noteChipText: {
    color: "#554339",
    fontSize: 14,
    fontWeight: "600",
  },
  reactionRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
  },
  reactionCard: {
    flex: 1,
    backgroundColor: "#F1ECE5",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    gap: 8,
  },
  reactionEmoji: {
    fontSize: 18,
    color: "#7D3400",
  },
  reactionText: {
    color: "#554339",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 26,
    marginBottom: 14,
  },
  sectionLink: {
    color: "#9A4600",
    fontSize: 14,
    fontWeight: "700",
  },
  cafesWrap: {
    gap: 14,
    paddingHorizontal: 24,
  },
  cafeCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 24,
    padding: 14,
    flexDirection: "row",
    gap: 14,
  },
  cafeImage: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#B9A18F",
  },
  cafeBody: {
    flex: 1,
    gap: 8,
  },
  cafeTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  cafeName: {
    flex: 1,
    fontSize: 20,
    color: "#1C1C19",
    fontWeight: "700",
  },
  cafeDistance: {
    color: "#7A675C",
    fontSize: 13,
  },
  cafeFreshness: {
    color: "#9A4600",
    fontSize: 13,
    fontWeight: "700",
  },
  cafeTypesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cafeTypeChip: {
    backgroundColor: "#EFE7DE",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  cafeTypeChipText: {
    color: "#6B4B38",
    fontSize: 12,
    fontWeight: "700",
  },
});