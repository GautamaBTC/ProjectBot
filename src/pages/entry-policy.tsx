import React from 'react';
import { createRoot } from 'react-dom/client';
import PolicyPage from './PolicyPage';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PolicyPage />
  </React.StrictMode>
);
