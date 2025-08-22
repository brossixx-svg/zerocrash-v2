import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import MetricsCard from './components/MetricsCard';
import TrendingTopicCard from './components/TrendingTopicCard';
import RecentSearchItem from './components/RecentSearchItem';
import SavedItemPreview from './components/SavedItemPreview';
import TrendingContentItem from './components/TrendingContentItem';
import QuickActionsPanel from './components/QuickActionsPanel';
import APIStatusIndicator from './components/APIStatusIndicator';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { searchService } from '../../services/searchService';
import { contentService } from '../../services/contentService';
import { savedItemsService } from '../../services/savedItemsService';
import { analyticsService } from '../../services/analyticsService';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data state
  const [metricsData, setMetricsData] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedItemsPreview, setSavedItemsPreview] = useState([]);
  const [trendingContent, setTrendingContent] = useState([]);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadDashboardData();
      } else {
        navigate('/authentication-login-register');
      }
    }
  }, [user, authLoading, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricsResult, topicsResult, searchesResult, savedResult, contentResult] = await Promise.all([
        analyticsService?.getDashboardMetrics(user?.id),
        contentService?.getTrendingTopics(6),
        searchService?.getRecentSearches(user?.id, 4),
        savedItemsService?.getSavedItemsPreview(user?.id, 3),
        contentService?.getTrendingContent(4)
      ]);

      // Handle metrics
      if (metricsResult?.data) {
        const metrics = metricsResult?.data;
        setMetricsData([
          {
            title: 'Total Searches',
            value: metrics?.total_searches?.toLocaleString() || '0',
            change: '+12%',
            changeType: 'positive',
            icon: 'Search',
            color: 'accent'
          },
          {
            title: 'Saved Items',
            value: metrics?.saved_items?.toString() || '0',
            change: '+5',
            changeType: 'positive',
            icon: 'Bookmark',
            color: 'success'
          },
          {
            title: 'Trending Topics',
            value: metrics?.trending_topics?.toString() || '0',
            change: '+23',
            changeType: 'positive',
            icon: 'TrendingUp',
            color: 'warning'
          },
          {
            title: 'API Calls Today',
            value: metrics?.api_calls_today?.toLocaleString() || '0',
            change: '-8%',
            changeType: 'negative',
            icon: 'Zap',
            color: 'primary'
          }
        ]);
      }

      // Handle trending topics
      if (topicsResult?.data) {
        setTrendingTopics(topicsResult?.data?.map(topic => ({
          category: topic?.category?.name || topic?.topic,
          trendCount: topic?.trend_count,
          popularityScore: topic?.popularity_score,
          icon: topic?.category?.icon || 'TrendingUp',
          color: topic?.category?.color || 'primary',
          recentTrends: topic?.recent_trends || []
        })));
      }

      // Handle recent searches
      if (searchesResult?.data) {
        setRecentSearches(searchesResult?.data?.map(search => ({
          query: search?.query,
          category: search?.category?.name,
          timestamp: new Date(search?.created_at),
          resultsCount: search?.results_count,
          sources: search?.sources || []
        })));
      }

      // Handle saved items preview
      if (savedResult?.data) {
        setSavedItemsPreview(savedResult?.data?.map(item => ({
          title: item?.content_item?.title,
          type: item?.content_item?.item_type,
          category: item?.content_item?.category?.name,
          savedAt: new Date(item?.saved_at),
          difficulty: item?.content_item?.difficulty,
          source: item?.content_item?.source
        })));
      }

      // Handle trending content
      if (contentResult?.data) {
        setTrendingContent(contentResult?.data?.map(content => ({
          title: content?.title,
          source: content?.source,
          difficulty: content?.difficulty,
          popularityScore: content?.popularity_score,
          category: content?.category?.name,
          url: content?.url,
          description: content?.description,
          publishedAt: content?.published_at ? new Date(content.published_at) : new Date()
        })));
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = async (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      try {
        // Record the search
        await searchService?.createSearch({
          query: searchQuery?.trim(),
          user_id: user?.id,
          sources: ['google'],
          status: 'pending'
        });

        // Record analytics
        await analyticsService?.recordSearchActivity(user?.id, {
          sources: ['google']
        });

        navigate(`/advanced-search?q=${encodeURIComponent(searchQuery?.trim())}`);
        setSearchQuery('');
      } catch (error) {
        console.error('Error creating search:', error);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
          <p className="text-error mb-4">{error}</p>
          <Button onClick={handleRefresh} iconName="RefreshCw">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      }`}>
        <div className="p-6">
          <Breadcrumb />
          
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Welcome back, {user?.user_metadata?.full_name || 'User'}
                </h1>
                <p className="text-text-secondary">
                  Monitor IT trends, manage searches, and optimize SEO content
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  {refreshing ? 'Updating...' : 'Refresh'}
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate('/advanced-search')}
                  iconName="Search"
                  iconPosition="left"
                >
                  New Search
                </Button>
              </div>
            </div>

            {/* Quick Search Bar */}
            <form onSubmit={handleQuickSearch} className="max-w-2xl">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search trends, technologies, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="pl-10 pr-4"
                />
                <Icon 
                  name="Search" 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                />
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="xl:col-span-3 space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metricsData?.map((metric, index) => (
                  <MetricsCard
                    key={index}
                    title={metric?.title}
                    value={metric?.value}
                    change={metric?.change}
                    changeType={metric?.changeType}
                    icon={metric?.icon}
                    color={metric?.color}
                  />
                ))}
              </div>

              {/* Trending Topics */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-text-primary">Trending Topics</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/category-management')}
                    iconName="Settings"
                    iconPosition="right"
                  >
                    Manage Categories
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingTopics?.map((topic, index) => (
                    <TrendingTopicCard
                      key={index}
                      category={topic?.category}
                      trendCount={topic?.trendCount}
                      popularityScore={topic?.popularityScore}
                      recentTrends={topic?.recentTrends}
                      icon={topic?.icon}
                      color={topic?.color}
                    />
                  ))}
                </div>
              </div>

              {/* Trending Content Feed */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-text-primary">Trending Content</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/advanced-search')}
                    iconName="ExternalLink"
                    iconPosition="right"
                  >
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {trendingContent?.map((content, index) => (
                    <TrendingContentItem
                      key={index}
                      title={content?.title}
                      source={content?.source}
                      difficulty={content?.difficulty}
                      popularityScore={content?.popularityScore}
                      category={content?.category}
                      url={content?.url}
                      description={content?.description}
                      publishedAt={content?.publishedAt}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* API Status */}
              <APIStatusIndicator />

              {/* Quick Actions */}
              <QuickActionsPanel />

              {/* Recent Searches */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">Recent Searches</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/advanced-search')}
                    iconName="History"
                    iconPosition="right"
                  >
                    History
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentSearches?.slice(0, 4)?.map((search, index) => (
                    <RecentSearchItem
                      key={index}
                      query={search?.query}
                      category={search?.category}
                      timestamp={search?.timestamp}
                      resultsCount={search?.resultsCount}
                      sources={search?.sources}
                    />
                  ))}
                  {recentSearches?.length === 0 && (
                    <p className="text-text-secondary text-sm">No recent searches</p>
                  )}
                </div>
              </div>

              {/* Saved Items Preview */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">Saved Items</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/saved-items')}
                    iconName="Bookmark"
                    iconPosition="right"
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {savedItemsPreview?.map((item, index) => (
                    <SavedItemPreview
                      key={index}
                      title={item?.title}
                      type={item?.type}
                      category={item?.category}
                      savedAt={item?.savedAt}
                      difficulty={item?.difficulty}
                      source={item?.source}
                    />
                  ))}
                  {savedItemsPreview?.length === 0 && (
                    <p className="text-text-secondary text-sm">No saved items</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <QuickActionButton />
    </div>
  );
};

export default Dashboard;