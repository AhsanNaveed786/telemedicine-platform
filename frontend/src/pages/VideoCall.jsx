import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PhoneOff } from 'lucide-react';

export default function VideoCall() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get('link');

  const containerRef = useRef(null);

  useEffect(() => {
    if (!link || !containerRef.current) return;
    
    // In a production app, we would use the Jitsi meet external API script:
    // https://meet.jit.si/external_api.js
    // For simplicity here, we use an iframe pointing to the link.
    // Jitsi natively supports being embedded in iframes.
    
    // We add #config.disableDeepLinking=true to prevent Jitsi from prompting app download on mobile
  }, [link]);

  if (!link) return <div className="text-center py-20">Invalid Meeting Link</div>;

  const handleLeave = () => {
    // Navigate back to history or home
    navigate(-1);
  };

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl h-[80vh] flex flex-col relative">
      <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="font-semibold">Live Consultation</span>
        </div>
        
        <button 
          onClick={handleLeave}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <PhoneOff size={18} /> End Call
        </button>
      </div>
      
      <div className="flex-1 bg-black relative" ref={containerRef}>
        <iframe
          src={`${link}#config.disableDeepLinking=true`}
          allow="camera; microphone; fullscreen; display-capture"
          className="w-full h-full border-0"
          title="Video Consultation"
        ></iframe>
      </div>
    </div>
  );
}
