import { supabase } from "./supabase";
import { ensureProfile } from "./auth";

export async function saveEntity(
  entityType: "bean" | "cafe" | "roaster",
  entitySlug: string
) {
  const userId = await ensureProfile();

  const { error } = await supabase.from("saves").upsert(
    {
      user_id: userId,
      entity_type: entityType,
      entity_slug: entitySlug,
    },
    {
      onConflict: "user_id,entity_type,entity_slug",
    }
  );

  if (error) throw error;
}

export async function unsaveEntity(
  entityType: "bean" | "cafe" | "roaster",
  entitySlug: string
) {
  const userId = await ensureProfile();

  const { error } = await supabase
    .from("saves")
    .delete()
    .eq("user_id", userId)
    .eq("entity_type", entityType)
    .eq("entity_slug", entitySlug);

  if (error) throw error;
}

export async function followEntity(
  entityType: "cafe" | "roaster",
  entitySlug: string
) {
  const userId = await ensureProfile();

  const { error } = await supabase.from("follows").upsert(
    {
      user_id: userId,
      entity_type: entityType,
      entity_slug: entitySlug,
    },
    {
      onConflict: "user_id,entity_type,entity_slug",
    }
  );

  if (error) throw error;
}

export async function unfollowEntity(
  entityType: "cafe" | "roaster",
  entitySlug: string
) {
  const userId = await ensureProfile();

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("user_id", userId)
    .eq("entity_type", entityType)
    .eq("entity_slug", entitySlug);

  if (error) throw error;
}