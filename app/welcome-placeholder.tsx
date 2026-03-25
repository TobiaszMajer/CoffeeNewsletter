import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function WelcomePlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Next screen</Text>
      <Text style={styles.text}>
        Router works. Now we can build the real onboarding flow.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcf9f4",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1c1c19",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#554339",
    textAlign: "center",
  },
});