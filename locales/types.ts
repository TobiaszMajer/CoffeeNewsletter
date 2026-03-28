export type AppLanguage = "pl" | "en";

export type TranslationValue = string | TranslationMap;
export interface TranslationMap extends Record<string, TranslationValue> {}