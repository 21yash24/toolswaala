import { useState, useEffect } from 'react';
import { BRAND } from './constants';

const CITIES = ["Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Lucknow", "Jaipur"];
const ACTIONS = [
  "calculated their CGPA",
  "checked their attendance",
  "generated a resume",
  "found a UK scholarship",
  "compressed a PDF",
  "calculated their GST",
  "setup a payment page",
  "generated an SOP"
];

export default function ViralToast() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ city: "", action: "" });

  useEffect(() => {
    const triggerToast = () => {
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      setData({ city, action });
      setShow(true);
      
      setTimeout(() => setShow(false), 5000);
    };

    // First toast after 10s
    const initialTimer = setTimeout(triggerToast, 10000);

    // Random interval between 20s and 45s
    const interval = setInterval(() => {
      if (Math.random() > 0.5) triggerToast();
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: 24,
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 16,
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
      zIndex: 10000,
      animation: 'slideUp 0.5s ease-out',
      color: '#FAFAFA',
      pointerEvents: 'none'
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 10px #22C55E' }}></div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>
        Someone from <span style={{ color: BRAND.primary, fontWeight: 700 }}>{data.city}</span> just {data.action}
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
