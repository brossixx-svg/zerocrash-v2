import { supabase } from '../lib/supabase';
import { settingsService } from './settingsService';

export const realSearchService = {
  // Perform real search using user's API keys
  performSearch: async (query, sources = [], categoryId = null, userId = null) => {
    if (!userId) {
      return { data: [], error: { message: 'User authentication required' } };
    }

    try {
      // Get user's API keys
      const { data: apiKeys, error: keysError } = await settingsService?.getAPIKeys(userId);
      
      if (keysError) {
        throw keysError;
      }

      if (!apiKeys || Object.keys(apiKeys)?.length === 0) {
        return {
          data: [],
          error: {
            message: 'Please configure your API keys in Settings to perform searches',
            code: 'NO_API_KEYS'
          }
        };
      }

      // Save search query to database
      const searchRecord = {
        user_id: userId,
        query,
        category_id: categoryId,
        sources,
        status: 'pending',
        metadata: { timestamp: new Date()?.toISOString() }
      };

      const { data: savedSearch, error: saveError } = await supabase?.from('searches')?.insert(searchRecord)?.select()?.single();

      if (saveError) {
        console.error('Error saving search:', saveError?.message);
      }

      let allResults = [];
      let totalResults = 0;

      // Perform searches based on selected sources
      for (const source of sources) {
        try {
          let sourceResults = [];

          switch (source) {
            case 'google':
              if (apiKeys?.googleCSE?.apiKey && apiKeys?.googleCSE?.searchEngineId) {
                sourceResults = await performGoogleSearch(query, apiKeys?.googleCSE);
              }
              break;

            case 'youtube':
              if (apiKeys?.youtubeDataAPI?.apiKey) {
                sourceResults = await performYouTubeSearch(query, apiKeys?.youtubeDataAPI);
              }
              break;

            case 'reddit':
              if (apiKeys?.redditAPI?.clientId && apiKeys?.redditAPI?.clientSecret) {
                sourceResults = await performRedditSearch(query, apiKeys?.redditAPI);
              }
              break;
          }

          if (sourceResults?.length > 0) {
            // Save results to content_items table
            const contentItems = sourceResults?.map(result => ({
              title: result?.title,
              description: result?.description || result?.snippet,
              url: result?.url,
              source: source,
              category_id: categoryId,
              item_type: 'result',
              metadata: result?.metadata || {}
            }));

            const { data: savedItems, error: itemsError } = await supabase?.from('content_items')?.insert(contentItems)?.select();

            if (itemsError) {
              console.error(`Error saving ${source} results:`, itemsError?.message);
            } else {
              allResults = [...allResults, ...(savedItems || [])];
              totalResults += sourceResults?.length;
            }
          }
        } catch (sourceError) {
          console.error(`Error searching ${source}:`, sourceError?.message);
        }
      }

      // Update search status
      if (savedSearch?.id) {
        await supabase?.from('searches')?.update({
            status: 'completed',
            results_count: totalResults,
            metadata: { 
              ...searchRecord?.metadata,
              completed_at: new Date()?.toISOString()
            }
          })?.eq('id', savedSearch?.id);
      }

      return { data: allResults, error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Get search history for user
  getSearchHistory: async (userId, limit = 50) => {
    try {
      const { data, error } = await supabase?.from('searches')?.select(`
          *,
          categories (name, icon, color)
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false })?.limit(limit);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Get trending searches
  getTrendingSearches: async (limit = 10) => {
    try {
      const { data, error } = await supabase?.from('searches')?.select('query')?.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)?.toISOString())?.order('created_at', { ascending: false })?.limit(100);

      if (error) throw error;

      // Count query frequency
      const queryCount = {};
      data?.forEach(search => {
        const query = search?.query?.toLowerCase();
        queryCount[query] = (queryCount?.[query] || 0) + 1;
      });

      // Sort by frequency and return top results
      const trending = Object?.entries(queryCount)?.sort(([,a], [,b]) => b - a)?.slice(0, limit)?.map(([query, count]) => ({ query, count }));

      return { data: trending, error: null };
    } catch (error) {
      return { data: [], error };
    }
  }
};

// Helper function for Google Custom Search
const performGoogleSearch = async (query, credentials) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${credentials?.apiKey}&cx=${credentials?.searchEngineId}&q=${encodeURIComponent(query)}&num=10`
    );

    if (!response?.ok) {
      throw new Error(`Google Search API error: ${response?.status}`);
    }

    const data = await response?.json();
    
    return data?.items?.map(item => ({
      title: item?.title,
      description: item?.snippet,
      url: item?.link,
      metadata: {
        source: 'google',
        displayLink: item?.displayLink,
        formattedUrl: item?.formattedUrl
      }
    })) || [];
  } catch (error) {
    console.error('Google search error:', error?.message);
    return [];
  }
};

// Helper function for YouTube search
const performYouTubeSearch = async (query, credentials) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=10&key=${credentials?.apiKey}`
    );

    if (!response?.ok) {
      throw new Error(`YouTube API error: ${response?.status}`);
    }

    const data = await response?.json();
    
    return data?.items?.map(item => ({
      title: item?.snippet?.title,
      description: item?.snippet?.description,
      url: `https://www.youtube.com/watch?v=${item?.id?.videoId}`,
      metadata: {
        source: 'youtube',
        videoId: item?.id?.videoId,
        channelTitle: item?.snippet?.channelTitle,
        publishedAt: item?.snippet?.publishedAt,
        thumbnails: item?.snippet?.thumbnails
      }
    })) || [];
  } catch (error) {
    console.error('YouTube search error:', error?.message);
    return [];
  }
};

// Helper function for Reddit search
const performRedditSearch = async (query, credentials) => {
  try {
    // Get Reddit access token
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${credentials?.clientId}:${credentials?.clientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': credentials?.userAgent || 'ZeroCrash-App/1.0'
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse?.ok) {
      throw new Error(`Reddit auth error: ${tokenResponse?.status}`);
    }

    const tokenData = await tokenResponse?.json();
    
    // Search Reddit
    const searchResponse = await fetch(
      `https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&limit=10&sort=relevance`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData?.access_token}`,
          'User-Agent': credentials?.userAgent || 'ZeroCrash-App/1.0'
        }
      }
    );

    if (!searchResponse?.ok) {
      throw new Error(`Reddit search error: ${searchResponse?.status}`);
    }

    const searchData = await searchResponse?.json();
    
    return searchData?.data?.children?.map(post => ({
      title: post?.data?.title,
      description: post?.data?.selftext || `Posted in r/${post?.data?.subreddit}`,
      url: `https://reddit.com${post?.data?.permalink}`,
      metadata: {
        source: 'reddit',
        subreddit: post?.data?.subreddit,
        author: post?.data?.author,
        score: post?.data?.score,
        created_utc: post?.data?.created_utc,
        num_comments: post?.data?.num_comments
      }
    })) || [];
  } catch (error) {
    console.error('Reddit search error:', error?.message);
    return [];
  }
};