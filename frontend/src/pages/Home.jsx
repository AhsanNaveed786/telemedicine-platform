import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Activity } from 'lucide-react';
import api from '../api/config';

export default function Home() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/analyze-symptoms', { symptoms });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert('Error analyzing symptoms');
    } finally {
      setLoading(false);
    }
  };

  const handleFindDoctors = () => {
    if (result) {
      navigate(`/doctors?specialty=${encodeURIComponent(result.suggested_specialty)}&symptoms=${encodeURIComponent(symptoms)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="bg-white p-4 rounded-full shadow-sm mb-8">
        <Activity size={48} className="text-sky-500" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 tracking-tight">
        Find the Right Doctor <br/><span className="text-sky-500">Fast & Securely</span>
      </h1>
      <p className="text-lg text-slate-600 mb-10 max-w-2xl">
        Bataiye aapko kya masla hai? Hamara AI aapko behtareen doctor suggest karega aur aap foran video appointment book kar sakenge.
      </p>

      <form onSubmit={handleSearch} className="w-full max-w-xl relative">
        <input
          type="text"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="E.g., Mujhe 3 din se bukhar aur khansi hai..."
          className="w-full pl-6 pr-16 py-4 rounded-full border-2 border-sky-100 shadow-sm focus:border-sky-400 focus:outline-none text-lg transition-all"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 bg-sky-500 text-white rounded-full p-3 hover:bg-sky-600 transition-colors disabled:opacity-50"
        >
          {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search size={24} />}
        </button>
      </form>

      {result && (
        <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-sky-100 max-w-2xl w-full animate-fade-in-up">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Recommended Specialty:</h3>
          <p className="text-3xl font-extrabold text-sky-500 mb-4">{result.suggested_specialty}</p>
          <p className="text-slate-600 mb-8">{result.explanation}</p>
          
          <button 
            onClick={handleFindDoctors}
            className="bg-sky-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-sky-700 transition-colors shadow-md w-full sm:w-auto"
          >
            Find {result.suggested_specialty} Doctors
          </button>
        </div>
      )}
    </div>
  );
}
