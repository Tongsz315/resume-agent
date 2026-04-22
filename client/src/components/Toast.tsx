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

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 200);
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
  const { isDark } = useTheme();

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-5 py-2.5 rounded-full shadow-lg text-sm font-medium pointer-events-auto ${
            toast.exiting ? 'toast-exit' : 'toast-enter'
          } ${
            toast.type === 'success'
              ? isDark ? 'bg-[#30d158] text-white' : 'bg-[#34c759] text-white'
              : toast.type === 'error'
              ? isDark ? 'bg-[#ff453a] text-white' : 'bg-[#ff3b30] text-white'
              : isDark ? 'bg-[#2997ff] text-white' : 'bg-[#0071e3] text-white'
          }`}
        >
          {toast.type === 'success' && '✓ '}{toast.type === 'error' && '✗ '}{toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastProvider;
