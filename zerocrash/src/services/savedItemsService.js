import { supabase } from '../lib/supabase';

export const savedItemsService = {
  // Get user's saved items
  getSavedItems: async (userId, filters = {}) => {
    try {
      let query = supabase?.from('saved_items')?.select(`
          *,
          content_items!inner (
            id,
            title,
            description,
            url,
            source,
            item_type,
            difficulty,
            popularity_score,
            created_at,
            categories (
              id,
              name,
              icon,
              color
            )
          )
        `)?.eq('user_id', userId);

      // Apply filters
      if (filters?.folder && filters?.folder !== 'all') {
        query = query?.eq('folder_name', filters?.folder);
      }

      if (filters?.source && filters?.source !== 'all') {
        query = query?.eq('content_items.source', filters?.source);
      }

      if (filters?.type && filters?.type !== 'all') {
        query = query?.eq('content_items.item_type', filters?.type);
      }

      if (filters?.favorites) {
        query = query?.eq('is_favorite', true);
      }

      if (filters?.tags && filters?.tags?.length > 0) {
        query = query?.contains('tags', filters?.tags);
      }

      if (filters?.search) {
        query = query?.or(`content_items.title.ilike.%${filters?.search}%,content_items.description.ilike.%${filters?.search}%,notes.ilike.%${filters?.search}%`);
      }

      // Apply sorting
      const sortBy = filters?.sortBy || 'saved_at';
      const sortOrder = filters?.sortOrder || 'desc';
      query = query?.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      if (filters?.offset) {
        query = query?.range(filters?.offset, filters?.offset + (filters?.limit || 50) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Save a content item
  saveItem: async (userId, contentItemId, options = {}) => {
    try {
      const saveData = {
        user_id: userId,
        content_item_id: contentItemId,
        folder_name: options?.folder || 'Default',
        notes: options?.notes || '',
        tags: options?.tags || [],
        is_favorite: options?.isFavorite || false
      };

      const { data, error } = await supabase?.from('saved_items')?.insert(saveData)?.select(`
          *,
          content_items (
            id,
            title,
            description,
            url,
            source,
            item_type
          )
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update saved item
  updateSavedItem: async (savedItemId, userId, updates) => {
    try {
      const { data, error } = await supabase?.from('saved_items')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', savedItemId)?.eq('user_id', userId)?.select(`
          *,
          content_items (
            id,
            title,
            description,
            url,
            source,
            item_type
          )
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete saved item
  deleteSavedItem: async (savedItemId, userId) => {
    try {
      const { data, error } = await supabase?.from('saved_items')?.delete()?.eq('id', savedItemId)?.eq('user_id', userId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user's folders
  getFolders: async (userId) => {
    try {
      const { data, error } = await supabase?.from('saved_items')?.select('folder_name')?.eq('user_id', userId);

      if (error) throw error;

      // Get unique folder names
      const folders = [...new Set(data?.map(item => item?.folder_name))];
      
      // Get item counts for each folder
      const foldersWithCounts = await Promise?.all(
        folders?.map(async (folder) => {
          const { count } = await supabase?.from('saved_items')?.select('*', { count: 'exact' })?.eq('user_id', userId)?.eq('folder_name', folder);

          return {
            name: folder,
            count: count || 0
          };
        })
      );

      return { data: foldersWithCounts || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Get saved items statistics
  getSavedItemsStats: async (userId) => {
    try {
      const { data: allItems, error: itemsError } = await supabase?.from('saved_items')?.select(`
          *,
          content_items!inner (source, item_type)
        `)?.eq('user_id', userId);

      if (itemsError) throw itemsError;

      const stats = {
        total: allItems?.length || 0,
        favorites: allItems?.filter(item => item?.is_favorite)?.length || 0,
        bySource: {},
        byType: {},
        byFolder: {},
        recentlyAdded: allItems?.filter(item => {
          const savedDate = new Date(item?.saved_at);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return savedDate > weekAgo;
        })?.length || 0
      };

      // Count by source
      allItems?.forEach(item => {
        const source = item?.content_items?.source || 'unknown';
        stats.bySource[source] = (stats?.bySource?.[source] || 0) + 1;
      });

      // Count by type
      allItems?.forEach(item => {
        const type = item?.content_items?.item_type || 'unknown';
        stats.byType[type] = (stats?.byType?.[type] || 0) + 1;
      });

      // Count by folder
      allItems?.forEach(item => {
        const folder = item?.folder_name || 'Default';
        stats.byFolder[folder] = (stats?.byFolder?.[folder] || 0) + 1;
      });

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Check if content item is already saved
  isItemSaved: async (userId, contentItemId) => {
    try {
      const { data, error } = await supabase?.from('saved_items')?.select('id')?.eq('user_id', userId)?.eq('content_item_id', contentItemId)?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      
      return { data: !!data, error: null };
    } catch (error) {
      return { data: false, error };
    }
  },

  // Bulk operations
  bulkUpdateSavedItems: async (savedItemIds, userId, updates) => {
    try {
      const { data, error } = await supabase?.from('saved_items')?.update(updates)?.in('id', savedItemIds)?.eq('user_id', userId)?.select();

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  bulkDeleteSavedItems: async (savedItemIds, userId) => {
    try {
      const { data, error } = await supabase?.from('saved_items')?.delete()?.in('id', savedItemIds)?.eq('user_id', userId)?.select();

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }
};