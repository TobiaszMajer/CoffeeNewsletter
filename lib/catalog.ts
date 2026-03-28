import { supabase } from "./supabase";
import { ensureProfile } from "./auth";
 
type ProfileReactionRow = {
  id: string;
  reaction: "loved_it" | "liked_it" | "not_for_me";
  created_at: string;
  beans:
    | {
        slug: string;
        name: string;
      }
    | {
        slug: string;
        name: string;
      }[]
    | null;
  cafes:
    | {
        slug: string;
        name: string;
      }
    | {
        slug: string;
        name: string;
      }[]
    | null;
};

export async function getProfileSummary() {
  const userId = await ensureProfile();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "flavor_preferences, roast_preference, drink_style, discovery_style"
    )
    .eq("id", userId)
    .maybeSingle();

  if (profileError) throw profileError;

  const { data: saves, error: savesError } = await supabase
    .from("saves")
    .select("entity_type, entity_slug")
    .eq("user_id", userId);

  if (savesError) throw savesError;

  const { data: reactions, error: reactionsError } = await supabase
    .from("reactions")
    .select(
      `
      id,
      reaction,
      created_at,
      beans (
        slug,
        name
      ),
      cafes (
        slug,
        name
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (reactionsError) throw reactionsError;

  const favoriteBeansCount =
    saves?.filter((row) => row.entity_type === "bean").length ?? 0;
  const favoriteCafesCount =
    saves?.filter((row) => row.entity_type === "cafe").length ?? 0;
  const favoriteRoastersCount =
    saves?.filter((row) => row.entity_type === "roaster").length ?? 0;

  const flavorPreferences = profile?.flavor_preferences ?? [];
  const roastPreference = profile?.roast_preference ?? null;
  const drinkStyle = profile?.drink_style ?? null;
  const discoveryStyle = profile?.discovery_style ?? null;

  const identityTags = [
    ...flavorPreferences.slice(0, 3),
    roastPreference,
    drinkStyle,
    discoveryStyle,
  ].filter(Boolean) as string[];

  const recentReactions = ((reactions ?? []) as ProfileReactionRow[])
    .map((row) => {
      const bean = firstRelation(row.beans);
      const cafe = firstRelation(row.cafes);

      if (!bean?.slug) return null;

      return {
        id: row.id,
        beanSlug: bean.slug,
        beanName: bean.name,
        venueName: cafe?.name ?? null,
        reaction: row.reaction,
        createdAt: row.created_at,
      };
    })
    .filter(Boolean)
    .slice(0, 4) as {
    id: string;
    beanSlug: string;
    beanName: string;
    venueName: string | null;
    reaction: "loved_it" | "liked_it" | "not_for_me";
    createdAt: string;
  }[];

  return {
    identityTitle:
      identityTags.length > 0 ? "Your taste profile" : "Guest profile",
    identityText:
      identityTags.length > 0
        ? "Your onboarding choices are now shaping discovery, and your tastings will keep refining this profile over time."
        : "You are using a guest profile. Favorites and tastings will gradually shape this account.",
    identityTags,
    counts: {
      favoriteBeans: favoriteBeansCount,
      favoriteCafes: favoriteCafesCount,
      favoriteRoasters: favoriteRoastersCount,
      tastings: reactions?.length ?? 0,
    },
    recentReactions,
  };
}

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export async function getSavedCatalog() {
  const userId = await ensureProfile();

  const { data: saves, error: savesError } = await supabase
    .from("saves")
    .select("entity_type, entity_slug, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (savesError) throw savesError;

  const beanSlugs = saves
    ?.filter((row) => row.entity_type === "bean")
    .map((row) => row.entity_slug) ?? [];

  const cafeSlugs = saves
    ?.filter((row) => row.entity_type === "cafe")
    .map((row) => row.entity_slug) ?? [];

  const roasterSlugs = saves
    ?.filter((row) => row.entity_type === "roaster")
    .map((row) => row.entity_slug) ?? [];

  const beans = await Promise.all(
    beanSlugs.map(async (slug) => {
      const bean = await getBeanBySlug(slug);
      if (!bean) return null;

      const roaster = firstRelation(bean.roasters);
      const availability = await getAvailabilityByBeanId(bean.id);
      const firstAvailability = availability[0];
      const firstCafe = firstRelation(firstAvailability?.cafes);

      return {
        id: bean.slug,
        name: bean.name,
        roaster: roaster?.name ?? "Unknown roaster",
        notes: (bean.flavor_notes ?? []).slice(0, 2),
        nearby: firstCafe?.name ?? "Nearby café",
        freshness: firstAvailability?.freshness_note ?? "Recently updated",
      };
    })
  );

  const cafes = await Promise.all(
    cafeSlugs.map(async (slug) => {
      const cafe = await getCafeBySlug(slug);
      if (!cafe) return null;

      const cafeBeans = await getCafeBeans(cafe.id);

      return {
        id: cafe.slug,
        name: cafe.name,
        area: cafe.neighborhood ?? "Area",
        tags: (cafe.tags ?? []).slice(0, 3),
        cue:
          cafeBeans.length > 0
            ? `${cafeBeans.length} bean${cafeBeans.length > 1 ? "s" : ""} on the bar`
            : "Worth revisiting",
      };
    })
  );

  const roasters = await Promise.all(
    roasterSlugs.map(async (slug) => {
      const roaster = await getRoasterBySlug(slug);
      if (!roaster) return null;

      const beans = await getBeansByRoasterId(roaster.id);

      return {
        id: roaster.slug,
        name: roaster.name,
        direction: roaster.flavor_direction ?? "Distinct flavor direction",
        update:
          beans.length > 0
            ? `${beans.length} active bean${beans.length > 1 ? "s" : ""}`
            : "Recently followed",
      };
    })
  );

  return {
    beans: beans.filter(Boolean) as {
      id: string;
      name: string;
      roaster: string;
      notes: string[];
      nearby: string;
      freshness: string;
    }[],
    cafes: cafes.filter(Boolean) as {
      id: string;
      name: string;
      area: string;
      tags: string[];
      cue: string;
    }[],
    roasters: roasters.filter(Boolean) as {
      id: string;
      name: string;
      direction: string;
      update: string;
    }[],
  };
}
export async function getCafeBySlug(slug: string) {
  const { data, error } = await supabase
    .from("cafes")
    .select(
      `
      id,
      slug,
      name,
      description,
      neighborhood,
      city,
      address,
      hours_text,
      tags,
      updated_at
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getCafeBeans(cafeId: string) {
  const { data, error } = await supabase
    .from("cafe_bean_availability")
    .select(
      `
      freshness_note,
      availability_types,
      beans (
        slug,
        name,
        flavor_notes,
        roasters (
          slug,
          name
        )
      )
    `
    )
    .eq("cafe_id", cafeId)
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getHomeBeans() {
  const { data, error } = await supabase
    .from("beans")
    .select(
      `
      id,
      slug,
      name,
      roast_style,
      flavor_notes,
      updated_at,
      roasters (
        slug,
        name
      ),
      cafe_bean_availability (
        freshness_note,
        distance_label,
        availability_types,
        cafes (
          slug,
          name
        )
      )
    `
    )
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
export async function getExploreBeans() {
  const { data, error } = await supabase
    .from("beans")
    .select(
      `
      id,
      slug,
      name,
      roast_style,
      flavor_notes,
      roasters (
        slug,
        name
      ),
      cafe_bean_availability (
        freshness_note,
        distance_label,
        availability_types,
        cafes (
          slug,
          name
        )
      )
    `
    )
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getRoasterBySlug(slug: string) {
  const { data, error } = await supabase
    .from("roasters")
    .select("id, slug, name, description, flavor_direction")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getBeansByRoasterId(roasterId: string) {
  const { data, error } = await supabase
    .from("beans")
    .select("slug, name, flavor_notes, roast_style")
    .eq("roaster_id", roasterId)
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getBeanBySlug(slug: string) {
  const { data, error } = await supabase
    .from("beans")
    .select(
      `
      id,
      slug,
      name,
      origin,
      producer_estate,
      process,
      roast_style,
      flavor_notes,
      description,
      roasters (
        slug,
        name
      )
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getAvailabilityByBeanId(beanId: string) {
  const { data, error } = await supabase
    .from("cafe_bean_availability")
    .select(
      `
      freshness_note,
      distance_label,
      availability_types,
      cafes (
        slug,
        name
      )
    `
    )
    .eq("bean_id", beanId)
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}