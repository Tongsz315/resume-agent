import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, HistoryProvider, LocaleProvider } from './contexts';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <HistoryProvider>
        <LocaleProvider>
          <App />
        </LocaleProvider>
      </HistoryProvider>
    </ThemeProvider>
  </React.StrictMode>
);