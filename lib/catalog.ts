import { supabase } from "./supabase";

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