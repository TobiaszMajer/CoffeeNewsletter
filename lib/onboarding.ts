import AsyncStorage from "@react-native-async-storage/async-storage";
import { ensureProfile } from "./auth";
import { supabase } from "./supabase";

export type OnboardingDraft = {
  flavor_preferences: string[];
  roast_preference: string | null;
  drink_style: string | null;
  discovery_style: string | null;
};

const STORAGE_KEY = "@oat-ember/onboarding-draft";

const DEFAULT_ONBOARDING_DRAFT: OnboardingDraft = {
  flavor_preferences: ["Caramel"],
  roast_preference: "Light",
  drink_style: "Milk Drinks",
  discovery_style: "Balanced",
};

function normalizeDraft(value: Partial<OnboardingDraft> | null | undefined): OnboardingDraft {
  return {
    flavor_preferences: Array.from(
      new Set(value?.flavor_preferences ?? DEFAULT_ONBOARDING_DRAFT.flavor_preferences)
    ),
    roast_preference:
      value?.roast_preference ?? DEFAULT_ONBOARDING_DRAFT.roast_preference,
    drink_style: value?.drink_style ?? DEFAULT_ONBOARDING_DRAFT.drink_style,
    discovery_style:
      value?.discovery_style ?? DEFAULT_ONBOARDING_DRAFT.discovery_style,
  };
}

export async function getOnboardingDraft(): Promise<OnboardingDraft> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return DEFAULT_ONBOARDING_DRAFT;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingDraft>;
    return normalizeDraft(parsed);
  } catch {
    return DEFAULT_ONBOARDING_DRAFT;
  }
}

export async function updateOnboardingDraft(
  patch: Partial<OnboardingDraft>
): Promise<OnboardingDraft> {
  const current = await getOnboardingDraft();
  const next = normalizeDraft({
    ...current,
    ...patch,
  });

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function clearOnboardingDraft(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function persistOnboardingProfile(): Promise<OnboardingDraft> {
  const userId = await ensureProfile();
  const draft = await getOnboardingDraft();

  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      flavor_preferences: draft.flavor_preferences,
      roast_preference: draft.roast_preference,
      drink_style: draft.drink_style,
      discovery_style: draft.discovery_style,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    }
  );

  if (error) throw error;

  return draft;
}