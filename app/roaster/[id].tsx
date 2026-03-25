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
import { mockRoasters } from "../../lib/mock-data";
import { getRoasterBySlug, getBeansByRoasterId } from "../../lib/catalog";
import { Alert } from "react-native";
import { followEntity } from "../../lib/user-actions";
type LiveRoaster = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  flavor_direction: string | null;
};

type LiveBean = {
  slug: string;
  name: string;
  flavor_notes: string[] | null;
  roast_style: string | null;
};

export default function RoasterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const slug = id ?? "dark-arts-coffee";

  const fallback = mockRoasters[slug] ?? mockRoasters["dark-arts-coffee"];

  const [liveRoaster, setLiveRoaster] = useState<LiveRoaster | null>(null);
  const [liveBeans, setLiveBeans] = useState<LiveBean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        const roaster = await getRoasterBySlug(slug);

        if (!mounted) return;

        if (roaster) {
          setLiveRoaster(roaster);

          const beans = await getBeansByRoasterId(roaster.id);
          if (!mounted) return;
          setLiveBeans(beans);
        }
      } catch (err) {
        console.error("Failed to load roaster", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const title = liveRoaster?.name ?? fallback.name;
  const description = liveRoaster?.description ?? fallback.description;
  const flavorDirection =
    liveRoaster?.flavor_direction ?? fallback.flavorDirection;

  const featuredBeans = useMemo(() => {
    if (liveBeans.length > 0) {
      return liveBeans.map((bean) => ({
        id: bean.slug,
        name: bean.name,
        notes: bean.flavor_notes ?? [],
        roast: bean.roast_style ?? "Roast",
        availability: ["See details"],
      }));
    }

    return fallback.featuredBeans;
  }, [liveBeans, fallback.featuredBeans]);

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
          <Text style={styles.eyebrow}>Roaster</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.flavorBox}>
            <Text style={styles.flavorLabel}>Flavor direction</Text>
            <Text style={styles.flavorText}>{flavorDirection}</Text>
          </View>

          <Pressable
            style={styles.followButton}
            onPress={async () => {
              try {
                await followEntity("roaster", slug);
                Alert.alert("Following", "Roaster added to your follows.");
              } catch (error) {
                console.error(error);
                Alert.alert("Could not follow roaster");
              }
            }}
          >
            <Text style={styles.followButtonText}>Follow Roaster</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Beans</Text>
          {loading ? <ActivityIndicator color="#9A4600" /> : null}
        </View>

        <View style={styles.beansWrap}>
          {featuredBeans.map((bean) => (
            <Pressable
              key={bean.id}
              style={styles.beanCard}
              onPress={() => router.push(`/bean/${bean.id}`)}
            >
              <View style={styles.beanImage} />

              <View style={styles.beanBody}>
                <Text style={styles.beanName}>{bean.name}</Text>
                <Text style={styles.beanRoast}>{bean.roast}</Text>

                <View style={styles.notesWrap}>
                  {bean.notes.map((note) => (
                    <View key={note} style={styles.noteChip}>
                      <Text style={styles.noteChipText}>{note}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.availabilityWrap}>
                  {bean.availability.map((item) => (
                    <View key={item} style={styles.availabilityChip}>
                      <Text style={styles.availabilityChipText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Try Nearby</Text>
          <Text style={styles.sectionLink}>Open map</Text>
        </View>

        <View style={styles.cafesWrap}>
          {fallback.nearbyCafes.map((cafe) => (
            <Pressable
              key={cafe.id}
              style={styles.cafeCard}
              onPress={() => router.push(`/cafe/${cafe.id}`)}
            >
              <View style={styles.cafeImage} />

              <View style={styles.cafeBody}>
                <View style={styles.cafeTopRow}>
                  <Text style={styles.cafeName}>{cafe.name}</Text>
                  <Text style={styles.cafeDistance}>{cafe.distance}</Text>
                </View>
                <Text style={styles.cafeFreshness}>{cafe.freshness}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FCF9F4" },
  screen: { flex: 1, backgroundColor: "#FCF9F4" },
  content: { paddingBottom: 32 },
  hero: {
    height: 280,
    backgroundColor: "#7B5B47",
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
  backText: { color: "#FFFFFF", fontWeight: "600" },
  topCard: {
    backgroundColor: "#F1ECE5",
    marginTop: -28,
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 20,
    gap: 14,
  },
  eyebrow: {
    color: "#7A675C",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    color: "#1C1C19",
    fontWeight: "700",
  },
  description: { color: "#554339", fontSize: 16, lineHeight: 24 },
  flavorBox: {
    backgroundColor: "#FCF9F4",
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  flavorLabel: {
    color: "#7A675C",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  flavorText: { color: "#7D3400", fontSize: 15, fontWeight: "600" },
  followButton: {
    backgroundColor: "#9A4600",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  followButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  sectionHeader: {
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
  },
  sectionLink: { color: "#9A4600", fontSize: 14, fontWeight: "700" },
  beansWrap: { gap: 14, paddingHorizontal: 24 },
  beanCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 24,
    padding: 14,
    flexDirection: "row",
    gap: 14,
  },
  beanImage: {
    width: 88,
    height: 88,
    borderRadius: 18,
    backgroundColor: "#B89D88",
  },
  beanBody: { flex: 1, gap: 10 },
  beanName: {
    fontSize: 22,
    lineHeight: 26,
    color: "#1C1C19",
    fontWeight: "700",
  },
  beanRoast: {
    color: "#7A675C",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  notesWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  noteChip: {
    backgroundColor: "#FCF9F4",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  noteChipText: { color: "#554339", fontSize: 12, fontWeight: "600" },
  availabilityWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  availabilityChip: {
    backgroundColor: "#EFE7DE",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  availabilityChipText: { color: "#7D3400", fontSize: 12, fontWeight: "700" },
  cafesWrap: { gap: 14, paddingHorizontal: 24 },
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
    backgroundColor: "#C4AF9E",
  },
  cafeBody: { flex: 1, gap: 8, justifyContent: "center" },
  cafeTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  cafeName: { flex: 1, fontSize: 20, color: "#1C1C19", fontWeight: "700" },
  cafeDistance: { color: "#7A675C", fontSize: 13 },
  cafeFreshness: { color: "#9A4600", fontSize: 13, fontWeight: "700" },
});