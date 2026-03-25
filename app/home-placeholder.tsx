import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomePlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding complete</Text>
      <Text style={styles.text}>
        Next, we’ll replace this with the real Home screen.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF9F4",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C19",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#554339",
    textAlign: "center",
    maxWidth: 320,
  },
});