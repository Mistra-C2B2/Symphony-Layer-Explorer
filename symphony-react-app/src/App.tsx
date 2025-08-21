import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import LayerListPage from './pages/LayerListPage';
import LayerDetailPage from './pages/LayerDetailPage';
import DatasetTablePage from './pages/DatasetTablePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 flex flex-col">
        <Header />
        <HeroSection />
        <main className="flex-1 animate-fade-in">
          <Routes>
            <Route path="/" element={<LayerListPage />} />
            <Route path="/layer/:layerName" element={<LayerDetailPage />} />
            <Route path="/layer/:layerName/parameter/:parameterLabel" element={<DatasetTablePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;