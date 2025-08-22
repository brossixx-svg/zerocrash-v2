import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CategoryEditor = ({ 
  category, 
  categories, 
  onSave, 
  onCancel, 
  isNew = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
    icon: 'Folder',
    status: 'active',
    keywords: [],
    trackTrends: true,
    autoUpdate: false,
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});
  const [keywordInput, setKeywordInput] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category?.name || '',
        description: category?.description || '',
        parentId: category?.parentId || '',
        icon: category?.icon || 'Folder',
        status: category?.status || 'active',
        keywords: category?.keywords || [],
        trackTrends: category?.trackTrends !== false,
        autoUpdate: category?.autoUpdate || false,
        priority: category?.priority || 'medium'
      });
      setHasChanges(false);
    }
  }, [category]);

  const iconOptions = [
    { value: 'Brain', label: 'Cervello (AI/ML)' },
    { value: 'Shield', label: 'Scudo (Cybersecurity)' },
    { value: 'Cloud', label: 'Cloud (Cloud Computing)' },
    { value: 'Code', label: 'Codice (Development)' },
    { value: 'Database', label: 'Database (Data)' },
    { value: 'Smartphone', label: 'Mobile (Mobile Dev)' },
    { value: 'Globe', label: 'Web (Web Tech)' },
    { value: 'Cpu', label: 'CPU (Hardware)' },
    { value: 'Network', label: 'Rete (Networking)' },
    { value: 'Folder', label: 'Cartella (Generale)' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Attiva' },
    { value: 'inactive', label: 'Inattiva' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Bassa' }
  ];

  const parentOptions = [
    { value: '', label: 'Nessun genitore (Categoria principale)' },
    ...// Prevent circular reference
    categories?.filter(cat => cat?.id !== category?.id)?.map(cat => ({
        value: cat?.id,
        label: cat?.name
      }))
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
    
    // Clear field-specific errors
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addKeyword = () => {
    if (keywordInput?.trim() && !formData?.keywords?.includes(keywordInput?.trim())) {
      handleInputChange('keywords', [...formData?.keywords, keywordInput?.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword) => {
    handleInputChange('keywords', formData?.keywords?.filter(k => k !== keyword));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    } else if (formData?.name?.length < 2) {
      newErrors.name = 'Il nome deve essere di almeno 2 caratteri';
    }

    // Check for duplicate names
    const isDuplicate = categories?.some(cat => 
      cat?.id !== category?.id && 
      cat?.name?.toLowerCase() === formData?.name?.toLowerCase()
    );
    if (isDuplicate) {
      newErrors.name = 'Esiste già una categoria con questo nome';
    }

    // Check for circular reference
    if (formData?.parentId === category?.id) {
      newErrors.parentId = 'Una categoria non può essere genitore di se stessa';
    }

    if (formData?.description && formData?.description?.length > 500) {
      newErrors.description = 'La descrizione non può superare i 500 caratteri';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...category,
        ...formData,
        id: category?.id || `cat-${Date.now()}`,
        updatedAt: new Date()?.toISOString()
      });
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('Ci sono modifiche non salvate. Vuoi davvero annullare?')) {
        onCancel();
        setHasChanges(false);
      }
    } else {
      onCancel();
    }
  };

  if (!category && !isNew) {
    return (
      <div className="h-full flex items-center justify-center text-center">
        <div>
          <Icon name="FolderOpen" size={64} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Seleziona una categoria
          </h3>
          <p className="text-text-secondary">
            Scegli una categoria dall'albero per modificarla o creane una nuova
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {isNew ? 'Nuova Categoria' : 'Modifica Categoria'}
          </h3>
          <p className="text-sm text-text-secondary">
            {isNew ? 'Crea una nuova categoria nella tassonomia IT' : `Modifica "${category?.name}"`}
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center space-x-2 text-warning">
            <Icon name="AlertCircle" size={16} />
            <span className="text-sm">Modifiche non salvate</span>
          </div>
        )}
      </div>
      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-text-primary border-b border-border pb-2">
            Informazioni Base
          </h4>
          
          <Input
            label="Nome Categoria"
            type="text"
            placeholder="es. Intelligenza Artificiale"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.name}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Icona"
              options={iconOptions}
              value={formData?.icon}
              onChange={(value) => handleInputChange('icon', value)}
            />

            <Select
              label="Stato"
              options={statusOptions}
              value={formData?.status}
              onChange={(value) => handleInputChange('status', value)}
            />
          </div>

          <Input
            label="Descrizione"
            type="text"
            placeholder="Breve descrizione della categoria..."
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            description={`${formData?.description?.length}/500 caratteri`}
            error={errors?.description}
          />
        </div>

        {/* Hierarchy */}
        <div className="space-y-4">
          <h4 className="font-medium text-text-primary border-b border-border pb-2">
            Gerarchia
          </h4>
          
          <Select
            label="Categoria Genitore"
            options={parentOptions}
            value={formData?.parentId}
            onChange={(value) => handleInputChange('parentId', value)}
            description="Seleziona una categoria genitore per creare una sottocategoria"
            error={errors?.parentId}
          />

          <Select
            label="Priorità"
            options={priorityOptions}
            value={formData?.priority}
            onChange={(value) => handleInputChange('priority', value)}
            description="Determina l'ordine di visualizzazione"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-4">
          <h4 className="font-medium text-text-primary border-b border-border pb-2">
            Parole Chiave
          </h4>
          
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Aggiungi parola chiave..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e?.target?.value)}
              onKeyPress={(e) => e?.key === 'Enter' && (e?.preventDefault(), addKeyword())}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={addKeyword}
              disabled={!keywordInput?.trim()}
              iconName="Plus"
            >
              Aggiungi
            </Button>
          </div>

          {formData?.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData?.keywords?.map((keyword, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full text-sm"
                >
                  <span>{keyword}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-4 h-4 hover:text-error"
                    onClick={() => removeKeyword(keyword)}
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-text-primary border-b border-border pb-2">
            Impostazioni
          </h4>
          
          <div className="space-y-3">
            <Checkbox
              label="Traccia Tendenze"
              description="Monitora automaticamente le tendenze per questa categoria"
              checked={formData?.trackTrends}
              onChange={(e) => handleInputChange('trackTrends', e?.target?.checked)}
            />

            <Checkbox
              label="Aggiornamento Automatico"
              description="Aggiorna automaticamente i contenuti basati su questa categoria"
              checked={formData?.autoUpdate}
              onChange={(e) => handleInputChange('autoUpdate', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Statistics (for existing categories) */}
        {!isNew && category && (
          <div className="space-y-4">
            <h4 className="font-medium text-text-primary border-b border-border pb-2">
              Statistiche
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{category?.itemCount || 0}</div>
                <div className="text-sm text-text-secondary">Elementi</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-success">{category?.searchCount || 0}</div>
                <div className="text-sm text-text-secondary">Ricerche</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-warning">{category?.trendScore || 0}</div>
                <div className="text-sm text-text-secondary">Trend Score</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-accent">{category?.subcategories?.length || 0}</div>
                <div className="text-sm text-text-secondary">Sottocategorie</div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Editor Footer */}
      <div className="border-t border-border p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            {category?.updatedAt && (
              <span>Ultimo aggiornamento: {new Date(category.updatedAt)?.toLocaleDateString('it-IT')}</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Annulla
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={!hasChanges && !isNew}
              iconName="Save"
              iconPosition="left"
            >
              {isNew ? 'Crea Categoria' : 'Salva Modifiche'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditor;