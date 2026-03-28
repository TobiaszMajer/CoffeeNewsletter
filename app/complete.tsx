import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Alert,
} from "react-native";
import { router } from "expo-router";
import {
  clearOnboardingDraft,
  getOnboardingDraft,
  persistOnboardingProfile,
  type OnboardingDraft,
} from "../lib/onboarding";

export default function CompleteScreen() {
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<OnboardingDraft | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDraft() {
      try {
        const data = await getOnboardingDraft();
        if (!active) return;
        setDraft(data);
      } catch (error) {
        console.error("Failed to load onboarding draft", error);
      }
    }

    void loadDraft();

    return () => {
      active = false;
    };
  }, []);

  const summaryTitle = useMemo(() => {
    const discovery = draft?.discovery_style ?? "Balanced";
    const roast = (draft?.roast_preference ?? "Light").toLowerCase();
    return `${discovery} & ${roast}`;
  }, [draft]);

  const summaryText = useMemo(() => {
    const flavors = draft?.flavor_preferences ?? ["Caramel"];
    const drinkStyle = draft?.drink_style ?? "All";

    return `We’ll start by prioritizing ${flavors
      .slice(0, 2)
      .join(", ")
      .toLowerCase()} profiles and coffees that work well for ${drinkStyle.toLowerCase()}.`;
  }, [draft]);

  const summaryTags = useMemo(() => {
    const flavors = draft?.flavor_preferences ?? ["Caramel"];
    const roast = draft?.roast_preference;
    const discovery = draft?.discovery_style;

    return [...flavors.slice(0, 2), roast, discovery]
      .filter(Boolean)
      .slice(0, 3) as string[];
  }, [draft]);

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
      }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topArea}>
          <Text style={styles.brand}>Oat & Ember</Text>

          <View style={styles.progressRow}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.activeBar} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Your palette is set.</Text>

          <Text style={styles.subtitle}>
            We’ve shaped a starting profile to guide your first discoveries.
          </Text>

          <View style={styles.summaryCard}>
            <View style={styles.badgeCircle}>
              <Text style={styles.badgeIcon}>✦</Text>
            </View>

            <Text style={styles.summaryTitle}>{summaryTitle}</Text>

            <Text style={styles.summaryText}>{summaryText}</Text>

            <View style={styles.tags}>
              {summaryTags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <Pressable
            style={[styles.primaryButton, loading && { opacity: 0.7 }]}
            onPress={async () => {
              try {
                setLoading(true);
                await persistOnboardingProfile();
                await clearOnboardingDraft();
                router.replace("/(tabs)/home");
              } catch (error) {
                console.error(error);
                Alert.alert("Could not save your onboarding profile");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Saving..." : "Continue as guest"}
            </Text>
          </Pressable>

          <Text style={styles.footerText}>
            You can create an account later.
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FCF9F4",
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(252, 249, 244, 0.78)",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  topArea: {
    alignItems: "center",
    gap: 18,
    paddingTop: 12,
  },
  brand: {
    fontSize: 22,
    fontStyle: "italic",
    color: "#9A4600",
    fontWeight: "600",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#DCC1B4",
  },
  activeBar: {
    width: 28,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#9A4600",
  },
  content: {
    gap: 18,
    marginBottom: 32,
  },
  title: {
    fontSize: 42,
    lineHeight: 46,
    color: "#1C1C19",
    fontWeight: "600",
    maxWidth: 320,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 26,
    color: "#554339",
    maxWidth: 340,
  },
  summaryCard: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 30,
    padding: 22,
    marginTop: 6,
  },
  badgeCircle: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "#E4EBDD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    alignSelf: "center",
  },
  badgeIcon: {
    fontSize: 26,
    color: "#7A6E45",
    fontWeight: "700",
  },
  summaryTitle: {
    fontSize: 30,
    lineHeight: 34,
    color: "#1C1C19",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#554339",
    textAlign: "center",
    marginBottom: 18,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  tag: {
    backgroundColor: "#EFE7DE",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  tagText: {
    color: "#5E4332",
    fontSize: 13,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#9A4600",
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  footerText: {
    textAlign: "center",
    color: "#6B5A4E",
    fontSize: 14,
    marginTop: 2,
  },
});