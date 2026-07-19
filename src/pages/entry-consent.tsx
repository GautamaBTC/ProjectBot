import React from 'react';
import { createRoot } from 'react-dom/client';
import ConsentPage from './ConsentPage';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConsentPage />
  </React.StrictMode>
);
