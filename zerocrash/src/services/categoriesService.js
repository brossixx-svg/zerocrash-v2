import { supabase } from '../lib/supabase';

export const categoriesService = {
  // Get all categories
  getCategories: async (options = {}) => {
    try {
      let query = supabase?.from('categories')?.select('*');

      // Apply filters
      if (options?.activeOnly !== false) {
        query = query?.eq('is_active', true);
      }

      // Apply sorting
      const sortBy = options?.sortBy || 'sort_order';
      const sortOrder = options?.sortOrder || 'asc';
      query = query?.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data, error } = await query;

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Get category by ID
  getCategoryById: async (categoryId) => {
    try {
      const { data, error } = await supabase?.from('categories')?.select('*')?.eq('id', categoryId)?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create new category (admin only)
  createCategory: async (categoryData, userId) => {
    try {
      // Check if user has admin role
      const { data: userProfile, error: profileError } = await supabase?.from('user_profiles')?.select('role')?.eq('id', userId)?.single();

      if (profileError || userProfile?.role !== 'admin') {
        throw new Error('Insufficient permissions. Admin role required.');
      }

      const { data, error } = await supabase?.from('categories')?.insert(categoryData)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update category (admin only)
  updateCategory: async (categoryId, updates, userId) => {
    try {
      // Check if user has admin role
      const { data: userProfile, error: profileError } = await supabase?.from('user_profiles')?.select('role')?.eq('id', userId)?.single();

      if (profileError || userProfile?.role !== 'admin') {
        throw new Error('Insufficient permissions. Admin role required.');
      }

      const { data, error } = await supabase?.from('categories')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', categoryId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete category (admin only)
  deleteCategory: async (categoryId, userId) => {
    try {
      // Check if user has admin role
      const { data: userProfile, error: profileError } = await supabase?.from('user_profiles')?.select('role')?.eq('id', userId)?.single();

      if (profileError || userProfile?.role !== 'admin') {
        throw new Error('Insufficient permissions. Admin role required.');
      }

      // Check if category has associated content
      const { count: contentCount } = await supabase?.from('content_items')?.select('*', { count: 'exact' })?.eq('category_id', categoryId);

      const { count: searchCount } = await supabase?.from('searches')?.select('*', { count: 'exact' })?.eq('category_id', categoryId);

      if ((contentCount || 0) > 0 || (searchCount || 0) > 0) {
        throw new Error('Cannot delete category with associated content or searches. Please reassign or delete related items first.');
      }

      const { data, error } = await supabase?.from('categories')?.delete()?.eq('id', categoryId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get categories with content counts
  getCategoriesWithStats: async (userId = null) => {
    try {
      const { data: categories, error: categoriesError } = await supabase?.from('categories')?.select('*')?.eq('is_active', true)?.order('sort_order');

      if (categoriesError) throw categoriesError;

      // Get content counts for each category
      const categoriesWithStats = await Promise?.all(
        categories?.map(async (category) => {
          // Get total content items count
          const { count: totalContent } = await supabase?.from('content_items')?.select('*', { count: 'exact' })?.eq('category_id', category?.id);

          // Get user-specific search count if userId provided
          let userSearches = 0;
          if (userId) {
            const { count } = await supabase?.from('searches')?.select('*', { count: 'exact' })?.eq('category_id', category?.id)?.eq('user_id', userId);

            userSearches = count || 0;
          }

          return {
            ...category,
            stats: {
              totalContent: totalContent || 0,
              userSearches
            }
          };
        })
      );

      return { data: categoriesWithStats || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Get popular categories based on search frequency
  getPopularCategories: async (limit = 10) => {
    try {
      const { data: searches, error: searchError } = await supabase?.from('searches')?.select('category_id')?.not('category_id', 'is', null)?.gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString());

      if (searchError) throw searchError;

      // Count category frequency
      const categoryCount = {};
      searches?.forEach(search => {
        const categoryId = search?.category_id;
        if (categoryId) {
          categoryCount[categoryId] = (categoryCount?.[categoryId] || 0) + 1;
        }
      });

      // Get top category IDs
      const topCategoryIds = Object?.entries(categoryCount)?.sort(([,a], [,b]) => b - a)?.slice(0, limit)?.map(([categoryId]) => categoryId);

      if (topCategoryIds?.length === 0) {
        return { data: [], error: null };
      }

      // Get category details
      const { data: categories, error: categoriesError } = await supabase?.from('categories')?.select('*')?.in('id', topCategoryIds)?.eq('is_active', true);

      if (categoriesError) throw categoriesError;

      // Add search counts and sort
      const categoriesWithCounts = categories?.map(category => ({
        ...category,
        searchCount: categoryCount?.[category?.id] || 0
      }))?.sort((a, b) => b?.searchCount - a?.searchCount);

      return { data: categoriesWithCounts || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Reorder categories (admin only)
  reorderCategories: async (categoryOrders, userId) => {
    try {
      // Check if user has admin role
      const { data: userProfile, error: profileError } = await supabase?.from('user_profiles')?.select('role')?.eq('id', userId)?.single();

      if (profileError || userProfile?.role !== 'admin') {
        throw new Error('Insufficient permissions. Admin role required.');
      }

      // Update sort orders
      const updates = categoryOrders?.map(({ id, sortOrder }) => 
        supabase?.from('categories')?.update({ sort_order: sortOrder })?.eq('id', id)
      );

      const results = await Promise?.allSettled(updates);
      
      const failed = results?.filter(result => result?.status === 'rejected');
      if (failed?.length > 0) {
        throw new Error('Failed to update some category orders');
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: false, error };
    }
  }
};