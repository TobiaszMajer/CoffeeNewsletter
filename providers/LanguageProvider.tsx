import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dictionaries } from "../locales";
import type { AppLanguage } from "../locales/types";

type TranslateParams = Record<string, string | number>;

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: (key: string, params?: TranslateParams) => string;
};

const STORAGE_KEY = "@oat-ember/language";
const DEFAULT_LANGUAGE: AppLanguage = "pl";

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getNestedValue(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === "object" && segment in acc) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, source);
}

function interpolate(template: string, params?: TranslateParams) {
  if (!params) return template;

  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = params[key];
    return value !== undefined ? String(value) : `{{${key}}}`;
  });
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    let active = true;

    async function loadLanguage() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!active) return;

        if (stored === "pl" || stored === "en") {
          setLanguageState(stored);
        }
      } catch (error) {
        console.error("Failed to load language", error);
      }
    }

    void loadLanguage();

    return () => {
      active = false;
    };
  }, []);

  async function setLanguage(nextLanguage: AppLanguage) {
    setLanguageState(nextLanguage);
    await AsyncStorage.setItem(STORAGE_KEY, nextLanguage);
  }

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      setLanguage,
      t: (key, params) => {
        const raw = getNestedValue(dictionaries[language], key);

        if (typeof raw !== "string") {
          return key;
        }

        return interpolate(raw, params);
      },
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguageContext must be used within LanguageProvider");
  }

  return context;
}