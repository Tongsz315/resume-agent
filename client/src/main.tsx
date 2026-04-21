import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, HistoryProvider, LocaleProvider } from './contexts';
import { ToastProvider } from './components';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <HistoryProvider>
        <LocaleProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </LocaleProvider>
      </HistoryProvider>
    </ThemeProvider>
  </React.StrictMode>
);
