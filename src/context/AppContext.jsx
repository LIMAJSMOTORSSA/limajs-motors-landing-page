// src/context/AppContext.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

// Création du contexte
const AppContext = createContext();

// Clé de stockage du choix de thème de l'utilisateur.
const THEME_STORAGE_KEY = 'limajs-theme';

// Hook personnalisé pour utiliser le contexte
export const useAppContext = () => useContext(AppContext);

// Fournisseur du contexte
export const AppProvider = ({ children }) => {
  // État pour le thème (clair/sombre)
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // État pour la langue (français par défaut, préparation pour créole et anglais)
  const [language, setLanguage] = useState('fr');
  
  // État pour le menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // État pour suivre le scroll
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // État pour l'en-tête réduit après défilement
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  
  // Gestionnaire de défilement
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setIsHeaderCompact(position > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  /**
   * Thème : le mode clair est le défaut. Le mode sombre ne s'active que si
   * l'utilisateur l'a choisi explicitement via le bouton, et ce choix est
   * conservé d'une visite à l'autre. La préférence système n'est
   * volontairement pas suivie : elle imposait le thème sombre à des
   * visiteurs qui ne l'avaient pas demandé pour ce site.
   */
  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      // localStorage indisponible (navigation privée, cookies bloqués) :
      // on reste simplement sur le thème clair.
    }

    const useDark = stored === 'dark';
    setIsDarkMode(useDark);
    document.documentElement.classList.toggle('dark', useDark);
  }, []);

  // Fonction pour basculer le mode sombre manuellement
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      document.documentElement.classList.toggle('dark', newValue);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newValue ? 'dark' : 'light');
      } catch {
        // Si le stockage est indisponible, le choix ne vaut que pour la session.
      }
      return newValue;
    });
  };
  
  // Fonction pour changer la langue
  const changeLanguage = (lang) => {
    if (['fr', 'ht', 'en'].includes(lang)) {
      setLanguage(lang);
      // Ici, vous pourriez également sauvegarder la préférence dans localStorage
      localStorage.setItem('limajs-language', lang);
    }
  };
  
  // Fonction pour ouvrir/fermer le menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
    // Bloquer le défilement du corps lorsque le menu est ouvert
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };
  
  // Fonction pour fermer le menu mobile
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  // Récupérer les traductions en fonction de la langue
  const [translations, setTranslations] = useState({});
  
  useEffect(() => {
    // Chargement conditionnel des traductions
    const loadTranslations = async () => {
      try {
        // Dans un projet réel, vous importeriez les traductions ici
        // Exemple simple pour la démo
        const translations = {
          fr: {
            home: 'Accueil',
            services: 'Services',
            about: 'À propos',
            invest: 'Investir',
            contact: 'Contact',
            // Autres traductions...
          },
          ht: {
            home: 'Akèy',
            services: 'Sèvis',
            about: 'Apropo',
            invest: 'Envesti',
            contact: 'Kontakte',
            // Autres traductions...
          },
          en: {
            home: 'Home',
            services: 'Services',
            about: 'About',
            invest: 'Invest',
            contact: 'Contact',
            // Autres traductions...
          }
        };
        
        setTranslations(translations[language] || translations.fr);
      } catch (error) {
        console.error('Erreur lors du chargement des traductions:', error);
      }
    };
    
    loadTranslations();
  }, [language]);
  
  // Fonction pour traduire une clé
  const t = (key) => {
    return translations[key] || key;
  };
  
  // Valeurs du contexte à exposer
  const contextValue = {
    isDarkMode,
    toggleDarkMode,
    language,
    changeLanguage,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    scrollPosition,
    isHeaderCompact,
    t,
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Exemple d'utilisation:
 * 
 * import { useAppContext } from '../context/AppContext';
 * 
 * const Component = () => {
 *   const { isDarkMode, toggleDarkMode, t } = useAppContext();
 *   
 *   return (
 *     <div>
 *       <button onClick={toggleDarkMode}>
 *         {isDarkMode ? 'Mode clair' : 'Mode sombre'}
 *       </button>
 *       <h1>{t('home')}</h1>
 *     </div>
 *   );
 * };
 */
