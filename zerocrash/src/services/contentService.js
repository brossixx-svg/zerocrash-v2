import { supabase } from '../lib/supabase';

export const contentService = {
  // Get trending topics
  getTrendingTopics: async (limit = 6) => {
    try {
      const { data, error } = await supabase?.from('trending_topics')?.select(`
          *,
          category:categories(id, name, icon, color)
        `)?.eq('is_active', true)?.order('popularity_score', { ascending: false })?.limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get trending content
  getTrendingContent: async (limit = 4) => {
    try {
      const { data, error } = await supabase?.from('content_items')?.select(`
          *,
          category:categories(id, name, icon, color)
        `)?.order('popularity_score', { ascending: false })?.limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get content items with pagination
  getContentItems: async (page = 1, pageSize = 20, filters = {}) => {
    try {
      let query = supabase?.from('content_items')?.select(`
          *,
          category:categories(id, name, icon, color)
        `, { count: 'exact' });

      if (filters?.category_id) {
        query = query?.eq('category_id', filters?.category_id);
      }

      if (filters?.item_type) {
        query = query?.eq('item_type', filters?.item_type);
      }

      if (filters?.source) {
        query = query?.eq('source', filters?.source);
      }

      if (filters?.difficulty) {
        query = query?.eq('difficulty', filters?.difficulty);
      }

      if (filters?.search_query) {
        query = query?.or(`title.ilike.%${filters?.search_query}%,description.ilike.%${filters?.search_query}%`);
      }

      const { data, error, count } = await query?.order('created_at', { ascending: false })?.range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;
      return { data, count, error: null };
    } catch (error) {
      return { data: null, count: 0, error };
    }
  },

  // Create content item
  createContentItem: async (contentData) => {
    try {
      const { data, error } = await supabase?.from('content_items')?.insert({
          title: contentData?.title,
          description: contentData?.description,
          url: contentData?.url,
          content: contentData?.content,
          item_type: contentData?.item_type || 'result',
          source: contentData?.source || 'manual',
          category_id: contentData?.category_id,
          difficulty: contentData?.difficulty || 'medium',
          popularity_score: contentData?.popularity_score || 0,
          metadata: contentData?.metadata || {},
          published_at: contentData?.published_at || new Date()?.toISOString()
        })?.select(`
          *,
          category:categories(id, name, icon, color)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update content item
  updateContentItem: async (itemId, updates) => {
    try {
      const { data, error } = await supabase?.from('content_items')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', itemId)?.select(`
          *,
          category:categories(id, name, icon, color)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete content item
  deleteContentItem: async (itemId) => {
    try {
      const { error } = await supabase?.from('content_items')?.delete()?.eq('id', itemId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Update trending topic
  updateTrendingTopic: async (topicId, updates) => {
    try {
      const { data, error } = await supabase?.from('trending_topics')?.update({
          ...updates,
          last_updated: new Date()?.toISOString()
        })?.eq('id', topicId)?.select(`
          *,
          category:categories(id, name, icon, color)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};