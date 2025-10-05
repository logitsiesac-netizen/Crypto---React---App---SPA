import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
=======
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
>>>>>>> develop
