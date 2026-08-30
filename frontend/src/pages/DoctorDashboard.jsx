import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, isAfter, isBefore, addMinutes, subMinutes } from 'date-fns';
import { Video, Clock, Users } from 'lucide-react';
import api from '../api/config';

export default function DoctorDashboard() {
  const { id } = useParams(); // Doctor ID
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get(`/doctors/${id}/appointments`);
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();

    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading schedule...</div>;

  const handleJoin = (link) => {
    navigate(`/call?link=${encodeURIComponent(link)}`);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-sky-100 p-4 rounded-full text-sky-600">
          <Users size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Doctor Portal</h2>
          <p className="text-slate-500">Manage your appointments and consultations</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-sky-100 overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No appointments scheduled yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointments.map(apt => {
              const scheduledTime = new Date(apt.scheduled_time);
              const canJoin = isAfter(now, subMinutes(scheduledTime, 5)) && isBefore(now, addMinutes(scheduledTime, 30));
              const isPast = isBefore(addMinutes(scheduledTime, 30), now);

              return (
                <div key={apt.id} className={`p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors ${canJoin ? 'bg-sky-50/50' : ''}`}>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{apt.patient_name}</h3>
                    <p className="text-slate-600 mt-1"><span className="font-semibold text-slate-500">Symptoms:</span> {apt.patient_symptoms}</p>
                    <div className="flex items-center gap-2 mt-2 text-sky-600 font-medium">
                      <Clock size={16} />
                      {format(scheduledTime, 'PPP p')}
                    </div>
                  </div>

                  <div className="min-w-[200px]">
                    {canJoin ? (
                      <button 
                        onClick={() => handleJoin(apt.meeting_link)}
                        className="w-full bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        <Video size={20} /> Join Call
                      </button>
                    ) : isPast ? (
                      <div className="text-slate-400 font-medium text-center bg-slate-50 py-3 rounded-xl">
                        Completed
                      </div>
                    ) : (
                      <div className="text-slate-500 font-medium text-center bg-slate-50 py-3 rounded-xl border border-slate-200">
                        Upcoming
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
