
import React from "react";
import { Stack } from "expo-router";
import { LanguageProvider } from "../providers/LanguageProvider";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LanguageProvider>
  );
}