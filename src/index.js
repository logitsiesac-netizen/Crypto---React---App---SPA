import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importa tus estilos de Tailwind
import App from './App'; // Importa el componente principal
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();


