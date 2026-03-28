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
const FLAVORS = [
  "Chocolatey",
  "Nutty",
  "Caramel",
  "Floral",
  "Citrus",
  "Berry",
  "Funky",
];

export default function FlavorsScreen() {
  const [selected, setSelected] = useState<string[]>(["Caramel"]);

  const canContinue = useMemo(() => selected.length > 0, [selected]);
  const [isSaving, setIsSaving] = useState(false);
  const toggleFlavor = (flavor: string) => {
    setSelected((prev) =>
      prev.includes(flavor)
        ? prev.filter((item) => item !== flavor)
        : [...prev, flavor]
    );
  };
useEffect(() => {
  let active = true;

  async function loadDraft() {
    try {
      const draft = await getOnboardingDraft();
      if (!active) return;
      setSelected(
        draft.flavor_preferences.length > 0
          ? draft.flavor_preferences
          : ["Caramel"]
      );
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
          <View style={styles.activeBar} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>Taste Profile</Text>

        <Text style={styles.title}>What flavor notes do you lean toward?</Text>

        <Text style={styles.subtitle}>
          Select all that apply. We’ll use these to shape your discovery feed.
        </Text>

        <View style={styles.chipWrap}>
          {FLAVORS.map((flavor) => {
            const isSelected = selected.includes(flavor);

            return (
              <Pressable
                key={flavor}
                onPress={() => toggleFlavor(flavor)}
                style={[
                  styles.chip,
                  isSelected && styles.chipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {flavor}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={styles.button}
          disabled={!canContinue || isSaving}
          
          onPress={async () => {
            try {
              setIsSaving(true);
              await updateOnboardingDraft({
                flavor_preferences: selected,
              });
              router.push("/roast");
            } catch (error) {
              console.error(error);
              Alert.alert("Could not save your flavor preferences");
            } finally {
              setIsSaving(false);
            }
          }}
        >
          <Text style={[
              styles.buttonText,
              (!canContinue || isSaving) && styles.buttonDisabled]}>Next</Text>
        </Pressable>
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
    paddingTop: 36,
    paddingBottom: 24,
  },
  eyebrow: {
    color: "#7A675C",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 14,
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
    marginBottom: 28,
    maxWidth: 340,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  chip: {
    backgroundColor: "#F1ECE5",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
  },
  chipSelected: {
    backgroundColor: "#9A4600",
  },
  chipText: {
    color: "#1C1C19",
    fontSize: 15,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
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