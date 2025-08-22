import { supabase } from '../lib/supabase';

export const analyticsService = {
  // Get user dashboard metrics
  getDashboardMetrics: async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_analytics')?.select('metric_name, metric_value')?.eq('user_id', userId)?.eq('date_recorded', new Date()?.toISOString()?.split('T')?.[0]);

      if (error) throw error;

      // Convert array to object
      const metrics = {};
      data?.forEach(item => {
        metrics[item?.metric_name] = Number(item?.metric_value) || 0;
      });

      return { 
        data: {
          total_searches: metrics?.total_searches || 0,
          saved_items: metrics?.saved_items || 0,
          api_calls_today: metrics?.api_calls_today || 0,
          trending_topics: 156 // Static for now, could be calculated
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update user metric
  updateUserMetric: async (userId, metricName, metricValue, metadata = {}) => {
    try {
      const dateRecorded = new Date()?.toISOString()?.split('T')?.[0];
      
      const { data, error } = await supabase?.from('user_analytics')?.upsert({
          user_id: userId,
          metric_name: metricName,
          metric_value: metricValue,
          date_recorded: dateRecorded,
          metadata
        }, {
          onConflict: 'user_id, metric_name, date_recorded'
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Increment user metric
  incrementUserMetric: async (userId, metricName, incrementBy = 1) => {
    try {
      // First, try to get current value
      const { data: current } = await supabase?.from('user_analytics')?.select('metric_value')?.eq('user_id', userId)?.eq('metric_name', metricName)?.eq('date_recorded', new Date()?.toISOString()?.split('T')?.[0])?.single();

      const currentValue = current?.metric_value || 0;
      const newValue = Number(currentValue) + incrementBy;

      return await this.updateUserMetric(userId, metricName, newValue);
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get analytics trends (last 30 days)
  getAnalyticsTrends: async (userId, metricName, days = 30) => {
    try {
      const startDate = new Date();
      startDate?.setDate(startDate?.getDate() - days);

      const { data, error } = await supabase?.from('user_analytics')?.select('date_recorded, metric_value')?.eq('user_id', userId)?.eq('metric_name', metricName)?.gte('date_recorded', startDate?.toISOString()?.split('T')?.[0])?.order('date_recorded', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get system-wide analytics (admin only)
  getSystemAnalytics: async () => {
    try {
      const today = new Date()?.toISOString()?.split('T')?.[0];
      
      const { data, error } = await supabase?.from('user_analytics')?.select('metric_name, metric_value, user_id')?.eq('date_recorded', today);

      if (error) throw error;

      // Aggregate system metrics
      const systemMetrics = {};
      data?.forEach(item => {
        if (!systemMetrics?.[item?.metric_name]) {
          systemMetrics[item.metric_name] = {
            total: 0,
            users: new Set()
          };
        }
        systemMetrics[item.metric_name].total += Number(item?.metric_value) || 0;
        systemMetrics?.[item?.metric_name]?.users?.add(item?.user_id);
      });

      // Convert to final format
      const result = {};
      Object?.keys(systemMetrics)?.forEach(key => {
        result[key] = {
          total: systemMetrics?.[key]?.total,
          active_users: systemMetrics?.[key]?.users?.size
        };
      });

      return { data: result, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Record search activity
  recordSearchActivity: async (userId, searchData) => {
    try {
      // Increment total searches
      await this.incrementUserMetric(userId, 'total_searches');
      
      // Increment API calls if sources were used
      if (searchData?.sources?.length > 0) {
        await this.incrementUserMetric(userId, 'api_calls_today', searchData?.sources?.length);
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Record save activity
  recordSaveActivity: async (userId) => {
    try {
      // Get current saved items count
      const { data: savedCount } = await supabase?.from('saved_items')?.select('id', { count: 'exact' })?.eq('user_id', userId);

      await this.updateUserMetric(userId, 'saved_items', savedCount?.length || 0);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};