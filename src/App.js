import { useState, useEffect } from "react";
import './index.css';

function App() {

    //guardo monedas
    const [cryptos, setCryptos] = useState([]);
    //hace busqueda
    const [search, setSearch] = useState(""); 

    // **Criterio de ordenamiento **
    const [sortKey, setSortKey] = useState("market_cap"); 
     // Ordenamiento de manera ascendente ( requerimiento ) **
    const [sortDirection, setSortDirection] = useState("desc"); 

    const [darkMode, setDarkMode] = useState(() => {
  // Al iniciar, verifica si hay preferencia guardada
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) return savedTheme === "dark";
  // Si no hay preferencia, usar el tema del sistema
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
});

    //boton darkmoderm

       useEffect(() => {
  document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);



    //llamar los datos de la API 
      useEffect(() => { 
      fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd")
      .then((res) => res.json())
      .then((data) => setCryptos(data)) 
      .catch((error) => console.error("error al traer los datos ", error));
      }, []);


      // ** Combio de dirección **
      const toggleSortDirection = () => {
       setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    };


     // Filtro de busqueda con palabras y/o letra **
     const filteredCryptos = cryptos.filter((coin) =>
     coin.name.toLowerCase().includes(search.toLowerCase())

     );

        const sortedCryptos = filteredCryptos.sort((a, b) => {
         let valueA = a[sortKey];
         let valueB = b[sortKey];

         // Odenamiento alfanumerico**
       if (sortKey === 'name'){
           valueA = a.name.toLowerCase();
           valueB = b.name.toLowerCase(); // CORREGIDO: vlaueB -> valueB
       }

        if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1; // CORREGIDO: sarDirection -> sortDirection
        }
        if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
        })

  return (

       <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
       <div className="max-w-6xl mx-auto">

         {/* Encabezado y switch */}
        <div className="relative mb-10">
          <h1 className="text-center text-4xl font-bold">Criptomonedas</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute right-0 top-0 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white shadow-md"
           >
          {darkMode ? "🌙 " : "☀️"}
         </button>
         </div>

      {/* Controles de Filtrado y Ordenamiento */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
         {/* busqueda */}
       <input
         type="text"
         placeholder="Buscar moneda..."
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         className="flex-grow p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline--none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
        /> {/* CORREGIDO: Se eliminó el `}` extra aquí */}

         {/*crioterio de ordenamiento**/}
         <select 
             value={sortKey}
             onChange={(e) => setSortKey(e.target.value)}
             className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 w-full md:w-auto"
             >
                 <option value="market_cap">Ordenar por Capitalizacion</option>
                <option value="current_price">Ordenar por Precio</option>
                 <option value="name">Ordenar por Nombre</option>
                 </select>

                 {/* **DIRECCIONAL** */}
                <button
                   onClick={toggleSortDirection}
                   className="p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition-colors w-full md:w-auto"
                  >
                 {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
         </button>
         </div> 

         {/* Lista de crypto */}
         {sortedCryptos.length === 0 ? (
         <p className="text-center text-gray-500 dark:text-gray-400">No se encontraron resultados</p>
         ) : (
         <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
           {/**acá se mapea 'sortedCrytos' y reemplaza ' filteredCryptos'*/}
           {sortedCryptos.map((coin) => (
                 <li
                 key={coin.id}
                 className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow hover:shadow-lg transition "
                 >
                   <div className="flex items-center space-x-4">
                   <img
                  src={coin.image} 
                  alt={coin.name} 
                  className="w-16 h-16 sm:w-16 sm:h-12 rounded-full object-contain"
                   />
                  <div>
                   <p className="font-semibold">{coin.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                     ${coin.current_price.toLocaleString()}
                    </p>
                   </div>
                 </div>
               </li>
             ))}
           </ul>
         )}
        </div>
        </div>  
 );
}

export default App;
