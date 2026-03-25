import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.brand}>Oat & Ember</Text>

      <Text style={styles.title}>Good evening.</Text>
      <Text style={styles.subtitle}>
        Ready to discover beans that fit your taste?
      </Text>

      <View style={styles.searchBox}>
        <Text style={styles.searchText}>Search beans, roasters, or cafés...</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Best matches near you</Text>
        <Text style={styles.sectionLink}>See all</Text>
      </View>

      <Pressable style={styles.heroCard}>
        <View style={styles.heroImage} />
        <Text style={styles.cardTitle}>Guji Natural</Text>
        <Text style={styles.cardMeta}>Dark Arts Coffee</Text>
        <Text style={styles.cardNotes}>Blueberry • Violet • Filter</Text>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fresh drops today</Text>
      </View>

      <View style={styles.smallCard}>
        <Text style={styles.smallCardTitle}>New from Square Mile</Text>
        <Text style={styles.smallCardText}>
          A fresh berry-forward release is now available nearby.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FCF9F4",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
  },
  brand: {
    fontSize: 22,
    fontStyle: "italic",
    color: "#9A4600",
    fontWeight: "600",
    marginBottom: 28,
  },
  title: {
    fontSize: 40,
    lineHeight: 44,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 25,
    color: "#554339",
    marginBottom: 24,
    maxWidth: 320,
  },
  searchBox: {
    backgroundColor: "#F1ECE5",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 28,
  },
  searchText: {
    color: "#7A675C",
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontWeight: "600",
  },
  heroCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 28,
    padding: 16,
    marginBottom: 30,
  },
  heroImage: {
    height: 240,
    borderRadius: 22,
    backgroundColor: "#2C211C",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 28,
    lineHeight: 32,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 6,
  },
  cardMeta: {
    fontSize: 16,
    color: "#554339",
    marginBottom: 8,
  },
  cardNotes: {
    fontSize: 14,
    color: "#7A675C",
  },
  smallCard: {
    backgroundColor: "#F1ECE5",
    borderRadius: 24,
    padding: 18,
  },
  smallCardTitle: {
    fontSize: 20,
    color: "#1C1C19",
    fontWeight: "700",
    marginBottom: 8,
  },
  smallCardText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#554339",
  },
});