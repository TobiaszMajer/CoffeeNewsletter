import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import {
  getOnboardingDraft,
  updateOnboardingDraft,
} from "../lib/onboarding";

type DiscoveryStyle = "Safe" | "Balanced" | "Adventurous";

const OPTIONS: {
  key: DiscoveryStyle;
  title: string;
  subtitle: string;
}[] = [
  {
    key: "Safe",
    title: "Safe",
    subtitle: "Familiar classics and easy crowd-pleasers.",
  },
  {
    key: "Balanced",
    title: "Balanced",
    subtitle: "A mix of comfort and occasional surprise.",
  },
  {
    key: "Adventurous",
    title: "Adventurous",
    subtitle: "Funky, rare, and unexpected cups worth chasing.",
  },
];

export default function DiscoveryStyleScreen() {
  const [selected, setSelected] = useState<DiscoveryStyle>("Balanced");

  const canContinue = useMemo(() => !!selected, [selected]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadDraft() {
      try {
        const draft = await getOnboardingDraft();
        if (!active) return;

        if (
          draft.discovery_style === "Safe" ||
          draft.discovery_style === "Balanced" ||
          draft.discovery_style === "Adventurous"
        ) {
          setSelected(draft.discovery_style);
        }
      } catch (error) {
        console.error("Failed to load onboarding draft", error);
      }
    }

    void loadDraft();

    return () => {
      active = false;
    };
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>Back</Text>
        </Pressable>

        <View style={styles.progressRow}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.activeBar} />
          <View style={styles.dot} />
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Discovery Style</Text>
          <Text style={styles.heroTitle}>How adventurous is your palate?</Text>
          <Text style={styles.heroSubtitle}>
            We’ll use this to balance familiar favorites with more surprising
            recommendations.
          </Text>
        </View>

        <View style={styles.optionsWrap}>
          {OPTIONS.map((option) => {
            const isSelected = selected === option.key;

            return (
              <Pressable
                key={option.key}
                onPress={() => setSelected(option.key)}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
              >
                <View style={styles.optionTextWrap}>
                  <Text
                    style={[
                      styles.optionTitle,
                      isSelected && styles.optionTitleSelected,
                    ]}
                  >
                    {option.title}
                  </Text>
                  <Text
                    style={[
                      styles.optionSubtitle,
                      isSelected && styles.optionSubtitleSelected,
                    ]}
                  >
                    {option.subtitle}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radio,
                    isSelected && styles.radioSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.stepText}>Step 5 of 6</Text>

          <Pressable
            style={styles.button}
            disabled={!canContinue || isSaving}
            onPress={async () => {
            try {
              setIsSaving(true);
              await updateOnboardingDraft({
                discovery_style: selected,
              });
              router.push("/complete");
            } catch (error) {
              console.error(error);
              Alert.alert("Could not save your discovery style");
            } finally {
              setIsSaving(false);
            }
          }}
          >
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FCF9F4",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    color: "#9A4600",
    fontSize: 16,
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
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: "#EFE7DE",
    borderRadius: 28,
    padding: 22,
    marginBottom: 22,
  },
  heroEyebrow: {
    color: "#7A675C",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  heroTitle: {
    color: "#1C1C19",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "600",
    marginBottom: 12,
    maxWidth: 300,
  },
  heroSubtitle: {
    color: "#554339",
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 320,
  },
  optionsWrap: {
    gap: 14,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1ECE5",
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  optionCardSelected: {
    backgroundColor: "#F4E3D8",
    borderWidth: 1.5,
    borderColor: "#C88A59",
  },
  optionTextWrap: {
    flex: 1,
    gap: 6,
  },
  optionTitle: {
    fontSize: 21,
    fontWeight: "600",
    color: "#1C1C19",
  },
  optionTitleSelected: {
    color: "#7D3400",
  },
  optionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#554339",
    maxWidth: 250,
  },
  optionSubtitleSelected: {
    color: "#7A5B47",
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#C9B4A6",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#9A4600",
    backgroundColor: "#9A4600",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  footerRow: {
    gap: 12,
  },
  stepText: {
    color: "#7A675C",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  button: {
    backgroundColor: "#9A4600",
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});