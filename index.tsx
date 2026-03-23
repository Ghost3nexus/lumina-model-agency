import React from 'react';
import ReactDOM from 'react-dom/client';
import { installGeminiProxy } from './services/geminiProxy';
import App from './App';

// Route all @google/genai SDK calls through server-side proxy
// MUST be called before any Gemini API usage
installGeminiProxy();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);