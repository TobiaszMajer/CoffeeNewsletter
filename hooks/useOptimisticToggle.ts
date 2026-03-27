// hooks/useOptimisticToggle.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase'; // Your supabase client
import { useAuth } from '../contexts/AuthContext'; // Assuming a guest auth context

type ToggleConfig = {
  table: 'saves' | 'follows';
  column: 'bean_id' | 'cafe_id';
  itemId: string;
};

export const useOptimisticToggle = ({ table, column, itemId }: ToggleConfig) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const queryKey = [table, user?.id, itemId];

  // 1. Read: Check initial state
  const { data: isToggled, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .match({ user_id: user?.id, [column]: itemId })
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id,
  });

  // 2. Sync & Revert: The Mutation Loop
  const mutation = useMutation({
    mutationFn: async (currentlyToggled: boolean) => {
      if (currentlyToggled) {
        // Unsave/Unfollow
        const { error } = await supabase
          .from(table)
          .delete()
          .match({ user_id: user?.id, [column]: itemId });
        if (error) throw error;
      } else {
        // Save/Follow
        const { error } = await supabase
          .from(table)
          .insert({ user_id: user?.id, [column]: itemId });
        if (error) throw error;
      }
    },
    onMutate: async () => {
      // Cancel refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousValue = queryClient.getQueryData(queryKey);

      // 3. State: Update local cache instantly
      queryClient.setQueryData(queryKey, (old: boolean) => !old);

      return { previousValue };
    },
    onError: (err, newState, context) => {
      // 4. Revert: Roll back on failure
      queryClient.setQueryData(queryKey, context?.previousValue);
    },
    onSettled: () => {
      // Sync with server truth
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    isActive: !!isToggled,
    toggle: () => mutation.mutate(!!isToggled),
    isSyncing: mutation.isPending,
    isLoading
  };
};
