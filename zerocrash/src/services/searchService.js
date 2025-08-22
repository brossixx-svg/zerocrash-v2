import { supabase } from '../lib/supabase';

export const searchService = {
  // Create a new search
  createSearch: async (searchData) => {
    try {
      const { data, error } = await supabase?.from('searches')?.insert({
          query: searchData?.query,
          category_id: searchData?.category_id,
          sources: searchData?.sources || [],
          user_id: searchData?.user_id,
          results_count: searchData?.results_count || 0,
          status: searchData?.status || 'pending',
          metadata: searchData?.metadata || {}
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

  // Get user's recent searches
  getRecentSearches: async (userId, limit = 10) => {
    try {
      const { data, error } = await supabase?.from('searches')?.select(`
          *,
          category:categories(id, name, icon, color)
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false })?.limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get all searches with pagination
  getSearches: async (userId, page = 1, pageSize = 20, filters = {}) => {
    try {
      let query = supabase?.from('searches')?.select(`
          *,
          category:categories(id, name, icon, color)
        `, { count: 'exact' });

      if (userId) {
        query = query?.eq('user_id', userId);
      }

      if (filters?.category_id) {
        query = query?.eq('category_id', filters?.category_id);
      }

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.search_query) {
        query = query?.ilike('query', `%${filters?.search_query}%`);
      }

      const { data, error, count } = await query?.order('created_at', { ascending: false })?.range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;
      return { data, count, error: null };
    } catch (error) {
      return { data: null, count: 0, error };
    }
  },

  // Update search results
  updateSearch: async (searchId, updates) => {
    try {
      const { data, error } = await supabase?.from('searches')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', searchId)?.select(`
          *,
          category:categories(id, name, icon, color)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete search
  deleteSearch: async (searchId, userId) => {
    try {
      const { error } = await supabase?.from('searches')?.delete()?.eq('id', searchId)?.eq('user_id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Get search statistics
  getSearchStats: async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_analytics')?.select('metric_name, metric_value')?.eq('user_id', userId)?.eq('date_recorded', new Date()?.toISOString()?.split('T')?.[0])?.in('metric_name', ['total_searches', 'api_calls_today']);

      if (error) throw error;
      
      const stats = {};
      data?.forEach(item => {
        stats[item?.metric_name] = item?.metric_value;
      });

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};