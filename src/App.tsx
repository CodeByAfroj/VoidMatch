import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/Layout/Navbar';
import Onboarding from './pages/Onboarding';
import DiscoveryDashboard from './pages/DiscoveryDashboard';
import TeamDashboard from './pages/TeamDashboard';
import Teams from './pages/Teams';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-background text-gray-200 selection:bg-neon-purple/30 font-sans">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/discover" element={<DiscoveryDashboard />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/team/:id" element={<TeamDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
