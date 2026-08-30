import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DoctorSearch from './pages/DoctorSearch';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import VideoCall from './pages/VideoCall';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-sky-50 text-slate-800 font-sans">
        <header className="bg-white shadow-sm p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-sky-600">TeleMed</a>
            <nav className="flex gap-4">
              <a href="/doctor-dashboard/1" className="text-sky-700 hover:text-sky-900">Doctor Portal</a>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<DoctorSearch />} />
            <Route path="/appointment/:id" element={<PatientDashboard />} />
            <Route path="/doctor-dashboard/:id" element={<DoctorDashboard />} />
            <Route path="/call" element={<VideoCall />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
