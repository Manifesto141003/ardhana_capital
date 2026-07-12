import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Performance } from './pages/Performance';
import { RiskMetrics } from './pages/RiskMetrics';
import { Education } from './pages/Education';
import { Approach } from './pages/Approach';
import { FAQ } from './pages/FAQ';
import { FAQPerformanceMethodology } from './pages/FAQPerformanceMethodology';
import { FAQRiskManagement } from './pages/FAQRiskManagement';
import { FAQLiquidityWithdrawal } from './pages/FAQLiquidityWithdrawal';
import { FAQFees } from './pages/FAQFees';
import { FAQTransparencyReporting } from './pages/FAQTransparencyReporting';
import { FAQLegalStructure } from './pages/FAQLegalStructure';
import { FAQOnboardingGeneral } from './pages/FAQOnboardingGeneral';
import { Contact } from './pages/Contact';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/risk-metrics" element={<RiskMetrics />} />
          <Route path="/education" element={<Education />} />
          <Route path="/approach" element={<Approach />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/faq/performance-methodology" element={<FAQPerformanceMethodology />} />
          <Route path="/faq/risk-management" element={<FAQRiskManagement />} />
          <Route path="/faq/liquidity-withdrawal" element={<FAQLiquidityWithdrawal />} />
          <Route path="/faq/fees" element={<FAQFees />} />
          <Route path="/faq/transparency-reporting" element={<FAQTransparencyReporting />} />
          <Route path="/faq/legal-structure" element={<FAQLegalStructure />} />
          <Route path="/faq/onboarding-general" element={<FAQOnboardingGeneral />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;