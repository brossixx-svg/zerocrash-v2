import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import SettingsSidebar from './components/SettingsSidebar';
import APIKeysSection from './components/APIKeysSection';
import SearchPreferencesSection from './components/SearchPreferencesSection';
import ExportOptionsSection from './components/ExportOptionsSection';
import DatabaseConfigSection from './components/DatabaseConfigSection';
import AppearanceSection from './components/AppearanceSection';
import LocalizationSection from './components/LocalizationSection';
import Button from '../../components/ui/Button';

const Settings = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('api-keys');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const navigate = useNavigate();

  // Settings sections configuration
  const settingsSections = [
    {
      id: 'api-keys',
      label: 'API Keys',
      icon: 'Key',
      description: 'Gestisci le chiavi API per i servizi esterni'
    },
    {
      id: 'search-preferences',
      label: 'Search Preferences',
      icon: 'Settings',
      description: 'Configura le preferenze di ricerca predefinite'
    },
    {
      id: 'export-options',
      label: 'Export Options',
      icon: 'Download',
      description: 'Imposta le opzioni di esportazione e i template'
    },
    {
      id: 'database-config',
      label: 'Database Configuration',
      icon: 'Database',
      description: 'Configura le connessioni al database'
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: 'Palette',
      description: 'Personalizza tema e aspetto dell\'applicazione'
    },
    {
      id: 'localization',
      label: 'Localization',
      icon: 'Globe',
      description: 'Impostazioni lingua e regionalizzazione'
    }
  ];

  const handleSectionChange = (sectionId) => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('Hai modifiche non salvate. Vuoi davvero cambiare sezione?');
      if (!confirm) return;
    }
    setActiveSection(sectionId);
    setHasUnsavedChanges(false);
    setShowMobileTabs(false);
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasUnsavedChanges(false);
      // Show success notification
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAll = () => {
    const confirm = window.confirm('Sei sicuro di voler ripristinare tutte le impostazioni ai valori predefiniti?');
    if (confirm) {
      setHasUnsavedChanges(false);
      // Reset all settings logic here
    }
  };

  const getCurrentSection = () => {
    const section = settingsSections?.find(s => s?.id === activeSection);
    return section || settingsSections?.[0];
  };

  const renderSectionContent = () => {
    const onSettingsChange = () => setHasUnsavedChanges(true);

    switch (activeSection) {
      case 'api-keys':
        return <APIKeysSection onSettingsChange={onSettingsChange} />;
      case 'search-preferences':
        return <SearchPreferencesSection onSettingsChange={onSettingsChange} />;
      case 'export-options':
        return <ExportOptionsSection onSettingsChange={onSettingsChange} />;
      case 'database-config':
        return <DatabaseConfigSection onSettingsChange={onSettingsChange} />;
      case 'appearance':
        return <AppearanceSection onSettingsChange={onSettingsChange} />;
      case 'localization':
        return <LocalizationSection onSettingsChange={onSettingsChange} />;
      default:
        return <APIKeysSection onSettingsChange={onSettingsChange} />;
    }
  };

  useEffect(() => {
    document.title = 'Impostazioni - ZeroCrash';
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setShowMobileTabs(window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Impostazioni
                </h1>
                <p className="text-text-secondary">
                  Configura la piattaforma per personalizzare la tua esperienza utente
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  onClick={handleResetAll}
                  iconName="RotateCcw"
                  iconPosition="left"
                >
                  Ripristina
                </Button>
                <Button
                  variant="default"
                  onClick={handleSaveAll}
                  loading={loading}
                  disabled={!hasUnsavedChanges}
                  iconName="Save"
                  iconPosition="left"
                >
                  Salva Modifiche
                </Button>
              </div>
            </div>

            {hasUnsavedChanges && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
                <div className="flex items-center text-warning">
                  <span className="text-sm font-medium">
                    Hai modifiche non salvate. Ricorda di salvare prima di cambiare sezione.
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Settings Navigation - Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <SettingsSidebar
                sections={settingsSections}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </div>

            {/* Mobile Navigation Tabs */}
            <div className="lg:hidden col-span-1 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowMobileTabs(!showMobileTabs)}
                  iconName="Menu"
                  iconPosition="left"
                  fullWidth
                  className="justify-start"
                >
                  {getCurrentSection()?.label}
                </Button>
                {showMobileTabs && (
                  <div className="mt-4 space-y-2">
                    {settingsSections?.map((section) => (
                      <Button
                        key={section?.id}
                        variant={activeSection === section?.id ? "default" : "ghost"}
                        onClick={() => handleSectionChange(section?.id)}
                        iconName={section?.icon}
                        iconPosition="left"
                        fullWidth
                        className="justify-start"
                      >
                        {section?.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              <div className="bg-card border border-border rounded-lg">
                {/* Section Header */}
                <div className="border-b border-border px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-text-primary">
                        {getCurrentSection()?.label}
                      </h2>
                      <p className="text-sm text-text-secondary mt-1">
                        {getCurrentSection()?.description}
                      </p>
                    </div>
                    <div className="text-sm text-text-secondary">
                      {hasUnsavedChanges && (
                        <span className="text-warning">• Modifiche non salvate</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-6">
                  {renderSectionContent()}
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

export default Settings;