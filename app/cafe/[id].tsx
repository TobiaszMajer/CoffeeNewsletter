import React from "react";
import { mockCafes } from "../../lib/mock-data";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";



export default function CafeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cafe = mockCafes[id ?? "rosslyn-coffee"] ?? mockCafes["rosslyn-coffee"];

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
              <Text style={styles.area}>{cafe.area}</Text>
              <Text style={styles.title}>{cafe.name}</Text>
            </View>

            <View style={styles.saveWrap}>
              <Pressable style={styles.iconButton}>
                <Text style={styles.iconButtonText}>⌑</Text>
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Text style={styles.iconButtonText}>＋</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.description}>{cafe.description}</Text>

          <View style={styles.tagsWrap}>
            {cafe.vibeTags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.updated}>{cafe.updated}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>On the Bar</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>

        <View style={styles.beansWrap}>
          {cafe.beans.map((bean) => (
            <Pressable
              key={bean.id}
              style={styles.beanCard}
              onPress={() => router.push(`/bean/${bean.id}`)}
            >
              <View style={styles.beanTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.beanName}>{bean.name}</Text>
                  <Pressable onPress={() => router.push(`/roaster/${slugify(bean.roaster)}`)}>
                    <Text style={styles.beanRoaster}>by {bean.roaster}</Text>
                  </Pressable>
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
            <Text style={styles.detailValue}>{cafe.hours}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{cafe.address}</Text>
          </View>

          {cafe.brunchNote ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Food</Text>
              <Text style={styles.detailValue}>{cafe.brunchNote}</Text>
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

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
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
    borderRadius: 999,
    backgroundColor: "#FCF9F4",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonText: {
    color: "#9A4600",
    fontSize: 18,
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
  sectionLink: {
    color: "#9A4600",
    fontSize: 14,
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