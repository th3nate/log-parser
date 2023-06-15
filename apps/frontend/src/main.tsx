import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import LoadingProvider from './app/providers/loading.provider';
import TitleProvider from './app/providers/title.provider';
import { injectStyle } from 'react-toastify/dist/inject-style';

injectStyle();
const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement!);

root.render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <TitleProvider>
          <App />
        </TitleProvider>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>
);
