import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DialogProvider } from './components/Dialog';
import './styles/app.css';
import './styles/resume.css';
import './styles/print.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DialogProvider>
      <App />
    </DialogProvider>
  </React.StrictMode>
);
