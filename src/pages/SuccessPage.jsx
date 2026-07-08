import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function SuccessPage({ onReset }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Redirigir y restablecer automáticamente después de 5 segundos
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onReset]);

  return (
    <div className="success-page-container text-center animate-fade-in py-12 max-w-lg mx-auto">
      <div className="flex justify-center mb-6">
        <div className="success-icon-wrapper animate-bounce-slow">
          <CheckCircle2 size={80} className="text-teal-accent" />
        </div>
      </div>

      <h1 className="welcome-title text-emerald-400">¡Gracias!</h1>
      <p className="welcome-subtitle text-lg font-medium my-4">
        Trabajaremos con su solicitud.
      </p>

      <div className="glass-panel p-6 rounded-xl mt-8">
        <p className="text-sm text-gray-400">
          Redirigiendo a la página de inicio en <strong className="text-teal-accent">{countdown}</strong> segundos...
        </p>
        <div className="progress-bar-wrapper mt-3" style={{ height: '4px' }}>
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${(countdown / 5) * 100}%`,
              transition: 'width 1s linear'
            }} 
          />
        </div>
      </div>

      <div className="actions mt-8">
        <button
          onClick={onReset}
          className="btn btn-primary btn-large flex items-center gap-2 mx-auto"
        >
          Volver al Inicio <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
