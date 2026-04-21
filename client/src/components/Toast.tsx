import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { useTheme } from '../contexts';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  exiting?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let nextId = 0;

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now() + nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 200);
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const ToastContainer: React.FC<{ toasts: Toast[] }> = ({ toasts }) => {
  const { isModern } = useTheme();

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-6 py-3 rounded-2xl shadow-2xl font-semibold text-sm pointer-events-auto ${
            toast.exiting ? 'toast-exit' : 'toast-enter'
          } ${
            toast.type === 'success'
              ? isModern
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
              : toast.type === 'error'
              ? isModern
                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                : 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
              : isModern
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
          }`}
        >
          {toast.type === 'success' && '✓ '}
          {toast.type === 'error' && '✗ '}
          {toast.type === 'info' && 'ℹ '}
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastProvider;
