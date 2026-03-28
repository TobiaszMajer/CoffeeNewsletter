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


type DrinkStyle = "Espresso" | "Filter" | "Milk Drinks" | "All";

const OPTIONS: {
  key: DrinkStyle;
  title: string;
  subtitle: string;
  icon: string;
}[] = [
  {
    key: "Espresso",
    title: "Espresso",
    subtitle: "Short, concentrated, and intense.",
    icon: "●",
  },
  {
    key: "Filter",
    title: "Filter",
    subtitle: "Clean, expressive, and origin-forward.",
    icon: "◌",
  },
  {
    key: "Milk Drinks",
    title: "Milk Drinks",
    subtitle: "Flat whites, cappuccinos, and creamy comfort.",
    icon: "◐",
  },
  {
    key: "All",
    title: "All",
    subtitle: "Show me great coffee in every form.",
    icon: "◎",
  },
];

export default function DrinkStyleScreen() {
  const [selected, setSelected] = useState<DrinkStyle>("Milk Drinks");

  const canContinue = useMemo(() => !!selected, [selected]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadDraft() {
      try {
        const draft = await getOnboardingDraft();
        if (!active) return;

        if (
          draft.drink_style === "Espresso" ||
          draft.drink_style === "Filter" ||
          draft.drink_style === "Milk Drinks" ||
          draft.drink_style === "All"
        ) {
          setSelected(draft.drink_style);
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
          <View style={styles.activeBar} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Your preferred drink mode?</Text>

        <Text style={styles.subtitle}>
          This helps us prioritize beans that shine in your favorite way of
          drinking coffee.
        </Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroText}>Smooth mornings, bright filters, or both.</Text>
        </View>

        <View style={styles.grid}>
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
                <View
                  style={[
                    styles.iconWrap,
                    isSelected && styles.iconWrapSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.iconText,
                      isSelected && styles.iconTextSelected,
                    ]}
                  >
                    {option.icon}
                  </Text>
                </View>

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

                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.stepText}>Step 4 of 6</Text>

          <Pressable
            style={styles.button}
            disabled={!canContinue || isSaving}
            onPress={async () => {
            try {
              setIsSaving(true);
              await updateOnboardingDraft({
                drink_style: selected,
              });
              router.push("/discovery-style");
            } catch (error) {
              console.error(error);
              Alert.alert("Could not save your drink preference");
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
  title: {
    color: "#1C1C19",
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "600",
    marginBottom: 14,
    maxWidth: 320,
  },
  subtitle: {
    color: "#554339",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: 340,
  },
  heroCard: {
    height: 180,
    borderRadius: 28,
    backgroundColor: "#EDE4DA",
    marginBottom: 24,
    justifyContent: "flex-end",
    padding: 20,
  },
  heroText: {
    color: "#1C1C19",
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600",
    maxWidth: 220,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  optionCard: {
    width: "47.8%",
    minHeight: 162,
    backgroundColor: "#F1ECE5",
    borderRadius: 26,
    padding: 18,
    justifyContent: "flex-start",
    position: "relative",
  },
  optionCardSelected: {
    backgroundColor: "#F4E3D8",
    borderWidth: 1.5,
    borderColor: "#C88A59",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconWrapSelected: {
    backgroundColor: "#FFF7F1",
  },
  iconText: {
    color: "#9A4600",
    fontSize: 20,
    fontWeight: "700",
  },
  iconTextSelected: {
    color: "#9A4600",
  },
  optionTitle: {
    color: "#1C1C19",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  optionTitleSelected: {
    color: "#7D3400",
  },
  optionSubtitle: {
    color: "#6B5A4E",
    fontSize: 13,
    lineHeight: 18,
  },
  optionSubtitleSelected: {
    color: "#7A5B47",
  },
  checkBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: "#9A4600",
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
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