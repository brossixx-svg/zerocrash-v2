import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import BatchProcessingModal from './components/BatchProcessingModal';
import QuickImportPanel from './components/QuickImportPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SEOTools = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [generatedDescriptions, setGeneratedDescriptions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchItems, setBatchItems] = useState([]);
  const [config, setConfig] = useState({
    language: 'it',
    contentType: 'blog',
    keywordDensity: 'medium',
    includeReadability: true,
    includeLengthOptimization: true,
    includeTrendFit: true
  });

  // Mock batch items for demonstration
  useEffect(() => {
    const mockBatchItems = [
      {
        title: 'Intelligenza Artificiale: Tendenze 2024',
        content: 'L\'AI sta rivoluzionando il settore IT con nuove tecnologie...',
        source: 'Google News',
        date: '2024-08-20'
      },
      {
        title: 'Cybersecurity: Nuove Minacce',
        content: 'La sicurezza informatica diventa sempre più critica...',
        source: 'Reddit',
        date: '2024-08-19'
      }
    ];
    setBatchItems(mockBatchItems);
  }, []);

  const handleGenerateContent = async () => {
    if (!selectedText && batchItems?.length === 0) return;

    setIsGenerating(true);
    setGeneratedTitles([]);
    setGeneratedDescriptions([]);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate mock titles
    const mockTitles = [
      {
        text: 'Guida Completa all\'Intelligenza Artificiale nel 2024: Tendenze e Innovazioni',
        scores: {
          readability: 85,
          length: 92,
          keywords: 78,
          trendFit: 95
        }
      },
      {
        text: 'AI e Machine Learning: Come Stanno Trasformando il Settore IT',
        scores: {
          readability: 90,
          length: 88,
          keywords: 85,
          trendFit: 87
        }
      },
      {
        text: 'Intelligenza Artificiale 2024: Tutto Quello Che Devi Sapere',
        scores: {
          readability: 88,
          length: 85,
          keywords: 82,
          trendFit: 90
        }
      },
      {
        text: 'Le 10 Tendenze AI Più Importanti per Professionisti IT',
        scores: {
          readability: 92,
          length: 90,
          keywords: 88,
          trendFit: 85
        }
      },
      {
        text: 'Rivoluzione AI: Impatti e Opportunità nel Mondo Tecnologico',
        scores: {
          readability: 87,
          length: 89,
          keywords: 80,
          trendFit: 92
        }
      }
    ];

    setGeneratedTitles(mockTitles);
    setIsGenerating(false);
  };

  const handleGenerateDescriptions = async (titleText) => {
    // Generate mock meta descriptions
    const mockDescriptions = [
      {
        text: 'Scopri le ultime tendenze dell\'intelligenza artificiale nel 2024. Guida completa con esempi pratici, case study e previsioni per il futuro del settore IT.',
        score: 88
      },
      {
        text: 'Tutto quello che devi sapere sull\'AI nel 2024: tecnologie emergenti, applicazioni pratiche e impatti sul mercato del lavoro IT.',
        score: 85
      },
      {
        text: 'Analisi approfondita delle innovazioni AI del 2024. Scopri come l\'intelligenza artificiale sta trasformando il settore tecnologico.',
        score: 82
      }
    ];

    setGeneratedDescriptions(mockDescriptions);
  };

  const handleSaveTitle = (title) => {
    console.log('Saving title to favorites:', title);
    // In real app, this would save to user's favorites
  };

  const handleEditTitle = (index, newText) => {
    const updatedTitles = [...generatedTitles];
    updatedTitles[index] = {
      ...updatedTitles?.[index],
      text: newText
    };
    setGeneratedTitles(updatedTitles);
  };

  const handleCopyTitle = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
      console.log('Text copied to clipboard');
      // In real app, show toast notification
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleImportContent = (content) => {
    setSelectedText(content);
  };

  const handleAddToBatch = (item) => {
    setBatchItems(prev => [...prev, item]);
  };

  const handleRemoveBatchItem = (index) => {
    setBatchItems(prev => prev?.filter((_, i) => i !== index));
  };

  const handleStartBatch = () => {
    setShowBatchModal(true);
  };

  return (
    <>
      <Helmet>
        <title>SEO Tools - ZeroCrash</title>
        <meta name="description" content="Genera titoli SEO ottimizzati e meta description da contenuti di tendenza IT. Strumenti avanzati per content creator e professionisti del marketing." />
      </Helmet>
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
            <div className="max-w-7xl mx-auto">
              <Breadcrumb />
              
              {/* Page Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary">SEO Tools</h1>
                  <p className="text-text-secondary mt-2">
                    Genera titoli ottimizzati e meta description da contenuti di tendenza
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    iconName="Zap"
                    iconPosition="left"
                    onClick={handleStartBatch}
                    disabled={batchItems?.length === 0}
                  >
                    Batch Processing ({batchItems?.length})
                  </Button>
                  <Button
                    variant="outline"
                    iconName="History"
                    iconPosition="left"
                  >
                    Cronologia
                  </Button>
                </div>
              </div>

              {/* Quick Import Panel */}
              <div className="mb-6">
                <QuickImportPanel 
                  onImportContent={handleImportContent}
                  onAddToBatch={handleAddToBatch}
                />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
                {/* Input Section */}
                <div className="order-2 lg:order-1">
                  <InputSection
                    selectedText={selectedText}
                    onTextChange={setSelectedText}
                    onConfigChange={setConfig}
                    config={config}
                    batchItems={batchItems}
                    onRemoveBatchItem={handleRemoveBatchItem}
                    onGenerateContent={handleGenerateContent}
                  />
                </div>

                {/* Output Section */}
                <div className="order-1 lg:order-2">
                  <OutputSection
                    generatedTitles={generatedTitles}
                    generatedDescriptions={generatedDescriptions}
                    isGenerating={isGenerating}
                    onSaveTitle={handleSaveTitle}
                    onEditTitle={handleEditTitle}
                    onCopyTitle={handleCopyTitle}
                    onGenerateDescriptions={handleGenerateDescriptions}
                  />
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-text-primary">
                        {generatedTitles?.length}
                      </div>
                      <div className="text-sm text-text-secondary">Titoli Generati</div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name="Target" size={20} className="text-success" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-text-primary">
                        {generatedTitles?.length > 0 
                          ? Math.round(generatedTitles?.reduce((acc, title) => 
                              acc + (title?.scores?.readability + title?.scores?.length + title?.scores?.keywords + title?.scores?.trendFit) / 4, 0
                            ) / generatedTitles?.length)
                          : 0
                        }%
                      </div>
                      <div className="text-sm text-text-secondary">Score Medio</div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Icon name="Clock" size={20} className="text-warning" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-text-primary">
                        {batchItems?.length}
                      </div>
                      <div className="text-sm text-text-secondary">In Coda Batch</div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon name="Heart" size={20} className="text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-text-primary">24</div>
                      <div className="text-sm text-text-secondary">Salvati</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <QuickActionButton />

        {/* Batch Processing Modal */}
        <BatchProcessingModal
          isOpen={showBatchModal}
          onClose={() => setShowBatchModal(false)}
          batchItems={batchItems}
          onStartBatch={handleStartBatch}
        />
      </div>
    </>
  );
};

export default SEOTools;