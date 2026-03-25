import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import DevSkipButton from "../components/DevSkipButton";

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
      }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Text style={styles.brand}>Oat & Ember</Text>
          <DevSkipButton />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            A living guide{"\n"}to the bean.
          </Text>

          <Text style={styles.subtitle}>
            Discover exceptional specialty coffee matched to your taste and
            find where to drink or buy it nearby.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => router.push("/flavors")}
          >
            <Text style={styles.buttonText}>Begin your journey</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#fcf9f4",
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(252, 249, 244, 0.45)",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  topBar: {
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    fontSize: 24,
    fontStyle: "italic",
    color: "#9A4600",
    fontWeight: "600",
  },
  content: {
    gap: 18,
  },
  title: {
    fontSize: 42,
    lineHeight: 46,
    color: "#1c1c19",
    fontWeight: "600",
    maxWidth: 320,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 26,
    color: "#554339",
    maxWidth: 340,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#9A4600",
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
    shadowColor: "#9A4600",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
});