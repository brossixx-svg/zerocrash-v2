import { supabase } from '../lib/supabase';

export const settingsService = {
  // Get user settings
  getSettings: async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_settings')?.select('*')?.eq('user_id', userId)?.single();

      if (error && error?.code !== 'PGRST116') {
        throw error;
      }

      // If no settings exist, return default structure
      if (!data) {
        return {
          data: {
            api_keys: {},
            ui_preferences: {
              theme: 'light',
              language: 'it',
              sidebarCollapsed: false
            },
            search_preferences: {
              defaultSources: ['google', 'youtube', 'reddit'],
              defaultLanguage: 'it',
              resultsPerPage: 20
            },
            notification_settings: {
              emailNotifications: true,
              searchAlerts: false
            }
          },
          error: null
        };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update API keys
  updateAPIKeys: async (userId, apiKeys) => {
    try {
      const { data, error } = await supabase?.from('user_settings')?.upsert({
          user_id: userId,
          api_keys: apiKeys,
          updated_at: new Date()?.toISOString()
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update specific settings section
  updateSettings: async (userId, settingsSection, settingsData) => {
    try {
      const updateData = {
        user_id: userId,
        [settingsSection]: settingsData,
        updated_at: new Date()?.toISOString()
      };

      const { data, error } = await supabase?.from('user_settings')?.upsert(updateData)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Test API key connections
  testAPIConnection: async (service, credentials) => {
    try {
      let testResult = { connected: false, error: null };

      switch (service) {
        case 'googleCSE':
          if (!credentials?.apiKey || !credentials?.searchEngineId) {
            testResult.error = 'Missing API key or Search Engine ID';
            break;
          }
          
          const googleResponse = await fetch(
            `https://www.googleapis.com/customsearch/v1?key=${credentials?.apiKey}&cx=${credentials?.searchEngineId}&q=test&num=1`
          );
          
          if (googleResponse?.ok) {
            const googleData = await googleResponse?.json();
            testResult.connected = googleData?.searchInformation?.totalResults > 0;
          } else {
            const error = await googleResponse?.json();
            testResult.error = error?.error?.message || 'Google CSE API test failed';
          }
          break;

        case 'youtubeDataAPI':
          if (!credentials?.apiKey) {
            testResult.error = 'Missing YouTube API key';
            break;
          }
          
          const youtubeResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&maxResults=1&key=${credentials?.apiKey}`
          );
          
          if (youtubeResponse?.ok) {
            const youtubeData = await youtubeResponse?.json();
            testResult.connected = youtubeData?.items?.length > 0;
          } else {
            const error = await youtubeResponse?.json();
            testResult.error = error?.error?.message || 'YouTube API test failed';
          }
          break;

        case 'redditAPI':
          if (!credentials?.clientId || !credentials?.clientSecret) {
            testResult.error = 'Missing Reddit client ID or secret';
            break;
          }
          
          // Get Reddit access token first
          const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${btoa(`${credentials?.clientId}:${credentials?.clientSecret}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': credentials?.userAgent || 'TrendTech-App/1.0'
            },
            body: 'grant_type=client_credentials'
          });
          
          if (tokenResponse?.ok) {
            const tokenData = await tokenResponse?.json();
            
            // Test with a simple subreddit call
            const testResponse = await fetch('https://oauth.reddit.com/r/technology/top?limit=1', {
              headers: {
                'Authorization': `Bearer ${tokenData?.access_token}`,
                'User-Agent': credentials?.userAgent || 'TrendTech-App/1.0'
              }
            });
            
            if (testResponse?.ok) {
              const testData = await testResponse?.json();
              testResult.connected = testData?.data?.children?.length > 0;
            } else {
              testResult.error = 'Reddit API test call failed';
            }
          } else {
            const error = await tokenResponse?.json();
            testResult.error = error?.message || 'Reddit authentication failed';
          }
          break;

        default:
          testResult.error = 'Unknown service';
      }

      return testResult;
    } catch (error) {
      return { connected: false, error: error?.message || 'Connection test failed' };
    }
  },

  // Get API keys for server-side usage
  getAPIKeys: async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_settings')?.select('api_keys')?.eq('user_id', userId)?.single();

      if (error && error?.code !== 'PGRST116') {
        throw error;
      }

      return { data: data?.api_keys || {}, error: null };
    } catch (error) {
      return { data: {}, error };
    }
  }
};