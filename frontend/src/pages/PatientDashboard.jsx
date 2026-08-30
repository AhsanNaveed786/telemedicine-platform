import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, isAfter, isBefore, addMinutes, subMinutes } from 'date-fns';
import { Video, Clock, CalendarCheck } from 'lucide-react';
import api from '../api/config';

export default function PatientDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await api.get(`/appointments/${id}`);
        setAppointment(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();

    // Update current time every minute
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading appointment...</div>;
  if (!appointment) return <div className="text-center py-20 text-red-500">Appointment not found</div>;

  const scheduledTime = new Date(appointment.scheduled_time);
  
  // Can join from 5 mins before until 30 mins after
  const canJoin = isAfter(now, subMinutes(scheduledTime, 5)) && isBefore(now, addMinutes(scheduledTime, 30));
  
  const handleJoin = () => {
    // Navigate to video call room, passing the meeting_link as a parameter
    navigate(`/call?link=${encodeURIComponent(appointment.meeting_link)}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-sky-100">
        <div className="bg-sky-500 p-8 text-white text-center">
          <CalendarCheck size={64} className="mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold">Appointment Confirmed</h2>
          <p className="opacity-90 mt-2">Please save this page link to access your appointment.</p>
        </div>
        
        <div className="p-8">
          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-slate-500">Patient Name</span>
              <span className="font-semibold text-slate-800">{appointment.patient_name}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-slate-500">Doctor</span>
              <span className="font-semibold text-slate-800">{appointment.doctor?.name} ({appointment.doctor?.specialty})</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-slate-500">Date & Time</span>
              <span className="font-semibold text-slate-800">{format(scheduledTime, 'PPP p')}</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 text-center">
            {canJoin ? (
              <div>
                <p className="text-green-600 font-semibold mb-4">Your appointment time is now!</p>
                <button 
                  onClick={handleJoin}
                  className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Video size={24} /> Join Video Consultation
                </button>
              </div>
            ) : isBefore(now, scheduledTime) ? (
              <div>
                <Clock size={48} className="mx-auto text-sky-400 mb-4 opacity-50" />
                <p className="text-slate-600 font-medium">Join button will appear 5 minutes before your scheduled time.</p>
                <p className="text-slate-400 text-sm mt-2">Current time: {format(now, 'p')}</p>
              </div>
            ) : (
              <div>
                <p className="text-red-500 font-medium">This appointment has ended.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
