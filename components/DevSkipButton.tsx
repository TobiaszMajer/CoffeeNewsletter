import React, { useState } from "react";
import { Pressable, Text, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { ensureProfile } from "../lib/auth";

export default function DevSkipButton() {
  const [loading, setLoading] = useState(false);

  if (!__DEV__) return null;

  return (
    <Pressable
      onPress={async () => {
        try {
          setLoading(true);
          await ensureProfile();
          router.replace("/(tabs)/home");
        } catch (error) {
          console.error(error);
          Alert.alert("Could not start guest session");
        } finally {
          setLoading(false);
        }
      }}
      style={styles.button}
    >
      <Text style={styles.text}>{loading ? "..." : "Skip"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F1ECE5",
  },
  text: {
    color: "#9A4600",
    fontSize: 14,
    fontWeight: "700",
  },
});