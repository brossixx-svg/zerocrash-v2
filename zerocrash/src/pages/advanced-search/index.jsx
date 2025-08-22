import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import FilterPanel from './components/FilterPanel';
import SearchInput from './components/SearchInput';
import ResultsList from './components/ResultsList';
import DebugConsole from './components/DebugConsole';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { realSearchService } from '../../services/realSearchService';
import Icon from '../../components/AppIcon';


const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [debugVisible, setDebugVisible] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedResults, setSelectedResults] = useState([]);
  const [apiResponses, setApiResponses] = useState([]);
  const [searchError, setSearchError] = useState(null);
  
  // Filters State
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    sources: ['google', 'youtube', 'reddit'],
    language: 'it',
    timeframe: '7d',
    searchMode: 'balanced',
    customDateFrom: '',
    customDateTo: ''
  });
  
  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    resultsPerPage: 20
  });

  useEffect(() => {
    const query = searchParams?.get('q');
    if (query && query !== searchQuery) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query) => {
    if (!query?.trim()) return;
    
    if (!user) {
      setSearchError('Please sign in to perform searches');
      return;
    }
    
    setIsSearching(true);
    setResults([]);
    setSelectedResults([]);
    setSearchError(null);
    
    // Update URL
    setSearchParams({ q: query });
    
    try {
      const searchParams = {
        query,
        sources: filters?.sources || ['google', 'youtube', 'reddit'],
        userId: user?.id,
        filters: {
          language: filters?.language,
          timeframe: filters?.timeframe,
          categories: filters?.categories,
          subcategories: filters?.subcategories
        }
      };

      const searchResults = await realSearchService?.performSearch(searchParams);
      
      setResults(searchResults?.results || []);
      setApiResponses(searchResults?.responses || []);
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil((searchResults?.results?.length || 0) / 20),
        totalResults: searchResults?.totalResults || 0,
        resultsPerPage: 20
      });
      
    } catch (error) {
      setSearchError(error?.message || 'Search failed');
      setApiResponses([
        {
          source: 'error',
          status: 500,
          responseTime: 0,
          error: error?.message
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const handleSelectResult = (resultId, selected) => {
    setSelectedResults(prev => 
      selected 
        ? [...prev, resultId]
        : prev?.filter(id => id !== resultId)
    );
  };

  const handleSelectAll = (selected) => {
    setSelectedResults(selected ? results?.map(r => r?.id) : []);
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'seo': navigate('/seo-tools', { 
          state: { 
            selectedResults: results?.filter(r => selectedResults?.includes(r?.id)) 
          } 
        });
        break;
      case 'save': console.log('Saving selected results:', selectedResults);
        // In real app, save to backend/localStorage
        break;
      case 'export':
        console.log('Exporting selected results:', selectedResults);
        // In real app, trigger export
        break;
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    // In real app, fetch new page of results
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      } pt-16`}>
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Filter Panel */}
          <div className={`hidden lg:block transition-all duration-300 ${
            filtersCollapsed ? 'w-16' : 'w-80'
          }`}>
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              isCollapsed={filtersCollapsed}
              onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
            />
          </div>

          {/* Mobile Filter Overlay */}
          {isMobileFiltersOpen && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={() => setIsMobileFiltersOpen(false)}
              />
              <div className="fixed left-0 top-16 bottom-0 z-50 w-80 lg:hidden">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  isCollapsed={false}
                  onToggleCollapse={() => setIsMobileFiltersOpen(false)}
                />
              </div>
            </>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Breadcrumb */}
                <Breadcrumb />

                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                      Ricerca Avanzata
                    </h1>
                    <p className="text-text-secondary">
                      {user ? 
                        'Esplora trend IT da Google News, YouTube e Reddit con le tue API chiavi' : 'Accedi per utilizzare le ricerche con API reali'
                      }
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="lg:hidden"
                    iconName="Filter"
                    iconPosition="left"
                  >
                    Filtri
                  </Button>
                </div>

                {/* Authentication Required Notice */}
                {!user && (
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3">
                      <Icon name="AlertCircle" size={20} className="text-warning" />
                      <div>
                        <h3 className="font-medium text-warning">Accesso Richiesto</h3>
                        <p className="text-text-secondary mt-1">
                          Accedi per utilizzare le ricerche con API reali invece dei dati demo
                        </p>
                      </div>
                      <Button
                        onClick={() => navigate('/authentication-login-register')}
                        variant="outline"
                        size="sm"
                        className="ml-auto"
                      >
                        Accedi
                      </Button>
                    </div>
                  </div>
                )}

                {/* Search Error */}
                {searchError && (
                  <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Icon name="AlertCircle" size={16} className="text-error" />
                      <span className="text-error font-medium">Search Error</span>
                    </div>
                    <p className="text-error mt-1">{searchError}</p>
                    {searchError?.includes('API key') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/settings')}
                        className="mt-2 text-error hover:text-error/80"
                      >
                        Configure API Keys →
                      </Button>
                    )}
                  </div>
                )}

                {/* Search Input */}
                <div className="mb-8">
                  <SearchInput 
                    onSearch={handleSearch}
                    isLoading={isSearching}
                  />
                </div>

                {/* Results */}
                <ResultsList
                  results={results}
                  isLoading={isSearching}
                  selectedResults={selectedResults}
                  onSelectResult={handleSelectResult}
                  onSelectAll={handleSelectAll}
                  onBulkAction={handleBulkAction}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Debug Console */}
      <DebugConsole
        apiResponses={apiResponses}
        searchQuery={searchQuery}
        filters={filters}
        isVisible={debugVisible}
        onToggle={() => setDebugVisible(!debugVisible)}
      />
      <QuickActionButton />
    </div>
  );
};

export default AdvancedSearch;