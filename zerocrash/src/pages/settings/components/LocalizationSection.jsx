import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const LocalizationSection = ({ onSettingsChange }) => {
  const [localization, setLocalization] = useState({
    language: 'it',
    region: 'IT',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '24h',
    numberFormat: 'european',
    currency: 'EUR',
    timezone: 'Europe/Rome',
    compliance: {
      gdpr: true,
      cookieConsent: true,
      dataRetention: 90
    }
  });

  const languageOptions = [
    { value: 'it', label: 'Italiano', flag: '🇮🇹' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  const regionOptions = [
    { value: 'IT', label: 'Italia' },
    { value: 'US', label: 'Stati Uniti' },
    { value: 'GB', label: 'Regno Unito' },
    { value: 'FR', label: 'Francia' },
    { value: 'DE', label: 'Germania' },
    { value: 'ES', label: 'Spagna' }
  ];

  const dateFormatOptions = [
    { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY (31/12/2024)' },
    { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY (12/31/2024)' },
    { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD (2024-12-31)' },
    { value: 'dd.mm.yyyy', label: 'DD.MM.YYYY (31.12.2024)' }
  ];

  const timeFormatOptions = [
    { value: '24h', label: '24 ore (14:30)' },
    { value: '12h', label: '12 ore (2:30 PM)' }
  ];

  const numberFormatOptions = [
    { value: 'european', label: 'Europeo (1.234,56)' },
    { value: 'american', label: 'Americano (1,234.56)' },
    { value: 'indian', label: 'Indiano (1,23,456.78)' }
  ];

  const currencyOptions = [
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'USD', label: 'Dollaro US ($)' },
    { value: 'GBP', label: 'Sterlina (£)' },
    { value: 'JPY', label: 'Yen (¥)' }
  ];

  const timezoneOptions = [
    { value: 'Europe/Rome', label: 'Europa/Roma (CET/CEST)' },
    { value: 'Europe/London', label: 'Europa/Londra (GMT/BST)' },
    { value: 'America/New_York', label: 'America/New York (EST/EDT)' },
    { value: 'America/Los_Angeles', label: 'America/Los Angeles (PST/PDT)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' }
  ];

  const handleLocalizationChange = (field, value, subfield = null) => {
    if (subfield) {
      setLocalization(prev => ({
        ...prev,
        [field]: {
          ...prev?.[field],
          [subfield]: value
        }
      }));
    } else {
      setLocalization(prev => ({
        ...prev,
        [field]: value
      }));
    }
    onSettingsChange?.();
  };

  const previewFormat = () => {
    const now = new Date();
    const dateFormatted = now?.toLocaleDateString('it-IT');
    const timeFormatted = localization?.timeFormat === '24h' ? now?.toLocaleTimeString('it-IT', { hour12: false })
      : now?.toLocaleTimeString('it-IT', { hour12: true });
    
    return {
      date: dateFormatted,
      time: timeFormatted,
      number: (1234.56)?.toLocaleString('it-IT'),
      currency: new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: localization?.currency
      })?.format(1234.56)
    };
  };

  const downloadLanguagePack = (lang) => {
    // Mock language pack download
    alert(`Download language pack per ${languageOptions?.find(l => l?.value === lang)?.label} - Funzionalità da implementare`);
  };

  const exportUserData = () => {
    // Mock GDPR data export
    alert('Export dei dati utente avviato - Riceverai un file con tutti i tuoi dati');
  };

  const deleteUserData = () => {
    const confirm = window.confirm(
      'Sei sicuro di voler eliminare tutti i tuoi dati? Questa azione non è reversibile e comporterà la cancellazione completa del tuo account.'
    );
    if (confirm) {
      alert('Richiesta eliminazione dati inviata - Verrai contattato per confermare');
    }
  };

  const preview = previewFormat();

  return (
    <div className="space-y-8">
      {/* Language & Region */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Lingua e Regione
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Select
              label="Lingua Interfaccia"
              value={localization?.language}
              onChange={(value) => handleLocalizationChange('language', value)}
              options={languageOptions?.map(lang => ({
                ...lang,
                label: `${lang?.flag} ${lang?.label}`
              }))}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadLanguagePack(localization?.language)}
              iconName="Download"
              iconPosition="left"
            >
              Scarica Pacchetto Lingua
            </Button>
          </div>
          <Select
            label="Regione"
            value={localization?.region}
            onChange={(value) => handleLocalizationChange('region', value)}
            options={regionOptions}
            description="Influenza formati locali e contenuti geo-specifici"
          />
        </div>
      </div>

      {/* Date & Time Formats */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Formati Data e Ora
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Formato Data"
            value={localization?.dateFormat}
            onChange={(value) => handleLocalizationChange('dateFormat', value)}
            options={dateFormatOptions}
          />
          <Select
            label="Formato Ora"
            value={localization?.timeFormat}
            onChange={(value) => handleLocalizationChange('timeFormat', value)}
            options={timeFormatOptions}
          />
          <Select
            label="Fuso Orario"
            value={localization?.timezone}
            onChange={(value) => handleLocalizationChange('timezone', value)}
            options={timezoneOptions}
          />
        </div>
      </div>

      {/* Number & Currency Formats */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Formati Numerici e Valuta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Formato Numeri"
            value={localization?.numberFormat}
            onChange={(value) => handleLocalizationChange('numberFormat', value)}
            options={numberFormatOptions}
          />
          <Select
            label="Valuta Predefinita"
            value={localization?.currency}
            onChange={(value) => handleLocalizationChange('currency', value)}
            options={currencyOptions}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Anteprima Formati
        </h3>
        <div className="bg-accent/5 border border-accent/10 rounded-lg p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-text-secondary block">Data:</span>
              <span className="font-medium text-text-primary">{preview?.date}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Ora:</span>
              <span className="font-medium text-text-primary">{preview?.time}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Numero:</span>
              <span className="font-medium text-text-primary">{preview?.number}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Valuta:</span>
              <span className="font-medium text-text-primary">{preview?.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Compliance */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Conformità Regionale
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="gdpr-compliance"
              checked={localization?.compliance?.gdpr}
              onChange={(e) => handleLocalizationChange('compliance', e?.target?.checked, 'gdpr')}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label htmlFor="gdpr-compliance" className="text-sm font-medium text-text-primary">
              Abilita conformità GDPR (Regolamento Generale sulla Protezione dei Dati)
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="cookie-consent"
              checked={localization?.compliance?.cookieConsent}
              onChange={(e) => handleLocalizationChange('compliance', e?.target?.checked, 'cookieConsent')}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label htmlFor="cookie-consent" className="text-sm font-medium text-text-primary">
              Richiedi consenso per i cookie
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Periodo Ritenzione Dati (giorni)
              </label>
              <select
                value={localization?.compliance?.dataRetention}
                onChange={(e) => handleLocalizationChange('compliance', parseInt(e?.target?.value), 'dataRetention')}
                className="flex h-10 w-full rounded-md border border-input bg-white text-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value={30}>30 giorni</option>
                <option value={90}>90 giorni</option>
                <option value={365}>1 anno</option>
                <option value={1095}>3 anni</option>
              </select>
              <p className="text-xs text-text-secondary">
                Tempo di conservazione dei dati utente prima della cancellazione automatica
              </p>
            </div>
          </div>

          {localization?.compliance?.gdpr && (
            <div className="bg-info/5 border border-info/20 rounded-lg p-4">
              <h4 className="font-medium text-text-primary mb-3">Diritti GDPR</h4>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportUserData}
                  iconName="Download"
                  iconPosition="left"
                >
                  Esporta I Miei Dati
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                  iconPosition="left"
                >
                  Modifica Consensi
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteUserData}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Elimina Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Settings Summary */}
      <div className="bg-accent/5 border border-accent/10 rounded-lg p-6">
        <h4 className="font-medium text-text-primary mb-4">Riepilogo Localizzazione</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Lingua:</span>
            <span className="ml-2 font-medium text-text-primary">
              {languageOptions?.find(opt => opt?.value === localization?.language)?.label}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Regione:</span>
            <span className="ml-2 font-medium text-text-primary">
              {regionOptions?.find(opt => opt?.value === localization?.region)?.label}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Formato data:</span>
            <span className="ml-2 font-medium text-text-primary">
              {localization?.dateFormat?.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Formato ora:</span>
            <span className="ml-2 font-medium text-text-primary">
              {localization?.timeFormat === '24h' ? '24 ore' : '12 ore'}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Valuta:</span>
            <span className="ml-2 font-medium text-text-primary">
              {currencyOptions?.find(opt => opt?.value === localization?.currency)?.label}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">GDPR:</span>
            <span className="ml-2 font-medium text-text-primary">
              {localization?.compliance?.gdpr ? 'Attivo' : 'Disattivo'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalizationSection;