import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkOperationsPanel = ({ 
  selectedItems, 
  onBulkUpdate, 
  onImport, 
  onExport, 
  onBackup,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('update');
  const [updateData, setUpdateData] = useState({
    status: '',
    priority: '',
    trackTrends: null,
    autoUpdate: null
  });

  const statusOptions = [
    { value: '', label: 'Non modificare' },
    { value: 'active', label: 'Attiva' },
    { value: 'inactive', label: 'Inattiva' }
  ];

  const priorityOptions = [
    { value: '', label: 'Non modificare' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Bassa' }
  ];

  const booleanOptions = [
    { value: null, label: 'Non modificare' },
    { value: true, label: 'Sì' },
    { value: false, label: 'No' }
  ];

  const handleBulkUpdate = () => {
    const updates = {};
    if (updateData?.status) updates.status = updateData?.status;
    if (updateData?.priority) updates.priority = updateData?.priority;
    if (updateData?.trackTrends !== null) updates.trackTrends = updateData?.trackTrends;
    if (updateData?.autoUpdate !== null) updates.autoUpdate = updateData?.autoUpdate;

    if (Object.keys(updates)?.length > 0) {
      onBulkUpdate(selectedItems, updates);
    }
  };

  const handleFileImport = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e?.target?.result);
          onImport(data);
        } catch (error) {
          alert('Errore nel parsing del file JSON');
        }
      };
      reader?.readAsText(file);
    }
  };

  const tabs = [
    { id: 'update', label: 'Aggiorna', icon: 'Edit' },
    { id: 'import', label: 'Importa', icon: 'Upload' },
    { id: 'export', label: 'Esporta', icon: 'Download' },
    { id: 'backup', label: 'Backup', icon: 'Archive' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg shadow-elevation-2 w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Operazioni di Massa
            </h3>
            <p className="text-sm text-text-secondary">
              {selectedItems?.length} elementi selezionati
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'update' && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-text-secondary mb-4">
                  Seleziona i campi da aggiornare per tutte le categorie selezionate:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Stato"
                    options={statusOptions}
                    value={updateData?.status}
                    onChange={(value) => setUpdateData(prev => ({ ...prev, status: value }))}
                  />

                  <Select
                    label="Priorità"
                    options={priorityOptions}
                    value={updateData?.priority}
                    onChange={(value) => setUpdateData(prev => ({ ...prev, priority: value }))}
                  />

                  <Select
                    label="Traccia Tendenze"
                    options={booleanOptions}
                    value={updateData?.trackTrends}
                    onChange={(value) => setUpdateData(prev => ({ ...prev, trackTrends: value }))}
                  />

                  <Select
                    label="Aggiornamento Automatico"
                    options={booleanOptions}
                    value={updateData?.autoUpdate}
                    onChange={(value) => setUpdateData(prev => ({ ...prev, autoUpdate: value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="default"
                  onClick={handleBulkUpdate}
                  iconName="Save"
                  iconPosition="left"
                >
                  Applica Modifiche
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium text-text-primary mb-2">
                  Importa Categorie
                </h4>
                <p className="text-sm text-text-secondary mb-4">
                  Carica un file JSON contenente la struttura delle categorie da importare.
                </p>
                
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Icon name="Upload" size={48} className="text-text-secondary mx-auto mb-4" />
                  <p className="text-text-primary font-medium mb-2">
                    Trascina il file qui o clicca per selezionare
                  </p>
                  <p className="text-sm text-text-secondary mb-4">
                    Supporta solo file JSON (max 10MB)
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                    id="import-file"
                  />
                  <label htmlFor="import-file">
                    <Button variant="outline" as="span">
                      Seleziona File
                    </Button>
                  </label>
                </div>
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                  <div>
                    <h5 className="font-medium text-warning mb-1">Attenzione</h5>
                    <p className="text-sm text-text-secondary">
                      L'importazione sovrascriverà le categorie esistenti con lo stesso ID. 
                      Assicurati di aver fatto un backup prima di procedere.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium text-text-primary mb-2">
                  Esporta Categorie
                </h4>
                <p className="text-sm text-text-secondary mb-4">
                  Esporta la struttura delle categorie in diversi formati.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => onExport('json')}
                    iconName="FileText"
                    iconPosition="left"
                    className="justify-start"
                  >
                    <div className="text-left">
                      <div className="font-medium">JSON</div>
                      <div className="text-xs text-text-secondary">Struttura completa</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => onExport('csv')}
                    iconName="Table"
                    iconPosition="left"
                    className="justify-start"
                  >
                    <div className="text-left">
                      <div className="font-medium">CSV</div>
                      <div className="text-xs text-text-secondary">Tabella semplificata</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => onExport('xml')}
                    iconName="Code"
                    iconPosition="left"
                    className="justify-start"
                  >
                    <div className="text-left">
                      <div className="font-medium">XML</div>
                      <div className="text-xs text-text-secondary">Formato strutturato</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => onExport('pdf')}
                    iconName="FileText"
                    iconPosition="left"
                    className="justify-start"
                  >
                    <div className="text-left">
                      <div className="font-medium">PDF</div>
                      <div className="text-xs text-text-secondary">Documento stampabile</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium text-text-primary mb-2">
                  Backup Tassonomia
                </h4>
                <p className="text-sm text-text-secondary mb-4">
                  Crea un backup completo della tassonomia IT incluse tutte le configurazioni.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <div className="font-medium text-text-primary">Backup Completo</div>
                      <div className="text-sm text-text-secondary">
                        Include categorie, sottocategorie, parole chiave e impostazioni
                      </div>
                    </div>
                    <Button
                      variant="default"
                      onClick={() => onBackup('full')}
                      iconName="Archive"
                      iconPosition="left"
                    >
                      Crea Backup
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <div className="font-medium text-text-primary">Solo Struttura</div>
                      <div className="text-sm text-text-secondary">
                        Include solo la gerarchia delle categorie
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => onBackup('structure')}
                      iconName="FolderTree"
                      iconPosition="left"
                    >
                      Backup Struttura
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
                  <div>
                    <h5 className="font-medium text-success mb-1">Backup Automatico</h5>
                    <p className="text-sm text-text-secondary">
                      I backup vengono creati automaticamente ogni settimana e conservati per 30 giorni.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6">
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Chiudi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsPanel;