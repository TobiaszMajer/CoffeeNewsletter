import type { AppLanguage } from "./types";
import { pl } from "./pl";
import { en } from "./en";

export const dictionaries: Record<AppLanguage, Record<string, unknown>> = {
  pl,
  en,
};