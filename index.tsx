import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initDB } from './services/db';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Initialize SQLite DB then render
initDB()
  .then(() => {
    console.log("Database initialized");
    renderApp();
  })
  .catch((err) => {
    console.error("Failed to init DB", err);
    // Render anyway, potentially with error state or empty
    renderApp(); 
  });
