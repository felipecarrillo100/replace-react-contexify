import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import App from './App';
import './styles.scss';

// Demo translations
const messages: Record<string, Record<string, string>> = {
  en: {
    'menu.save': '💾 Save File',
    'menu.open': '📂 Open File',
    'menu.settings': '⚙️ Settings',
    'menu.edit': '✏️ Edit',
    'menu.copy': '📋 Copy',
    'menu.delete': '🗑️ Delete',
    'menu.export': '📤 Export',
    'menu.import': '📥 Import',
  },
  es: {
    'menu.save': '💾 Guardar Archivo',
    'menu.open': '📂 Abrir Archivo',
    'menu.settings': '⚙️ Configuración',
    'menu.edit': '✏️ Editar',
    'menu.copy': '📋 Copiar',
    'menu.delete': '🗑️ Eliminar',
    'menu.export': '📤 Exportar',
    'menu.import': '📥 Importar',
  },
  de: {
    'menu.save': '💾 Datei speichern',
    'menu.open': '📂 Datei öffnen',
    'menu.settings': '⚙️ Einstellungen',
    'menu.edit': '✏️ Bearbeiten',
    'menu.copy': '📋 Kopieren',
    'menu.delete': '🗑️ Löschen',
    'menu.export': '📤 Exportieren',
    'menu.import': '📥 Importieren',
  },
};

const supportedLocales = Object.keys(messages);

// Get browser locale or default to 'en'
const getInitialLocale = () => {
  const browserLocale = navigator.language.split('-')[0];
  return messages[browserLocale] ? browserLocale : 'en';
};

function Root() {
  const [locale, setLocale] = useState(getInitialLocale);
  
  return (
    <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="en">
      <App 
        supportedLocales={supportedLocales} 
        currentLocale={locale}
        onLocaleChange={setLocale}
      />
    </IntlProvider>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <Root />
  </StrictMode>
);

