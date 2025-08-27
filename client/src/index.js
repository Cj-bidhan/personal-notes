//this is the react/CRA entry point, which imports global CSS and ensures the last-used theme/accent is applied before react mounts.

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import './styles/theme.css';
import App from './App';

// Ensure persisted theme & accent are applied immediately
(function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const savedAccent = localStorage.getItem('accent') || 'teal';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('data-accent', savedAccent);
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
