import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Performance } from './pages/Performance';
import { RiskMetrics } from './pages/RiskMetrics';
import { Education } from './pages/Education';
import { Approach } from './pages/Approach';
import { Contact } from './pages/Contact';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/ArdhanaCapital" element={<Home />} />
          <Route path="/ArdhanaCapital/performance" element={<Performance />} />
          <Route path="/ArdhanaCapital/risk-metrics" element={<RiskMetrics />} />
          <Route path="/ArdhanaCapital/education" element={<Education />} />
          <Route path="/ArdhanaCapital/approach" element={<Approach />} />
          <Route path="/ArdhanaCapital/contact" element={<Contact />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;