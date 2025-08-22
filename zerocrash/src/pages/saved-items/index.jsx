import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

import SavedItemCard from './components/SavedItemCard';
import FolderSidebar from './components/FolderSidebar';
import FilterPanel from './components/FilterPanel';
import ExportModal from './components/ExportModal';
import BulkActionBar from './components/BulkActionBar';

const SavedItems = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [folderSidebarCollapsed, setFolderSidebarCollapsed] = useState(false);
  const [filterPanelCollapsed, setFilterPanelCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState('searches');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    source: 'all',
    category: 'all',
    dateRange: { start: '', end: '' },
    tags: [],
    sortBy: 'date_desc'
  });

  // Mock data for saved items
  const mockSavedSearches = [
    {
      id: 1,
      title: "Tendenze AI 2024 - Machine Learning",
      description: "Ricerca approfondita sulle ultime tendenze nell'intelligenza artificiale e machine learning per il 2024",
      source: "Google",
      category: "AI/ML",
      savedDate: new Date('2024-08-20'),
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
      searchParams: {
        query: "AI trends 2024 machine learning",
        sources: ["Google", "YouTube"],
        timeframe: "30d"
      }
    },
    {
      id: 2,
      title: "Cybersecurity Best Practices",
      description: "Collezione di articoli e risorse sulle migliori pratiche di sicurezza informatica",
      source: "Reddit",
      category: "Cybersecurity",
      savedDate: new Date('2024-08-19'),
      thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
      searchParams: {
        query: "cybersecurity best practices 2024",
        sources: ["Reddit", "Google"],
        timeframe: "7d"
      }
    },
    {
      id: 3,
      title: "Cloud DevOps Tools Comparison",
      description: "Analisi comparativa dei principali strumenti DevOps per ambienti cloud",
      source: "YouTube",
      category: "Cloud/DevOps",
      savedDate: new Date('2024-08-18'),
      thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=200&fit=crop",
      searchParams: {
        query: "cloud devops tools comparison",
        sources: ["YouTube"],
        timeframe: "14d"
      }
    }
  ];

  const mockSavedResults = [
    {
      id: 4,
      title: "OpenAI GPT-4 Turbo: Revolutionary AI Model",
      description: "Comprehensive analysis of OpenAI\'s latest GPT-4 Turbo model and its implications for the AI industry",
      source: "Google",
      category: "AI/ML",
      savedDate: new Date('2024-08-21'),
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
      url: "https://example.com/gpt4-turbo-analysis",
      popularity: 95,
      difficulty: "Advanced"
    },
    {
      id: 5,
      title: "Zero Trust Security Architecture Guide",
      description: "Complete guide to implementing Zero Trust security architecture in enterprise environments",
      source: "Reddit",
      category: "Cybersecurity",
      savedDate: new Date('2024-08-20'),
      thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
      url: "https://example.com/zero-trust-guide",
      popularity: 88,
      difficulty: "Intermediate"
    },
    {
      id: 6,
      title: "Kubernetes vs Docker Swarm 2024",
      description: "In-depth comparison of container orchestration platforms for modern applications",
      source: "YouTube",
      category: "Cloud/DevOps",
      savedDate: new Date('2024-08-19'),
      thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=200&fit=crop",
      url: "https://example.com/k8s-vs-swarm",
      popularity: 92,
      difficulty: "Advanced"
    }
  ];

  const mockSeoTitles = [
    {
      id: 7,
      title: "10 AI Trends That Will Dominate 2024 | Complete Guide",
      description: "SEO-optimized title generated for AI trends article with high search potential",
      source: "SEO",
      category: "AI/ML",
      savedDate: new Date('2024-08-21'),
      seoMetrics: {
        readability: 95,
        length: 52,
        keywordDensity: 8.5,
        trendFit: 92
      },
      metaDescription: "Discover the top 10 AI trends shaping 2024. From GPT-4 to autonomous systems, learn what's driving the future of artificial intelligence."
    },
    {
      id: 8,
      title: "Cybersecurity Threats 2024: How to Protect Your Business",
      description: "Generated SEO title for cybersecurity content with focus on business protection",
      source: "SEO",
      category: "Cybersecurity",
      savedDate: new Date('2024-08-20'),
      seoMetrics: {
        readability: 88,
        length: 58,
        keywordDensity: 7.2,
        trendFit: 89
      },
      metaDescription: "Learn about emerging cybersecurity threats in 2024 and proven strategies to protect your business from cyber attacks."
    }
  ];

  const mockFolders = [
    {
      id: 'all',
      name: 'Tutti gli elementi',
      color: '#64748B',
      itemCount: 8,
      children: []
    },
    {
      id: 'ai-research',
      name: 'Ricerca AI',
      color: '#3B82F6',
      itemCount: 3,
      children: [
        {
          id: 'machine-learning',
          name: 'Machine Learning',
          color: '#1D4ED8',
          itemCount: 2,
          children: []
        }
      ]
    },
    {
      id: 'security',
      name: 'Sicurezza',
      color: '#EF4444',
      itemCount: 2,
      children: []
    },
    {
      id: 'devops',
      name: 'DevOps',
      color: '#10B981',
      itemCount: 2,
      children: []
    },
    {
      id: 'seo-content',
      name: 'Contenuti SEO',
      color: '#F59E0B',
      itemCount: 1,
      children: []
    }
  ];

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'searches':
        return mockSavedSearches;
      case 'results':
        return mockSavedResults;
      case 'seo':
        return mockSeoTitles;
      default:
        return [];
    }
  };

  const getTabCounts = () => ({
    searches: mockSavedSearches?.length,
    results: mockSavedResults?.length,
    seo: mockSeoTitles?.length
  });

  const handleItemSelect = (itemId, selected) => {
    if (selected) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev?.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = () => {
    const currentItems = getCurrentItems();
    setSelectedItems(currentItems?.map(item => item?.id));
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const handleBulkMove = () => {
    console.log('Moving items:', selectedItems);
    // Implement bulk move logic
  };

  const handleBulkDelete = () => {
    console.log('Deleting items:', selectedItems);
    // Implement bulk delete logic
    setSelectedItems([]);
  };

  const handleBulkExport = () => {
    setShowExportModal(true);
  };

  const handleBulkShare = () => {
    console.log('Sharing items:', selectedItems);
    // Implement bulk share logic
  };

  const handleItemEdit = (item) => {
    console.log('Editing item:', item);
    // Implement edit logic
  };

  const handleItemDelete = (item) => {
    console.log('Deleting item:', item);
    // Implement delete logic
  };

  const handleItemMove = (item) => {
    console.log('Moving item:', item);
    // Implement move logic
  };

  const handleItemShare = (item) => {
    console.log('Sharing item:', item);
    // Implement share logic
  };

  const handleItemOpen = (item) => {
    if (item?.url) {
      window.open(item?.url, '_blank');
    } else if (item?.searchParams) {
      // Navigate to advanced search with saved parameters
      console.log('Opening saved search:', item?.searchParams);
    }
  };

  const handleCreateFolder = (folderData) => {
    console.log('Creating folder:', folderData);
    // Implement folder creation logic
  };

  const handleDeleteFolder = (folderId) => {
    console.log('Deleting folder:', folderId);
    // Implement folder deletion logic
  };

  const handleRenameFolder = (folderId, newName) => {
    console.log('Renaming folder:', folderId, newName);
    // Implement folder rename logic
  };

  const handleExport = async (exportData) => {
    console.log('Exporting data:', exportData);
    // Implement export logic
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  const tabCounts = getTabCounts();
  const currentItems = getCurrentItems();
  const filteredItems = currentItems; // Apply filters here in real implementation

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}`}>
        <div className="pt-16">
          <div className="flex">
            <FolderSidebar
              folders={mockFolders}
              selectedFolder={selectedFolder}
              onFolderSelect={setSelectedFolder}
              onCreateFolder={handleCreateFolder}
              onDeleteFolder={handleDeleteFolder}
              onRenameFolder={handleRenameFolder}
              isCollapsed={folderSidebarCollapsed}
              onToggleCollapse={() => setFolderSidebarCollapsed(!folderSidebarCollapsed)}
            />
            
            <div className="flex-1">
              <div className="p-6">
                <Breadcrumb />
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-text-primary">Elementi salvati</h1>
                    <p className="text-text-secondary mt-1">
                      Gestisci le tue ricerche, risultati e contenuti SEO salvati
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                      >
                        <Icon name="Grid3X3" size={20} />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                      >
                        <Icon name="List" size={20} />
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      onClick={() => setFilterPanelCollapsed(!filterPanelCollapsed)}
                      iconName="Filter"
                      iconPosition="left"
                    >
                      Filtri
                    </Button>
                    
                    <Button
                      onClick={handleBulkExport}
                      iconName="Download"
                      iconPosition="left"
                    >
                      Esporta
                    </Button>
                  </div>
                </div>
                
                <FilterPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  isCollapsed={filterPanelCollapsed}
                  onToggleCollapse={() => setFilterPanelCollapsed(!filterPanelCollapsed)}
                />
                
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="border-b border-border">
                    <nav className="flex space-x-8 px-6">
                      <button
                        onClick={() => setActiveTab('searches')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === 'searches' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        Ricerche salvate
                        <span className="ml-2 px-2 py-1 bg-muted text-text-secondary text-xs rounded-full">
                          {tabCounts?.searches}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('results')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === 'results' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        Risultati salvati
                        <span className="ml-2 px-2 py-1 bg-muted text-text-secondary text-xs rounded-full">
                          {tabCounts?.results}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('seo')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === 'seo' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        Titoli SEO
                        <span className="ml-2 px-2 py-1 bg-muted text-text-secondary text-xs rounded-full">
                          {tabCounts?.seo}
                        </span>
                      </button>
                    </nav>
                  </div>
                  
                  <div className="p-6">
                    {filteredItems?.length === 0 ? (
                      <div className="text-center py-12">
                        <Icon name="Bookmark" size={48} className="text-text-secondary mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-text-primary mb-2">
                          Nessun elemento trovato
                        </h3>
                        <p className="text-text-secondary mb-6">
                          {activeTab === 'searches' && "Non hai ancora salvato nessuna ricerca."}
                          {activeTab === 'results' && "Non hai ancora salvato nessun risultato."}
                          {activeTab === 'seo' && "Non hai ancora generato nessun titolo SEO."}
                        </p>
                        <Button
                          onClick={() => window.location.href = '/advanced-search'}
                          iconName="Search"
                          iconPosition="left"
                        >
                          Inizia una ricerca
                        </Button>
                      </div>
                    ) : (
                      <div className={
                        viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' :'space-y-4'
                      }>
                        {filteredItems?.map(item => (
                          <SavedItemCard
                            key={item?.id}
                            item={item}
                            viewMode={viewMode}
                            onEdit={handleItemEdit}
                            onDelete={handleItemDelete}
                            onMove={handleItemMove}
                            onShare={handleItemShare}
                            onOpen={handleItemOpen}
                            isSelected={selectedItems?.includes(item?.id)}
                            onSelect={handleItemSelect}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BulkActionBar
        selectedCount={selectedItems?.length}
        totalItems={filteredItems?.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkMove={handleBulkMove}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        onBulkShare={handleBulkShare}
      />
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        selectedItems={selectedItems?.map(id => filteredItems?.find(item => item?.id === id))?.filter(Boolean)}
        onExport={handleExport}
      />
      <QuickActionButton />
    </div>
  );
};

export default SavedItems;