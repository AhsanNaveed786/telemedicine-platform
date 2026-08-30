import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserCircle2, Calendar, Clock } from 'lucide-react';
import api from '../api/config';

export default function DoctorSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const specialty = searchParams.get('specialty');
  const symptoms = searchParams.get('symptoms');

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Booking form state
  const [patientName, setPatientName] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get(`/doctors${specialty ? `?specialty=${specialty}` : ''}`);
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [specialty]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !patientName || !bookingTime) return;

    try {
      const res = await api.post('/appointments', {
        patient_name: patientName,
        patient_symptoms: symptoms || 'Routine checkup',
        doctor_id: selectedDoctor.id,
        scheduled_time: new Date(bookingTime).toISOString()
      });
      
      // Navigate to patient dashboard for this appointment
      navigate(`/appointment/${res.data.id}`);
    } catch (error) {
      console.error(error);
      alert('Failed to book appointment');
    }
  };

  if (loading) return <div className="text-center py-20">Loading doctors...</div>;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800">
          {specialty ? `${specialty}s` : 'Available Doctors'}
        </h2>
        {doctors.length === 0 ? (
          <p className="text-slate-500">No doctors found for this specialty.</p>
        ) : (
          <div className="space-y-4">
            {doctors.map(doc => (
              <div 
                key={doc.id} 
                onClick={() => setSelectedDoctor(doc)}
                className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${
                  selectedDoctor?.id === doc.id ? 'border-sky-500 bg-sky-50' : 'border-transparent bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-3 rounded-full text-slate-400">
                    <UserCircle2 size={48} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{doc.name}</h3>
                    <p className="text-sky-600 font-medium">{doc.specialty}</p>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{doc.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {selectedDoctor ? (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-sky-100 sticky top-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Book Appointment</h3>
            <p className="text-slate-600 mb-6">You are booking a 30-minute video consultation with <strong className="text-slate-800">{selectedDoctor.name}</strong>.</p>
            
            <form onSubmit={handleBook} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:outline-none"
                  placeholder="Ali Khan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                <input 
                  type="datetime-local" 
                  required
                  value={bookingTime}
                  onChange={e => setBookingTime(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-sky-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-sky-700 transition-colors shadow-md"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-slate-50 p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 h-full flex flex-col justify-center items-center">
            <Calendar size={48} className="mb-4 opacity-50" />
            <p>Select a doctor from the list to book an appointment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
