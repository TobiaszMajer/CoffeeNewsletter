import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import { mockCafes } from "../../lib/mock-data";
import { getCafeBySlug, getCafeBeans } from "../../lib/catalog"; 
import { useFocusEffect } from "@react-navigation/native";
import {
  isEntitySaved,
  isEntityFollowed,
  toggleSaveEntity,
  toggleFollowEntity,
  isEntityFavorited,
  toggleFavoriteEntity,
} from "../../lib/user-actions";

type LiveCafe = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  neighborhood: string | null;
  city: string | null;
  address: string | null;
  hours_text: string | null;
  tags: string[] | null;
  updated_at: string | null;
};

type LiveCafeBean = {
  freshness_note: string | null;
  availability_types: string[] | null;
  beans:
    | {
        slug: string;
        name: string;
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
      }
    | {
        slug: string;
        name: string;
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
      }[]
    | null;
};

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function formatUpdatedLabel(value: string | null) {
  if (!value) return "Recently updated";
  return "Updated recently";
}

export default function CafeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const slug = id ?? "rosslyn-coffee";

  const fallback = mockCafes[slug] ?? mockCafes["rosslyn-coffee"];
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [liveCafe, setLiveCafe] = useState<LiveCafe | null>(null);
  const [liveBeans, setLiveBeans] = useState<LiveCafeBean[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

useFocusEffect(
  useCallback(() => {
    let active = true;

    async function loadFavoriteState() {
      try {
        const favorited = await isEntityFavorited("cafe", slug);

        if (!active) return;
        setIsFavorited(favorited);
      } catch (error) {
        console.error("Failed to load cafe favorite state", error);
      }
    }

    void loadFavoriteState();

    return () => {
      active = false;
    };
  }, [slug])
);

async function handleToggleFavorite() {
  if (isFavoriteLoading) return;

  try {
    setIsFavoriteLoading(true);
    const nextState = await toggleFavoriteEntity("cafe", slug);
    setIsFavorited(nextState);
  } catch (error) {
    console.error(error);
    Alert.alert("Could not update favorite state");
  } finally {
    setIsFavoriteLoading(false);
  }
}

  const title = liveCafe?.name ?? fallback.name;
  const area = liveCafe?.neighborhood ?? fallback.area;
  const description = liveCafe?.description ?? fallback.description;
  const tags = liveCafe?.tags ?? fallback.vibeTags;
  const updated = formatUpdatedLabel(liveCafe?.updated_at) ?? fallback.updated;
  const hours = liveCafe?.hours_text ?? fallback.hours;
  const address = liveCafe?.address ?? fallback.address;

  const beans = useMemo(() => {
    if (liveBeans.length > 0) {
      return liveBeans
        .map((row) => {
          const bean = firstRelation(row.beans);
          if (!bean) return null;

          const roaster = firstRelation(bean.roasters);

          return {
            id: bean.slug,
            name: bean.name,
            roaster: roaster?.name ?? "Unknown roaster",
            roasterSlug: roaster?.slug ?? "",
            notes: (bean.flavor_notes ?? []).slice(0, 2),
            types: row.availability_types ?? [],
            match: row.freshness_note ?? undefined,
          };
        })
        .filter(Boolean) as {
        id: string;
        name: string;
        roaster: string;
        roasterSlug: string;
        notes: string[];
        types: string[];
        match?: string;
      }[];
    }

    return fallback.beans;
  }, [liveBeans, fallback.beans]);

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

        <View style={styles.topCard}>
          <View style={styles.topRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.area}>{area}</Text>
              <Text style={styles.title}>{title}</Text>
            </View>

            <View style={styles.saveWrap}>
              <Pressable
                style={[
                  styles.iconButton,
                  isFavorited && styles.iconButtonActive,
                  isFavoriteLoading && styles.iconButtonDisabled,
                ]}
                onPress={handleToggleFavorite}
                disabled={isFavoriteLoading}
              >
                <Text
                  style={[
                    styles.iconButtonText,
                    isFavorited && styles.iconButtonTextActive,
                  ]}
                >
                  {isFavoriteLoading ? "…" : isFavorited ? "♥" : "♡"}
                </Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.description}>{description}</Text>

          <View style={styles.tagsWrap}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.updated}>{updated}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>On the Bar</Text>
          {loading ? <ActivityIndicator color="#9A4600" /> : null}
        </View>

        <View style={styles.beansWrap}>
          {beans.map((bean) => (
            <Pressable
              key={bean.id}
              style={styles.beanCard}
              onPress={() => router.push(`/bean/${bean.id}`)}
            >
              <View style={styles.beanTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.beanName}>{bean.name}</Text>
                  {bean.roasterSlug ? (
                    <Pressable
                      onPress={() => router.push(`/roaster/${bean.roasterSlug}`)}
                    >
                      <Text style={styles.beanRoaster}>by {bean.roaster}</Text>
                    </Pressable>
                  ) : (
                    <Text style={styles.beanRoaster}>by {bean.roaster}</Text>
                  )}
                </View>

                {bean.match ? (
                  <View style={styles.matchPill}>
                    <Text style={styles.matchPillText}>{bean.match}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.notesWrap}>
                {bean.notes.map((note) => (
                  <View key={note} style={styles.noteChip}>
                    <Text style={styles.noteChipText}>{note}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.typesWrap}>
                {bean.types.map((type) => (
                  <View key={type} style={styles.typeChip}>
                    <Text style={styles.typeChipText}>{type}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitleStandalone}>Details</Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hours</Text>
            <Text style={styles.detailValue}>{hours}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{address}</Text>
          </View>

          {fallback.brunchNote ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Food</Text>
              <Text style={styles.detailValue}>{fallback.brunchNote}</Text>
            </View>
          ) : null}

          <Pressable style={styles.directionsButton}>
            <Text style={styles.directionsButtonText}>Directions</Text>
          </Pressable>
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
    backgroundColor: "#f3efea",
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    height: 280,
    backgroundColor: "#B89D88",
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
  topCard: {
    backgroundColor: "#F1ECE5",
    marginTop: -28,
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 20,
    gap: 14,
  },
  topRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  area: {
    color: "#7A675C",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    color: "#1C1C19",
    fontWeight: "700",
  },
  saveWrap: {
    gap: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    //borderRadius: 999,
    //backgroundColor: "#F1ECE5",
    alignItems: "center",
    justifyContent: "center",
  },
    iconButtonActive: {
    backgroundColor: "#F1ECE5",
    //borderWidth: 1.5,
    //borderColor: "#6F7D57",
  },
  iconButtonTextActive: {
    color: "#ff0000f8",
  },
  iconButtonDisabled: {
    opacity: 0.1,
  },
  iconButtonText: {
    color: "#ff0000f8",
    fontSize:30,
    fontWeight: "700",
  },
  description: {
    color: "#554339",
    fontSize: 16,
    lineHeight: 24,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    backgroundColor: "#EFE7DE",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
  },
  tagText: {
    color: "#6B4B38",
    fontSize: 12,
    fontWeight: "700",
  },
  updated: {
    color: "#9A4600",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginTop: 26,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 28,
    lineHeight: 32,
    color: "#1C1C19",
    fontWeight: "700",
  },
  beansWrap: {
    gap: 14,
    paddingHorizontal: 24,
  },
  beanCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 24,
    padding: 16,
    gap: 12,
  },
  beanTopRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  beanName: {
    fontSize: 24,
    lineHeight: 28,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 4,
  },
  beanRoaster: {
    fontSize: 15,
    color: "#554339",
  },
  matchPill: {
    backgroundColor: "#E4EBDD",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  matchPillText: {
    color: "#4C5A49",
    fontSize: 12,
    fontWeight: "700",
  },
  notesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  noteChip: {
    backgroundColor: "#FCF9F4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  noteChipText: {
    color: "#554339",
    fontSize: 12,
    fontWeight: "600",
  },
  typesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
  sectionTitleStandalone: {
    fontSize: 28,
    lineHeight: 32,
    color: "#1C1C19",
    fontWeight: "700",
    marginTop: 26,
    marginBottom: 14,
    paddingHorizontal: 24,
  },
  detailsCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 24,
    padding: 18,
    marginHorizontal: 24,
    gap: 16,
  },
  detailRow: {
    gap: 6,
  },
  detailLabel: {
    color: "#7A675C",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  detailValue: {
    color: "#1C1C19",
    fontSize: 16,
    lineHeight: 24,
  },
  directionsButton: {
    backgroundColor: "#9A4600",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 4,
  },
  directionsButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});