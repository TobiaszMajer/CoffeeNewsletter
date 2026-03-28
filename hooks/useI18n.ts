import { useLanguageContext } from "../providers/LanguageProvider";

export function useI18n() {
  return useLanguageContext();
}