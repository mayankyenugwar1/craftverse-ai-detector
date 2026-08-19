import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ROUTES } from './lib/constants';

import { Navbar } from './components/Navbar';
import { BackgroundEffects } from './components/BackgroundEffects';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';

import { LandingPage } from './pages/LandingPage';
import { DetectPage } from './pages/DetectPage';
import { HistoryPage } from './pages/HistoryPage';
import { HistoryDetailPage } from './pages/HistoryDetailPage';
import { ReportPage } from './pages/ReportPage';
import { HowItWorksPage } from './pages/HowItWorksPage';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-[#FAF6EE] selection:bg-[#E8D3A8]/20 bg-[#080808]">
      <BackgroundEffects />
      <Navbar />
      
      <main className="flex-1 flex flex-col pt-24 z-10 relative">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path={ROUTES.HOME} element={<LandingPage />} />
              <Route path={ROUTES.DETECT} element={<DetectPage />} />
              <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
              <Route path="/history/:id" element={<HistoryDetailPage />} />
              <Route path={ROUTES.REPORT} element={<ReportPage />} />
              <Route path={ROUTES.HOW_IT_WORKS} element={<HowItWorksPage />} />
            </Routes>
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
};

export default App;
