import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Users, Copy, Check, ExternalLink } from 'lucide-react';

export default function SuccessPage({ onReset, formData = {}, isConyugeMode = false, submittedRowId = null }) {
  const [countdown, setCountdown] = useState(isConyugeMode ? 8 : 20);
  const [isCopied, setIsCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const titularRfc = formData.rfc || '';
  const rowParam = submittedRowId ? `&rowId=${encodeURIComponent(submittedRowId)}` : '';
  const conyugeLink = typeof window !== 'undefined'
    ? (titularRfc 
        ? `${window.location.origin}${window.location.pathname}?modo=conyuge&rfc=${encodeURIComponent(titularRfc)}${rowParam}`
        : `${window.location.origin}${window.location.pathname}?modo=conyuge${rowParam}`)
    : '';

  const handleCopyLink = () => {
    setIsPaused(true);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(conyugeLink);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  useEffect(() => {
    if (isPaused) return;
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
  }, [onReset, isPaused]);

  return (
    <div className="success-page-container text-center animate-fade-in py-10 max-w-lg mx-auto">
      <div className="flex justify-center mb-6">
        <div className="success-icon-wrapper animate-bounce-slow">
          <CheckCircle2 size={80} className="text-teal-accent" />
        </div>
      </div>

      <h1 className="welcome-title text-emerald-400">
        {isConyugeMode ? "¡Datos de Cónyuge Recibidos!" : "¡Gracias!"}
      </h1>
      <p className="welcome-subtitle text-lg font-medium my-4">
        {isConyugeMode 
          ? "Tu información ha sido vinculada exitosamente a la solicitud de crédito de tu pareja."
          : "Trabajaremos con su solicitud."}
      </p>

      {/* Tarjeta para mancomunar ingresos si es titular */}
      {!isConyugeMode && (
        <div className="glass-panel p-5 rounded-xl mt-6 border border-teal-accent/30 text-left bg-dark-card animate-fade-in">
          <div className="flex items-center gap-2 mb-2 text-teal-accent font-semibold text-sm">
            <Users size={18} />
            <span>¿Van a juntar / mancomunar ingresos?</span>
          </div>
          <p className="text-xs text-gray-300 mb-4">
            Comparte este enlace o ábrelo en el celular de tu cónyuge para registrar sus datos y vincularlos a esta misma solicitud automáticamente:
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={conyugeLink}
              className="ai-text-input-field text-xs py-2 px-3 flex-grow bg-slate-900/80 border border-slate-700 rounded text-gray-300 select-all"
              onClick={(e) => e.target.select()}
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5 shrink-0"
            >
              {isCopied ? (
                <>
                  <Check size={14} /> Copiado
                </>
              ) : (
                <>
                  <Copy size={14} /> Copiar
                </>
              )}
            </button>
            <a
              href={conyugeLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 shrink-0"
              title="Abrir en pestaña nueva"
            >
              <ExternalLink size={14} /> Abrir
            </a>
          </div>
        </div>
      )}

      <div className="glass-panel p-5 rounded-xl mt-6">
        <p className="text-xs text-gray-400">
          {isPaused ? (
            <span>Temporizador en pausa mientras copias el enlace.</span>
          ) : (
            <>Redirigiendo a la página de inicio en <strong className="text-teal-accent">{countdown}</strong> segundos...</>
          )}
        </p>
        {!isPaused && (
          <div className="progress-bar-wrapper mt-3" style={{ height: '4px' }}>
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${(countdown / (isConyugeMode ? 8 : 20)) * 100}%`,
                transition: 'width 1s linear'
              }} 
            />
          </div>
        )}
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
