import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageShell } from './components/layout/PageShell';
import { Overview } from './pages/Overview';
import { TotalOrders } from './pages/TotalOrders';
import { SalesReport } from './pages/SalesReport';
import { Settings } from './pages/Settings';
import { DateRangeProvider } from './context/DateRangeContext';

function App() {
  return (
    <DateRangeProvider>
      <BrowserRouter>
      <Routes>
        <Route element={<PageShell />}>
          <Route path="/" element={<Overview />} />
          <Route path="/orders" element={<TotalOrders />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </DateRangeProvider>
  );
}

export default App;
