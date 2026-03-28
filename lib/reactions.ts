import { supabase } from "./supabase";
import { ensureProfile } from "./auth";

export type BeanReaction = "loved_it" | "liked_it" | "not_for_me";

type ReactionRow = {
  id: string;
  reaction: BeanReaction;
  reaction_tags: string[] | null;
  note: string | null;
  created_at: string;
  beans:
    | {
        slug: string;
        name: string;
        flavor_notes: string[] | null;
      }
    | {
        slug: string;
        name: string;
        flavor_notes: string[] | null;
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

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export async function getLatestReactionForBean(beanId: string) {
  const userId = await ensureProfile();

  const { data, error } = await supabase
    .from("reactions")
    .select("id, reaction, cafe_id, created_at")
    .eq("user_id", userId)
    .eq("bean_id", beanId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function setReactionForBean(
  beanId: string,
  reaction: BeanReaction,
  cafeId: string | null = null
) {
  const userId = await ensureProfile();

  const { error: deleteError } = await supabase
    .from("reactions")
    .delete()
    .eq("user_id", userId)
    .eq("bean_id", beanId);

  if (deleteError) throw deleteError;

  const { error: insertError } = await supabase.from("reactions").insert({
    user_id: userId,
    bean_id: beanId,
    cafe_id: cafeId,
    reaction,
  });

  if (insertError) throw insertError;
}

export async function getActivityFeed() {
  const userId = await ensureProfile();

  const { data, error } = await supabase
    .from("reactions")
    .select(
      `
      id,
      reaction,
      reaction_tags,
      note,
      created_at,
      beans (
        slug,
        name,
        flavor_notes
      ),
      cafes (
        slug,
        name
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as ReactionRow[];

  return rows
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
        note: row.note,
        tags:
          row.reaction_tags && row.reaction_tags.length > 0
            ? row.reaction_tags.slice(0, 2)
            : (bean.flavor_notes ?? []).slice(0, 2),
        createdAt: row.created_at,
      };
    })
    .filter(Boolean) as {
    id: string;
    beanSlug: string;
    beanName: string;
    venueName: string | null;
    reaction: BeanReaction;
    note: string | null;
    tags: string[];
    createdAt: string;
  }[];
}