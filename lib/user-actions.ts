import { supabase } from './supabase';

export type SaveEntityType = 'bean' | 'cafe' | 'roaster';
export type FollowEntityType = 'cafe' | 'roaster';
export type FavoriteEntityType = 'bean' | 'cafe' | 'roaster';
import {
  getLatestReactionForBean,
  setReactionForBean,
  type BeanReaction,
} from "../lib/reactions";

export async function isEntityFavorited(
  entityType: FavoriteEntityType,
  entitySlug: string
): Promise<boolean> {
  return isEntitySaved(entityType, entitySlug);
}

export async function favoriteEntity(
  entityType: FavoriteEntityType,
  entitySlug: string
): Promise<void> {
  return saveEntity(entityType, entitySlug);
}

export async function unfavoriteEntity(
  entityType: FavoriteEntityType,
  entitySlug: string
): Promise<void> {
  return unsaveEntity(entityType, entitySlug);
}

export async function toggleFavoriteEntity(
  entityType: FavoriteEntityType,
  entitySlug: string
): Promise<boolean> {
  return toggleSaveEntity(entityType, entitySlug);
}

async function getRequiredUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error('No authenticated user found.');

  return user.id;
}

export async function isEntitySaved(
  entityType: SaveEntityType,
  entitySlug: string
): Promise<boolean> {
  const userId = await getRequiredUserId();

  const { data, error } = await supabase
    .from('saves')
    .select('id')
    .eq('user_id', userId)
    .eq('entity_type', entityType)
    .eq('entity_slug', entitySlug)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function saveEntity(
  entityType: SaveEntityType,
  entitySlug: string
): Promise<void> {
  const userId = await getRequiredUserId();

  const { error } = await supabase.from('saves').insert({
    user_id: userId,
    entity_type: entityType,
    entity_slug: entitySlug,
  });

  if (error) throw error;
}

export async function unsaveEntity(
  entityType: SaveEntityType,
  entitySlug: string
): Promise<void> {
  const userId = await getRequiredUserId();

  const { error } = await supabase
    .from('saves')
    .delete()
    .eq('user_id', userId)
    .eq('entity_type', entityType)
    .eq('entity_slug', entitySlug);

  if (error) throw error;
}

export async function toggleSaveEntity(
  entityType: SaveEntityType,
  entitySlug: string
): Promise<boolean> {
  const saved = await isEntitySaved(entityType, entitySlug);

  if (saved) {
    await unsaveEntity(entityType, entitySlug);
    return false;
  }

  await saveEntity(entityType, entitySlug);
  return true;
}

export async function isEntityFollowed(
  entityType: FollowEntityType,
  entitySlug: string
): Promise<boolean> {
  const userId = await getRequiredUserId();

  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('user_id', userId)
    .eq('entity_type', entityType)
    .eq('entity_slug', entitySlug)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function followEntity(
  entityType: FollowEntityType,
  entitySlug: string
): Promise<void> {
  const userId = await getRequiredUserId();

  const { error } = await supabase.from('follows').insert({
    user_id: userId,
    entity_type: entityType,
    entity_slug: entitySlug,
  });

  if (error) throw error;
}

export async function unfollowEntity(
  entityType: FollowEntityType,
  entitySlug: string
): Promise<void> {
  const userId = await getRequiredUserId();

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('user_id', userId)
    .eq('entity_type', entityType)
    .eq('entity_slug', entitySlug);

  if (error) throw error;
}

export async function toggleFollowEntity(
  entityType: FollowEntityType,
  entitySlug: string
): Promise<boolean> {
  const followed = await isEntityFollowed(entityType, entitySlug);

  if (followed) {
    await unfollowEntity(entityType, entitySlug);
    return false;
  }

  await followEntity(entityType, entitySlug);
  return true;
}