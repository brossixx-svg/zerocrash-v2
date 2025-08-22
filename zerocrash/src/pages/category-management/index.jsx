import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import CategoryTree from './components/CategoryTree';
import CategoryEditor from './components/CategoryEditor';
import BulkOperationsPanel from './components/BulkOperationsPanel';
import ActionToolbar from './components/ActionToolbar';
import ConfirmationModal from './components/ConfirmationModal';


const CategoryManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null,
    category: null
  });

  // Mock categories data
  const [categories, setCategories] = useState([
    {
      id: 'ai-ml',
      name: 'Intelligenza Artificiale e Machine Learning',
      description: 'Tecnologie AI, algoritmi di apprendimento automatico, reti neurali',
      icon: 'Brain',
      status: 'active',
      itemCount: 245,
      searchCount: 1834,
      trendScore: 95,
      priority: 'high',
      keywords: ['AI', 'Machine Learning', 'Deep Learning', 'Neural Networks', 'NLP'],
      trackTrends: true,
      autoUpdate: true,
      parentId: '',
      updatedAt: '2024-01-15T10:30:00Z',
      subcategories: [
        {
          id: 'ai-ml-nlp',
          name: 'Natural Language Processing',
          description: 'Elaborazione del linguaggio naturale, chatbot, sentiment analysis',
          icon: 'MessageSquare',
          status: 'active',
          itemCount: 89,
          searchCount: 567,
          trendScore: 88,
          priority: 'high',
          keywords: ['NLP', 'Chatbot', 'Sentiment Analysis', 'Text Mining'],
          trackTrends: true,
          autoUpdate: true,
          parentId: 'ai-ml',
          updatedAt: '2024-01-10T14:20:00Z',
          subcategories: []
        },
        {
          id: 'ai-ml-cv',
          name: 'Computer Vision',
          description: 'Riconoscimento immagini, analisi video, realtà aumentata',
          icon: 'Eye',
          status: 'active',
          itemCount: 67,
          searchCount: 423,
          trendScore: 82,
          priority: 'medium',
          keywords: ['Computer Vision', 'Image Recognition', 'AR', 'Object Detection'],
          trackTrends: true,
          autoUpdate: false,
          parentId: 'ai-ml',
          updatedAt: '2024-01-08T09:15:00Z',
          subcategories: []
        }
      ]
    },
    {
      id: 'cybersecurity',
      name: 'Cybersecurity',
      description: 'Sicurezza informatica, protezione dati, threat intelligence',
      icon: 'Shield',
      status: 'active',
      itemCount: 198,
      searchCount: 1456,
      trendScore: 92,
      priority: 'high',
      keywords: ['Security', 'Cybersecurity', 'Threat Intelligence', 'Encryption'],
      trackTrends: true,
      autoUpdate: true,
      parentId: '',
      updatedAt: '2024-01-12T16:45:00Z',
      subcategories: [
        {
          id: 'cybersec-threat',
          name: 'Threat Intelligence',
          description: 'Analisi minacce, incident response, forensics digitale',
          icon: 'AlertTriangle',
          status: 'active',
          itemCount: 76,
          searchCount: 534,
          trendScore: 89,
          priority: 'high',
          keywords: ['Threat Intelligence', 'Incident Response', 'Digital Forensics'],
          trackTrends: true,
          autoUpdate: true,
          parentId: 'cybersecurity',
          updatedAt: '2024-01-11T11:30:00Z',
          subcategories: []
        }
      ]
    },
    {
      id: 'cloud-devops',
      name: 'Cloud Computing e DevOps',
      description: 'Servizi cloud, containerizzazione, CI/CD, infrastructure as code',
      icon: 'Cloud',
      status: 'active',
      itemCount: 312,
      searchCount: 2187,
      trendScore: 87,
      priority: 'high',
      keywords: ['Cloud', 'DevOps', 'Docker', 'Kubernetes', 'AWS', 'Azure'],
      trackTrends: true,
      autoUpdate: true,
      parentId: '',
      updatedAt: '2024-01-14T13:20:00Z',
      subcategories: []
    },
    {
      id: 'web-development',
      name: 'Sviluppo Web',
      description: 'Framework web, frontend, backend, API development',
      icon: 'Code',
      status: 'active',
      itemCount: 278,
      searchCount: 1923,
      trendScore: 84,
      priority: 'medium',
      keywords: ['Web Development', 'React', 'Node.js', 'API', 'Frontend', 'Backend'],
      trackTrends: true,
      autoUpdate: false,
      parentId: '',
      updatedAt: '2024-01-13T08:45:00Z',
      subcategories: []
    },
    {
      id: 'mobile-development',
      name: 'Sviluppo Mobile',
      description: 'App native, cross-platform, mobile UI/UX',
      icon: 'Smartphone',
      status: 'inactive',
      itemCount: 156,
      searchCount: 892,
      trendScore: 76,
      priority: 'low',
      keywords: ['Mobile Development', 'React Native', 'Flutter', 'iOS', 'Android'],
      trackTrends: false,
      autoUpdate: false,
      parentId: '',
      updatedAt: '2024-01-09T15:10:00Z',
      subcategories: []
    }
  ]);

  const totalCategories = categories?.length + categories?.reduce((acc, cat) => acc + (cat?.subcategories?.length || 0), 0);
  const activeCategories = categories?.filter(cat => cat?.status === 'active')?.length;

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setIsEditorOpen(true);
    setIsNewCategory(false);
  };

  const handleAddCategory = (parentId = null) => {
    setSelectedCategory(parentId ? { parentId } : null);
    setIsEditorOpen(true);
    setIsNewCategory(true);
  };

  const handleSaveCategory = (categoryData) => {
    if (isNewCategory) {
      // Add new category
      if (categoryData?.parentId) {
        // Add as subcategory
        setCategories(prev => prev?.map(cat => {
          if (cat?.id === categoryData?.parentId) {
            return {
              ...cat,
              subcategories: [...(cat?.subcategories || []), categoryData]
            };
          }
          return cat;
        }));
      } else {
        // Add as main category
        setCategories(prev => [...prev, categoryData]);
      }
    } else {
      // Update existing category
      setCategories(prev => prev?.map(cat => {
        if (cat?.id === categoryData?.id) {
          return categoryData;
        }
        // Check subcategories
        if (cat?.subcategories) {
          return {
            ...cat,
            subcategories: cat?.subcategories?.map(sub => 
              sub?.id === categoryData?.id ? categoryData : sub
            )
          };
        }
        return cat;
      }));
    }
    
    setIsEditorOpen(false);
    setSelectedCategory(null);
    setIsNewCategory(false);
  };

  const handleDeleteCategory = (category) => {
    setConfirmationModal({
      isOpen: true,
      type: 'danger',
      title: 'Elimina Categoria',
      message: `Sei sicuro di voler eliminare la categoria "${category?.name}"? Questa azione eliminerà anche tutte le sottocategorie associate.`,
      category: category,
      onConfirm: () => confirmDeleteCategory(category)
    });
  };

  const confirmDeleteCategory = (category) => {
    setCategories(prev => prev?.filter(cat => cat?.id !== category?.id));
    if (selectedCategory?.id === category?.id) {
      setSelectedCategory(null);
      setIsEditorOpen(false);
    }
  };

  const handleDuplicateCategory = (category) => {
    const duplicatedCategory = {
      ...category,
      id: `${category?.id}-copy-${Date.now()}`,
      name: `${category?.name} (Copia)`,
      updatedAt: new Date()?.toISOString()
    };
    
    setCategories(prev => [...prev, duplicatedCategory]);
  };

  const handleBulkUpdate = (itemIds, updates) => {
    setCategories(prev => prev?.map(cat => {
      if (itemIds?.includes(cat?.id)) {
        return { ...cat, ...updates, updatedAt: new Date()?.toISOString() };
      }
      return cat;
    }));
    setSelectedItems([]);
    setShowBulkPanel(false);
  };

  const handleImport = (data) => {
    try {
      if (Array.isArray(data)) {
        setCategories(prev => [...prev, ...data]);
        alert(`Importate ${data?.length} categorie con successo`);
      }
    } catch (error) {
      alert('Errore durante l\'importazione');
    }
    setShowBulkPanel(false);
  };

  const handleExport = (format) => {
    const dataToExport = selectedItems?.length > 0 
      ? categories?.filter(cat => selectedItems?.includes(cat?.id))
      : categories;

    const filename = `categorie-${new Date()?.toISOString()?.split('T')?.[0]}`;
    
    switch (format) {
      case 'json':
        const jsonData = JSON.stringify(dataToExport, null, 2);
        downloadFile(jsonData, `${filename}.json`, 'application/json');
        break;
      case 'csv':
        const csvData = convertToCSV(dataToExport);
        downloadFile(csvData, `${filename}.csv`, 'text/csv');
        break;
      default:
        alert(`Formato ${format} non ancora implementato`);
    }
    setShowBulkPanel(false);
  };

  const handleBackup = (type) => {
    const backupData = {
      timestamp: new Date()?.toISOString(),
      type: type,
      data: type === 'full' ? { categories, settings: {} } : categories
    };
    
    const jsonData = JSON.stringify(backupData, null, 2);
    downloadFile(jsonData, `backup-${type}-${Date.now()}.json`, 'application/json');
    setShowBulkPanel(false);
  };

  const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data) => {
    const headers = ['ID', 'Nome', 'Descrizione', 'Stato', 'Priorità', 'Elementi', 'Parole Chiave'];
    const rows = data?.map(cat => [
      cat?.id,
      cat?.name,
      cat?.description || '',
      cat?.status,
      cat?.priority,
      cat?.itemCount || 0,
      cat?.keywords?.join('; ') || ''
    ]);
    
    return [headers, ...rows]?.map(row => 
      row?.map(field => `"${String(field)?.replace(/"/g, '""')}"`)?.join(',')
    )?.join('\n');
  };

  const handleExpandAll = () => {
    // Implementation for expanding all categories
    console.log('Expanding all categories');
  };

  const handleCollapseAll = () => {
    // Implementation for collapsing all categories
    console.log('Collapsing all categories');
  };

  const handleRefresh = () => {
    // Implementation for refreshing data
    console.log('Refreshing category data');
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
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  Gestione Categorie
                </h1>
                <p className="text-text-secondary">
                  Organizza e mantieni la struttura tassonomica IT con relazioni gerarchiche
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-muted/30 px-3 py-2 rounded-lg text-sm">
                  <span className="text-text-secondary">Ultimo aggiornamento: </span>
                  <span className="text-text-primary font-medium">
                    {new Date()?.toLocaleDateString('it-IT')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <ActionToolbar
            selectedItems={selectedItems}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddCategory={handleAddCategory}
            onBulkOperations={() => setShowBulkPanel(true)}
            onRefresh={handleRefresh}
            onExpandAll={handleExpandAll}
            onCollapseAll={handleCollapseAll}
            totalCategories={totalCategories}
            activeCategories={activeCategories}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
            {/* Category Tree */}
            <div className={`${isEditorOpen ? 'lg:col-span-4' : 'lg:col-span-12'} bg-surface border border-border rounded-lg shadow-elevation-1 transition-all duration-300`}>
              <CategoryTree
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onDuplicateCategory={handleDuplicateCategory}
                searchQuery={searchQuery}
                onBulkSelect={setSelectedItems}
                selectedItems={selectedItems}
              />
            </div>

            {/* Category Editor */}
            {isEditorOpen && (
              <div className="lg:col-span-8 bg-surface border border-border rounded-lg shadow-elevation-1">
                <CategoryEditor
                  category={selectedCategory}
                  categories={categories}
                  onSave={handleSaveCategory}
                  onCancel={() => {
                    setIsEditorOpen(false);
                    setSelectedCategory(null);
                    setIsNewCategory(false);
                  }}
                  isNew={isNewCategory}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Bulk Operations Panel */}
      {showBulkPanel && (
        <BulkOperationsPanel
          selectedItems={selectedItems}
          onBulkUpdate={handleBulkUpdate}
          onImport={handleImport}
          onExport={handleExport}
          onBackup={handleBackup}
          onClose={() => setShowBulkPanel(false)}
        />
      )}
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal?.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal?.onConfirm}
        title={confirmationModal?.title}
        message={confirmationModal?.message}
        type={confirmationModal?.type}
        category={confirmationModal?.category}
        confirmText={confirmationModal?.type === 'danger' ? 'Elimina' : 'Conferma'}
      />
      <QuickActionButton />
    </div>
  );
};

export default CategoryManagement;