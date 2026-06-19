import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import './i18n';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

import { ThemeProvider } from './context/ThemeContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { CompareProvider } from './context/CompareContext.jsx';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import axios from 'axios';

// Vercel Monorepo Configuration
// Intercept all /api calls and route them to the backend service prefix when in production
axios.interceptors.request.use((config) => {
  if (import.meta.env.PROD && config.url && config.url.startsWith('/api')) {
    config.url = `/_/backend${config.url}`;
  }
  return config;
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <RecentlyViewedProvider>
                  <NotificationProvider>
                    <App />
                  </NotificationProvider>
                </RecentlyViewedProvider>
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
