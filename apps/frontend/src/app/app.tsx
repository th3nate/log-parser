import React, { memo } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './layout/layout';
import NoMatch from './components/no-match';
import Loader from './components/loader';

const LogsView = memo(React.lazy(() => import('./pages/logs-view')));
const LogView = memo(React.lazy(() => import('./pages/log-view')));

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/logs"
            element={
              <React.Suspense fallback={<Loader />}>
                <LogsView />
              </React.Suspense>
            }
          />
          <Route
            path="/logs/log/:id"
            element={
              <React.Suspense fallback={<Loader />}>
                <LogView />
              </React.Suspense>
            }
          />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
