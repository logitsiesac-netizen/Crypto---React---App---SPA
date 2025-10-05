import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';

// =================================================================
// 1. COMPONENTES SVG E ÍCONOS
// =================================================================

const SunIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m4.93 19.07 1.41-1.41" />
    <path d="m17.66 6.34 1.41-1.41" />
  </svg>
);

const MoonIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const SystemMessageBox = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'error' ? 'var(--negative-color)' : 'var(--positive-color)';
  const textColor = 'white';

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '16px 24px',
        borderRadius: '8px',
        backgroundColor: bgColor,
        color: textColor,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '300px',
        transition: 'all 0.3s ease'
      }}
    >
      <span>{message}</span>
      <button 
        onClick={onClose} 
        style={{ 
          marginLeft: '16px', 
          background: 'none', 
          border: 'none', 
          color: textColor, 
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}
        aria-label="Cerrar mensaje"
      >
        &times;
      </button>
    </div>,
    document.body
  );
};


// =================================================================
// 2. LÓGICA DE UTILIDADES
// =================================================================

const fetchWithRetry = async (url, retries = 3, initialDelay = 1000) => {
  let delay = initialDelay; 
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json(); 
    } catch (err) {
      if (i === retries - 1) {
        throw err;
      }
      // Aplicar reintento con retroceso exponencial para manejar errores de red o límites de tasa.
      console.warn(`Error al obtener datos, reintentando en ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw new Error("Failed to fetch data after all retries.");
};

const isTauriEnvironment = window.__TAURI__ !== undefined;

// =================================================================
// 3. DATOS Y COMPONENTE DEL TOUR INTERACTIVO
// =================================================================

const tourSteps = [
  {
    selector: '#app-header',
    title: '¡Bienvenido a la Crypto App!',
    content: 'Este es el panel superior de control. Aquí puedes alternar el tema (claro/oscuro), activar el alto contraste y reiniciar esta guía.',
  },
  {
    selector: '#search-input',
    title: 'Filtra tus Monedas',
    content: 'Escribe aquí el nombre o el símbolo de la criptomoneda que buscas (ej: BTC, Ethereum). La lista se actualiza automáticamente.',
  },
  {
    selector: '#sort-select',
    title: 'Define el Orden',
    content: 'Utiliza esta opción para ordenar la lista de criptomonedas según tus preferencias: por precio, ranking de capitalización o nombre.',
  },
  {
    selector: '#export-button',
    title: 'Función de Exportación',
    content: 'Si estuvieras utilizando la versión de escritorio de esta aplicación (Tauri), podrías exportar el listado actual a un archivo local de forma segura.',
  },
  {
    selector: '.crypto-grid',
    title: 'Mercado en Vivo',
    content: 'Aquí tienes un vistazo de las 100 principales criptomonedas, con datos en tiempo real como precio, rank y variación de 24 horas.',
  },
];

const TourPopover = ({ step, onNext, onSkip, isLast }) => {
  const targetElement = document.querySelector(step.selector);

  if (!targetElement) return null;

  // Calculamos la posición del popover
  const rect = targetElement.getBoundingClientRect();
  const popoverWidth = 300; 
  
  // Posicionamiento
  let leftPos = rect.right + window.scrollX + 10;
  let topPos = rect.top + window.scrollY;

  // Si no cabe a la derecha, lo ponemos debajo del elemento centrado
  if (rect.right + popoverWidth + 20 > window.innerWidth) {
      leftPos = rect.left + window.scrollX + (rect.width / 2) - (popoverWidth / 2);
      topPos = rect.bottom + window.scrollY + 10;
  }
  
  // Aseguramos que no se salga por la izquierda
  if (leftPos < 10) leftPos = 10;

  const style = {
    top: `${topPos}px`,
    left: `${leftPos}px`,
    width: `${popoverWidth}px`,
  };

  return createPortal(
    // Aumentamos el z-index a 9999 para asegurar que esté por encima de cualquier otro elemento pegajoso (sticky) como el encabezado.
    <div
      className="fixed z-[9999] p-4 max-w-sm bg-white border border-gray-200 rounded-xl shadow-2xl transition-opacity duration-300 dark:bg-gray-700 dark:border-gray-600"
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
    >
      <h3 id="tour-title" className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-2">{step.title}</h3>
      <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">{step.content}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">Paso {tourSteps.indexOf(step) + 1} de {tourSteps.length}</span>
        <div className="flex space-x-2">
          <button
            onClick={onSkip}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
            aria-label="Omitir el tour interactivo"
          >
            Omitir (Esc)
          </button>
          <button
            onClick={onNext}
            className="px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-md"
            aria-label={isLast ? 'Finalizar el tour' : 'Ir al siguiente paso'}
          >
            {isLast ? 'Finalizar' : 'Siguiente → (Enter)'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const TourComponent = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  }, [currentStep, onFinish]);

  const handleSkip = useCallback(() => {
    onFinish();
  }, [onFinish]);

  // Manejo de Atajos de Teclado para el Tour
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleSkip();
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handleSkip]);

  // Scroll y resaltado del elemento enfocado
  useEffect(() => {
    const selector = tourSteps[currentStep]?.selector;
    const element = document.querySelector(selector);
    
    // Limpiar resaltado previo
    document.querySelectorAll('[data-tour-highlighted="true"]').forEach(el => {
      el.style.outline = '';
      el.style.outlineOffset = '';
      el.style.zIndex = '';
      el.removeAttribute('data-tour-highlighted');
    });

    // Resaltar y hacer scroll al elemento actual
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.style.outline = '4px solid #f97316'; // Naranja brillante
      element.style.outlineOffset = '4px';
      element.style.transition = 'outline 0.3s ease, outline-offset 0.3s ease';
      element.style.zIndex = '9998'; // Un z-index alto, pero menor que el popover (9999)
      element.setAttribute('data-tour-highlighted', 'true');
    }
    
    // Limpieza final del resaltado
    return () => {
      if (element) {
        element.style.outline = '';
        element.style.outlineOffset = '';
        element.style.zIndex = '';
        element.removeAttribute('data-tour-highlighted');
      }
    };
  }, [currentStep]);


  return (
    <>
      {/* Overlay oscuro (z-index 9990) */}
      {createPortal(
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-70 z-[9990] transition-opacity duration-300" 
          onClick={handleSkip}
          aria-hidden="true" 
        ></div>,
        document.body
      )}
      
      {/* Popover del paso actual (z-index 9999) */}
      <TourPopover
        step={tourSteps[currentStep]}
        onNext={handleNext}
        onSkip={handleSkip}
        isLast={currentStep === tourSteps.length - 1}
      />
    </>
  );
};


// =================================================================
// 4. ESTILOS GLOBALES
// =================================================================

const globalStyles = `
  /* Variables de Color */
  :root {
    --bg-light: #ffffff;
    --text-light: #2d3748;
    --header-bg-light: #f7fafc;
    --card-bg-light: #fefefe;
    --border-light: #e2e8f0;
    --accent-color: #4c51bf; /* Indigo */
    --positive-color: #48bb78;
    --negative-color: #f56565;
    --contrast-text: #2d3748;
    --contrast-bg: #f7fafc;
  }

  .dark {
    --bg-light: #1a202c;
    --text-light: #f7fafc;
    --header-bg-light: #2d3748;
    --card-bg-light: #2d3748;
    --border-light: #4a5568;
    --accent-color: #63b3ed;
    --positive-color: #68d391;
    --negative-color: #fc8181;
  }
  
  /* --- ESTILOS DE ALTO CONTRASTE --- */
  .high-contrast {
    --bg-light: black !important;
    --text-light: #ccff00 !important; /* Neón Green */
    --header-bg-light: #111 !important;
    --card-bg-light: #333 !important;
    --border-light: #ccff00 !important;
    --accent-color: #ccff00 !important;
    --positive-color: #00ff00 !important;
    --negative-color: #ff0000 !important;
    --contrast-text: black;
    --contrast-bg: #ccff00;
  }

  .high-contrast .app-header {
    border-bottom: 2px solid var(--border-light) !important;
    box-shadow: 0 0 10px var(--border-light) !important;
  }
  
  .high-contrast .input-field, 
  .high-contrast .select-field,
  .high-contrast .crypto-card {
    border: 2px solid var(--border-light) !important;
    background-color: var(--card-bg-light) !important;
    color: var(--text-light) !important;
    box-shadow: 0 0 5px rgba(204, 255, 0, 0.5) !important;
  }

  .high-contrast h1, 
  .high-contrast h2, 
  .high-contrast h3, 
  .high-contrast p {
    color: var(--text-light) !important;
  }

  .high-contrast .theme-toggle-button,
  .high-contrast .contrast-button {
    background-color: var(--contrast-bg) !important;
    color: var(--contrast-text) !important;
    font-weight: bold !important;
  }


  /* Estilos Generales */
  .app-container {
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-light);
    color: var(--text-light);
    transition: background-color 0.3s, color 0.3s;
    padding: 0;
    margin: 0 auto;
    max-width: 1200px;
    box-shadow: 0 0 20px rgba(0,0,0,0.05);
  }

  /* Encabezado */
  .app-header {
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 20px 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    background-color: var(--header-bg-light);
    border-bottom: 1px solid var(--border-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .app-title {
    font-size: 30px;
    font-weight: 800;
    color: var(--accent-color);
  }

  .header-action-button {
    padding: 10px 18px;
    border-radius: 9999px;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .header-action-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  
  .main-content { padding: 24px; }
  .controls-grid { 
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 16px; 
    margin-bottom: 32px;
  }
  @media (min-width: 768px) {
    .controls-grid { grid-template-columns: 2fr 1fr; }
  }

  .input-field, .select-field {
    padding: 12px;
    border-radius: 12px;
    border: 1px solid var(--border-light);
    background-color: var(--card-bg-light);
    color: var(--text-light);
    transition: border-color 0.15s, box-shadow 0.15s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    width: 100%;
  }

  .input-field:focus, .select-field:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(76, 81, 191, 0.25);
  }

  .status-indicator {
    text-align: center;
    padding: 40px 0;
    font-size: 20px;
    font-weight: bold;
    color: var(--accent-color);
  }
  .status-error { color: var(--negative-color); }
  .status-empty { color: #a0aec0; }

  .crypto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }
  
  .crypto-card {
    background-color: var(--card-bg-light);
    border: 1px solid var(--border-light);
    border-radius: 16px;
    padding: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .crypto-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.2);
  }

  .coin-info {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .coin-image {
    width: 40px;
    height: 40px;
    margin-right: 12px;
    border-radius: 50%;
  }

  .coin-name {
    font-size: 18px;
    font-weight: bold;
  }

  .coin-symbol {
    font-size: 14px;
    color: #a0aec0;
    text-transform: uppercase;
  }

  .coin-price {
    font-size: 24px;
    font-weight: 800;
    color: var(--accent-color);
    margin-bottom: 12px;
  }

  .rank-text, .market-cap-text {
    font-size: 14px;
    color: var(--text-light);
  }
  
  .rank-text span, .market-cap-text span {
    font-weight: 600;
  }

  .change-text {
    font-size: 14px;
    font-weight: 600;
  }
  
  .positive {
    color: var(--positive-color);
  }

  .negative {
    color: var(--negative-color);
  }

  /* Pie de página */
  .app-footer {
    margin-top: 40px;
    padding: 16px;
    text-align: center;
    font-size: 14px;
    color: #a0aec0;
    border-top: 1px solid var(--border-light);
    background-color: var(--header-bg-light);
  }
`;


// =================================================================
// 5. COMPONENTE PRINCIPAL (APP)
// =================================================================

const App = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('market_cap_rank');
  const [sortOrder, setSortOrder] = useState('asc');
  const [systemMessage, setSystemMessage] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Cargar la preferencia de tema desde localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    // O usar la preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isHighContrast, setIsHighContrast] = useState(
    () => localStorage.getItem('highContrast') === 'true'
  );
  
  const [showTour, setShowTour] = useState(false);


  // --- Efectos de Estado ---

  useEffect(() => {
    // Aplicar clase para el tema oscuro
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  useEffect(() => {
    // Aplicar clase para el alto contraste
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', isHighContrast);
  }, [isHighContrast]);

  useEffect(() => {
    // Verificar si el tour ya fue completado
    const tourCompleted = localStorage.getItem('tourCompleted');
    if (tourCompleted !== 'true') {
      // Mostrar el tour después de un breve retraso
      const timer = setTimeout(() => setShowTour(true), 1500); 
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    
    // Usar la función con retroceso para la obtención de datos robusta
    fetchWithRetry(apiUrl)
      .then(data => {
        setCoins(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener datos de criptomonedas:", err);
        setError("Error al cargar los datos. Intente recargar.");
        setLoading(false);
      });
  }, []);


  // --- Funciones de Lógica de la Aplicación ---

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
  }, []);
  
  const toggleHighContrast = useCallback(() => {
    setIsHighContrast(prev => !prev);
  }, []);
  
  const handleTourFinish = useCallback(() => {
    // Limpiar elementos resaltados al finalizar el tour
    document.querySelectorAll('[data-tour-highlighted="true"]').forEach(el => {
      el.style.outline = '';
      el.style.outlineOffset = '';
      el.style.zIndex = '';
      el.removeAttribute('data-tour-highlighted');
    });
    localStorage.setItem('tourCompleted', 'true');
    setShowTour(false);
  }, []);

  const startTour = useCallback(() => {
    if(showTour) return; 
    setShowTour(true);
  }, [showTour]);
  
  const handleExportData = async () => {
    // Esta función solo está disponible en el entorno de escritorio Tauri simulado
    if (!isTauriEnvironment) {
      setSystemMessage({ 
        message: "Esta función de exportación requiere la aplicación de escritorio (Tauri).",
        type: 'error'
      });
      return;
    }
    try {
      console.log("Simulando exportación de datos a Tauri. Datos listos:", filteredAndSortedCoins);
      setSystemMessage({ 
        message: "¡Éxito! Datos listos para ser guardados en el sistema operativo (simulado).", 
        type: 'success' 
      });
    } catch (err) {
      console.error("Error en la operación de Tauri (simulada):", err);
      setSystemMessage({ 
        message: "Error al intentar exportar los datos al archivo local. Revise la consola.", 
        type: 'error' 
      });
    }
  };


  // --- Lógica de Filtro y Ordenamiento ---
  const filteredAndSortedCoins = useMemo(() => {
    let result = [...coins];

    if (search) {
      const lowerCaseSearch = search.toLowerCase();
      // Filtrar por nombre o símbolo
      result = result.filter(coin => 
        coin.name.toLowerCase().includes(lowerCaseSearch) || 
        coin.symbol.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Ordenar los resultados
    result.sort((a, b) => {
      let comparison = 0;
      // Usar -Infinity para asegurar que los nulos o indefinidos se muevan al final en orden ascendente
      const valA = a[sortKey] ?? (sortKey === 'name' ? '' : -Infinity);
      const valB = b[sortKey] ?? (sortKey === 'name' ? '' : -Infinity);

      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }
      return sortOrder === 'desc' ? comparison * -1 : comparison;
    });

    return result;
  }, [coins, search, sortKey, sortOrder]);


  // --- Atajos de Teclado Globales ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 't': // Ctrl + T para iniciar el Tour
            event.preventDefault();
            startTour();
            break;
          case 'a': // Ctrl + A para Alto Contraste
            event.preventDefault();
            toggleHighContrast();
            break;
          case 'd': // Ctrl + D para Tema Oscuro
            event.preventDefault();
            toggleTheme();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startTour, toggleHighContrast, toggleTheme]);
  

  return (
    <>
      {/* Inyectar estilos globales */}
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <div className="app-container">
        
        {/* Encabezado */}
        <header id="app-header" className="app-header">
          <h1 className="app-title">
            Criptomonedas
          </h1>
          
          <div className="flex items-center space-x-4">
            
            {/* Botón Alto Contraste */}
            <button
              onClick={toggleHighContrast}
              className="header-action-button contrast-button"
              style={{
                  backgroundColor: isHighContrast ? 'var(--contrast-bg)' : '#e0f2fe',
                  color: isHighContrast ? 'var(--contrast-text)' : '#0f172a'
              }}
              aria-label={`Activar o desactivar modo de alto contraste (Atajo: Ctrl + A). Estado actual: ${isHighContrast ? 'Activado' : 'Desactivado'}`}
            >
              Alto Contraste (Ctrl+A)
            </button>
            
            {/* Botón Iniciar Tour */}
            <button
              onClick={startTour}
              className="header-action-button"
              style={{
                  backgroundColor: '#f97316',
                  color: 'white',
              }}
              aria-label="Iniciar guía interactiva (Atajo: Ctrl + T)"
            >
              Iniciar Tour (Ctrl+T)
            </button>

            {/* Botón Tema Oscuro/Claro */}
            <button
              onClick={toggleTheme}
              className="header-action-button"
              style={{
                backgroundColor: isDarkMode ? 'var(--accent-color)' : '#9ca3af',
                color: 'white',
                borderRadius: '9999px',
                padding: '12px'
              }}
              aria-label={isDarkMode ? 'Cambiar a Modo Claro (Atajo: Ctrl+D)' : 'Cambiar a Modo Oscuro (Atajo: Ctrl+D)'}
            >
              {isDarkMode ? <SunIcon size={24} /> : <MoonIcon size={24} />}
            </button>
            
          </div>
        </header>

        <main className="main-content">
          <div className="controls-grid">
            
            <input
              id="search-input"
              type="text"
              placeholder="Buscar por nombre o símbolo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              aria-label="Campo de búsqueda de criptomonedas"
            />
            
            <select
              id="sort-select"
              value={`${sortKey}-${sortOrder}`}
              onChange={(e) => {
                const [key, order] = e.target.value.split('-');
                setSortKey(key);
                setSortOrder(order);
              }}
              className="select-field"
              aria-label="Opciones de ordenamiento de la lista de criptomonedas"
            >
              <option value="market_cap_rank-asc">Rank por Capitalización (Asc)</option>
              <option value="market_cap_rank-desc">Rank por Capitalización (Desc)</option>
              <option value="current_price-desc">Precio (Mayor a Menor)</option>
              <option value="current_price-asc">Precio (Menor a Mayor)</option>
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
            </select>
          </div>

          <div>
            <button
              id="export-button"
              onClick={handleExportData}
              disabled={!isTauriEnvironment} 
              className={`header-action-button`} 
              style={{ 
                backgroundColor: isTauriEnvironment ? 'var(--positive-color)' : 'var(--border-light)', 
                color: isTauriEnvironment ? 'white' : 'var(--text-light)',
                cursor: isTauriEnvironment ? 'pointer' : 'not-allowed',
                width: '100%',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s'
              }}
              aria-label={`Exportar datos a archivo local. ${isTauriEnvironment ? 'Función disponible.' : 'Requiere entorno de escritorio.'}`}
            >
              {isTauriEnvironment ? 'Exportar a Archivo JSON (Tauri)' : 'Exportar (Solo en Escritorio)'}
            </button>
            {!isTauriEnvironment && (
              <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--negative-color)', textAlign: 'center' }}>
                Esta función requiere la aplicación de escritorio.
              </p>
            )}
          </div>

          {loading && (
            <div className="status-indicator">
              Cargando datos de criptomonedas...
            </div>
          )}
          {error && (
            <div className="status-indicator status-error">
              {error}
            </div>
          )}
          {!loading && filteredAndSortedCoins.length === 0 && !error && (
            <div className="status-indicator status-empty">
              No se encontraron criptomonedas que coincidan con la búsqueda.
            </div>
          )}

          <div id="main-content" className="crypto-grid">
            {filteredAndSortedCoins.map(coin => (
              <div 
                key={coin.id} 
                className="crypto-card"
              >
                <div className="coin-info">
                  <img src={coin.image} alt={coin.name} className="coin-image"/>
                  <div>
                    <h3 className="coin-name">{coin.name}</h3>
                    <p className="coin-symbol">{coin.symbol}</p>
                  </div>
                </div>

                <div className="coin-price">
                  ${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>

                <div>
                  <p className="rank-text">
                    <span>Rank:</span> #{coin.market_cap_rank}
                  </p>
                  <p className={`change-text ${coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`}>
                    Cambio 24h: {coin.price_change_percentage_24h?.toFixed(2)}%
                  </p>
                  <p className="market-cap-text">
                    <span>Cap. Mercado:</span> ${coin.market_cap?.toLocaleString('en-US')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="app-footer">
          Tema: <strong>{isDarkMode ? 'Oscuro' : 'Claro'}</strong> | Contraste: <strong>{isHighContrast ? 'Activado' : 'Desactivado'}</strong>
        </footer>
      </div>

      <SystemMessageBox 
        message={systemMessage?.message}
        type={systemMessage?.type}
        onClose={() => setSystemMessage(null)}
      />
      
      {/* Renderiza el Tour solo si está activo */}
      {showTour && <TourComponent onFinish={handleTourFinish} />}
    </>
  );
};

export default App;

