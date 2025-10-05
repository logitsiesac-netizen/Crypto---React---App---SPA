import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// *******************************************************************
// * IMPORTACIONES Y USOS DE CHAKRA UI ELIMINADOS PARA USAR SOLO TAILWIND *
// *******************************************************************

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Montamos directamente el componente App, que usa Tailwind */}
    <App />
  </React.StrictMode>
);