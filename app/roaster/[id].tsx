import React from "react";
import { mockRoasters } from "../../lib/mock-data";
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



export default function RoasterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const roaster =
    mockRoasters[id ?? "dark-arts-coffee"] ?? mockRoasters["dark-arts-coffee"];

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
          <Text style={styles.title}>{roaster.name}</Text>
          <Text style={styles.description}>{roaster.description}</Text>

          <View style={styles.flavorBox}>
            <Text style={styles.flavorLabel}>Flavor direction</Text>
            <Text style={styles.flavorText}>{roaster.flavorDirection}</Text>
          </View>

          <Pressable style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow Roaster</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Beans</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>

        <View style={styles.beansWrap}>
          {roaster.featuredBeans.map((bean) => (
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
          {roaster.nearbyCafes.map((cafe) => (
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
  description: {
    color: "#554339",
    fontSize: 16,
    lineHeight: 24,
  },
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
  flavorText: {
    color: "#7D3400",
    fontSize: 15,
    fontWeight: "600",
  },
  followButton: {
    backgroundColor: "#9A4600",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  followButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
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
  beanBody: {
    flex: 1,
    gap: 10,
  },
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
  notesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  noteChip: {
    backgroundColor: "#FCF9F4",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  noteChipText: {
    color: "#554339",
    fontSize: 12,
    fontWeight: "600",
  },
  availabilityWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  availabilityChip: {
    backgroundColor: "#EFE7DE",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  availabilityChipText: {
    color: "#7D3400",
    fontSize: 12,
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
    backgroundColor: "#C4AF9E",
  },
  cafeBody: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
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
});