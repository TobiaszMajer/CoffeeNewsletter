import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

type RoastOption = "Light" | "Medium" | "Darker";

const ROASTS: {
  key: RoastOption;
  title: string;
  subtitle: string;
  tone: string;
  accent: string;
}[] = [
  {
    key: "Light",
    title: "Light",
    subtitle:
      "Floral, bright, and tea-like. Preserves the bean’s origin character.",
    tone: "#D9B382",
    accent: "#B9854F",
  },
  {
    key: "Medium",
    title: "Medium",
    subtitle:
      "Balanced, sweet, and nutty. Versatile and easy to love across brew styles.",
    tone: "#8B5A3C",
    accent: "#6E4024",
  },
  {
    key: "Darker",
    title: "Darker",
    subtitle:
      "Bold, chocolatey, and full-bodied. Lower acidity with more roast presence.",
    tone: "#3F2B23",
    accent: "#241712",
  },
];

export default function RoastScreen() {
  const [selected, setSelected] = useState<RoastOption>("Light");

  const canContinue = useMemo(() => !!selected, [selected]);

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
          <View style={styles.activeBar} />
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
        <Text style={styles.title}>How do you like your roast?</Text>

        <Text style={styles.subtitle}>
          Roast shapes body, sweetness, and acidity. Pick the profile that feels
          most like you.
        </Text>

        <View style={styles.scaleWrap}>
          <View style={styles.scaleTrack} />
          <View
            style={[
              styles.scaleDot,
              { left: 0, backgroundColor: "#D9B382", borderColor: "#FCF9F4" },
            ]}
          />
          <View
            style={[
              styles.scaleDot,
              {
                left: "50%",
                marginLeft: -6,
                backgroundColor: "#8B5A3C",
                borderColor: "#FCF9F4",
              },
            ]}
          />
          <View
            style={[
              styles.scaleDot,
              {
                right: 0,
                backgroundColor: "#3F2B23",
                borderColor: "#FCF9F4",
              },
            ]}
          />
        </View>

        <View style={styles.cardsWrap}>
          {ROASTS.map((roast) => {
            const isSelected = selected === roast.key;

            return (
              <Pressable
                key={roast.key}
                onPress={() => setSelected(roast.key)}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                ]}
              >
                <View
                  style={[
                    styles.thumb,
                    { backgroundColor: roast.tone },
                  ]}
                >
                  <View
                    style={[
                      styles.thumbInner,
                      { backgroundColor: roast.accent },
                    ]}
                  />
                </View>

                <View style={styles.cardTextWrap}>
                  <Text
                    style={[
                      styles.cardTitle,
                      isSelected && styles.cardTitleSelected,
                    ]}
                  >
                    {roast.title}
                  </Text>

                  <Text
                    style={[
                      styles.cardSubtitle,
                      isSelected && styles.cardSubtitleSelected,
                    ]}
                  >
                    {roast.subtitle}
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

        <Text style={styles.note}>
          Selected beans will lean toward your roast preference.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push("/drink-style")}
          disabled={!canContinue}
          style={[
            styles.button,
            !canContinue && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>Next</Text>
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
    marginBottom: 28,
    maxWidth: 340,
  },
  scaleWrap: {
    position: "relative",
    height: 24,
    justifyContent: "center",
    marginBottom: 28,
    paddingHorizontal: 6,
  },
  scaleTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E8DED3",
  },
  scaleDot: {
    position: "absolute",
    top: 6,
    width: 12,
    height: 12,
    borderRadius: 999,
    borderWidth: 2,
  },
  cardsWrap: {
    gap: 14,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1ECE5",
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  cardSelected: {
    backgroundColor: "#EAD7C8",
  },
  thumb: {
    width: 68,
    height: 68,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbInner: {
    width: 34,
    height: 34,
    borderRadius: 999,
    opacity: 0.85,
  },
  cardTextWrap: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: "600",
    color: "#1C1C19",
  },
  cardTitleSelected: {
    color: "#5E2700",
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#554339",
  },
  cardSubtitleSelected: {
    color: "#6B4430",
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
  note: {
    marginTop: 20,
    textAlign: "center",
    color: "#7A675C",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
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