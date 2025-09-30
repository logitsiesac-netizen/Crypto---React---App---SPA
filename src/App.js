//import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from "react";

function App() {
  
    const [cryptos, setCryptos] = useState([]);
    const [search, setSearch] = useState(""); 
    useEffect(() => { 
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd")
      .then((res) => res.json())
      .then((data) => setCryptos(data)) 
      .catch((error) => console.error("error al traer los datos ", error));
     }, []);

     const filteredCryptos = crypstos.filter((coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase())
  
    );

    return (
      <div>
        <h1>Lista de cryptomonedas $ </h1>
        <ul>
          {cryptos.map((coin) => (
            <li key = {coin.id}>
             {coin.name} - ${coin.current_price}            
             </li>
          ))}
    </ul>
   </div>
  );           
}

export default App;
   
//    <div className="App">
 //     <header className="App-header">
 //       <img src={logo} className="App-logo" alt="logo" />
 //       <p>
 //        React Prueba.
 //       </p>
 //       <a
  //        className="App-link"
 //         href="https://reactjs.org"
//          target="_blank"
 //         rel="noopener noreferrer"
 //       >
 //         AAAA
 //       </a>
 //     </header>
 //   </div>
 // );
//}

//export default App;
