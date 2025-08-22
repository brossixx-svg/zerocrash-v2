import React from 'react';
import Icon from '../../../components/AppIcon';

const AuthFooter = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Termini di Servizio', href: '#' },
    { label: 'Supporto', href: '#' },
    { label: 'Contatti', href: '#' }
  ];

  return (
    <footer className="relative z-10 mt-8 text-center">
      {/* Links */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
        {footerLinks?.map((link, index) => (
          <React.Fragment key={link?.label}>
            <a
              href={link?.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {link?.label}
            </a>
            {index < footerLinks?.length - 1 && (
              <span className="text-text-secondary">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Copyright */}
      <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
        <Icon name="Copyright" size={14} />
        <span>{currentYear} ZeroCrash. Tutti i diritti riservati.</span>
      </div>
      {/* Security Badge */}
      <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-text-secondary">
        <Icon name="Shield" size={14} className="text-success" />
        <span>Connessione sicura SSL</span>
        <span>•</span>
        <Icon name="Lock" size={14} className="text-success" />
        <span>Dati protetti GDPR</span>
      </div>
      {/* Version Info */}
      <div className="mt-2 text-xs text-text-secondary opacity-60">
        v2.1.0 - Aggiornato Agosto 2025
      </div>
    </footer>
  );
};

export default AuthFooter;