import React, { useState, useEffect, useMemo } from 'react';

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

const globalStyles = `
  /* Variables de Color */
  :root {
    --bg-light: #ffffff;
    --text-light: #2d3748;
    --header-bg-light: #f7fafc;
    --card-bg-light: #fefefe;
    --border-light: #e2e8f0;
    --accent-color: #4c51bf;
    --positive-color: #48bb78;
    --negative-color: #f56565;
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

  /* Estilos Generales */
  .app-container {
    min-height: 100vh;
    font-family: sans-serif;
    background-color: var(--bg-light);
    color: var(--text-light);
    transition: background-color 0.3s, color 0.3s;
    padding: 0;
    margin: 0 auto;
    max-width: 1200px;
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

  .theme-toggle-button {
    padding: 12px;
    border-radius: 9999px;
    background-color: var(--accent-color);
    color: var(--bg-light);
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
  }

  .theme-toggle-button:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  }

  /* Contenido Principal y Controles */
  .main-content {
    padding: 24px;
  }

  .controls-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }
  @media (min-width: 768px) {
    .controls-grid {
      grid-template-columns: 2fr 1fr;
    }
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

  /* Indicadores de Estado */
  .status-indicator {
    text-align: center;
    padding: 40px 0;
    font-size: 20px;
    font-weight: bold;
    color: var(--accent-color);
  }
  .status-error {
    color: var(--negative-color);
  }
  .status-empty {
    color: #a0aec0;
  }

  /* Tarjetas de Cripto */
  .crypto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .crypto-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
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
            console.warn(`Error fetching data, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
    throw new Error("Failed to fetch data after all retries.");
};

// Simulación para la detección del entorno Tauri
const isTauriEnvironment = window.__TAURI__ !== undefined;

const SystemMessageBox = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'error' ? 'var(--negative-color)' : 'var(--positive-color)';
  const textColor = 'white';

  return (
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
        maxWidth: '300px'
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
          fontWeight: 'bold'
        }}
        aria-label="Cerrar mensaje"
      >
        &times;
      </button>
    </div>
  );
};


const App = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('market_cap_rank');
  const [sortOrder, setSortOrder] = useState('asc');
  const [systemMessage, setSystemMessage] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };
  
  useEffect(() => {
    setLoading(true);
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    
    fetchWithRetry(apiUrl)
      .then(data => {
        setCoins(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching cryptocurrency data:", err);
        setError("Error al cargar los datos. Intente recargar.");
        setLoading(false);
      });
  }, []);

  const filteredAndSortedCoins = useMemo(() => {
    let result = [...coins];

    // Filtro por búsqueda (Nombre o Símbolo)
    if (search) {
      const lowerCaseSearch = search.toLowerCase();
      result = result.filter(coin => 
        coin.name.toLowerCase().includes(lowerCaseSearch) || 
        coin.symbol.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Ordenar resultados
    result.sort((a, b) => {
      let comparison = 0;
      
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


  const handleExportData = async () => {
    if (!isTauriEnvironment) {
      setSystemMessage({ 
        message: "Esta función de exportación requiere la aplicación de escritorio (Tauri).",
        type: 'error'
      });
      return;
    }

    try {
      // Simulación de la llamada a la API de Tauri para guardar un archivo.
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


  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <div className="app-container">
        
        <header className="app-header">
          <h1 className="app-title">
            Criptomonedas
          </h1>
          
          <button
            onClick={toggleTheme}
            className="theme-toggle-button"
            aria-label={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            {isDarkMode ? <SunIcon size={24} /> : <MoonIcon size={24} />}
          </button>
        </header>

        <main className="main-content">
          <div className="controls-grid">
            
            <input
              type="text"
              placeholder="Buscar por nombre o símbolo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
            />
            
            <select
              value={`${sortKey}-${sortOrder}`}
              onChange={(e) => {
                const [key, order] = e.target.value.split('-');
                setSortKey(key);
                setSortOrder(order);
              }}
              className="select-field"
            >
              <option value="market_cap_rank-asc">Orden por Capitalización (Asc)</option>
              <option value="market_cap_rank-desc">Orden por Capitalización (Desc)</option>
              <option value="current_price-desc">Precio (Mayor a Menor)</option>
              <option value="current_price-asc">Precio (Menor a Mayor)</option>
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleExportData}
              disabled={!isTauriEnvironment} 
              className={`theme-toggle-button`} 
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

          <div className="crypto-grid">
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
          Tema: <strong>{isDarkMode ? 'Oscuro' : 'Claro'}</strong>
        </footer>
      </div>

      <SystemMessageBox 
        message={systemMessage?.message}
        type={systemMessage?.type}
        onClose={() => setSystemMessage(null)}
      />
    </>
  );
};

export default App;
