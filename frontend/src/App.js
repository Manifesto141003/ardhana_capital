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
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/risk-metrics" element={<RiskMetrics />} />
          <Route path="/education" element={<Education />} />
          <Route path="/approach" element={<Approach />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;