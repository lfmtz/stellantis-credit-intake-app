import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Send, Sparkles, AlertTriangle, CornerDownLeft, Edit2, CheckCheck, Plus, FileText, Copy, Check, FastForward, Zap } from 'lucide-react';
import { stellantisFormFlow } from '../flows/stellantis/stellantisFormFlow';
import { stellantisFieldSchema } from '../flows/stellantis/stellantisFieldSchema';
import { validateField } from '../utils/validators';

export default function ConversationalFormPage({
  currentStep, // Representa la FASE (0=Bienvenida, 1=Personal, etc.)
  setCurrentStep,
  formData,
  setFormData,
  errors,
  setErrors
}) {
  // 1. Obtener todas las preguntas en orden consecutivo
  const allFieldKeys = [];
  stellantisFormFlow.phases.forEach((phase) => {
    if (phase.fields && phase.fields.length > 0) {
      // Solo incluimos campos que no estén marcados como 'hidden' en el esquema
      const activeFields = phase.fields.filter(key => !stellantisFieldSchema[key]?.hidden);
      allFieldKeys.push(...activeFields);
    }
  });

  // 2. Inicializar el motor conversacional
  const [engineState, setEngineState] = useState(() => {
    let initialIndex = 0;
    const completed = [];
    const visited = [];

    for (let i = 0; i < allFieldKeys.length; i++) {
      const key = allFieldKeys[i];
      if (formData[key]) {
        completed.push(key);
        visited.push(key);
        initialIndex = i + 1;
      } else {
        break;
      }
    }

    if (initialIndex >= allFieldKeys.length) {
      initialIndex = allFieldKeys.length - 1;
    }

    return {
      currentPhase: stellantisFieldSchema[allFieldKeys[initialIndex]]?.phase || 1,
      currentQuestionIndex: initialIndex,
      answers: formData,
      visitedQuestions: visited,
      completedQuestions: completed
    };
  });

  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Modo rápido: elimina animaciones para captura ágil (asesores / usuarios expertos).
  // Se recuerda en localStorage; por defecto activo en modo administrador (?admin=true).
  const [fastMode, setFastMode] = useState(() => {
    try {
      const stored = localStorage.getItem('stellantis.fastMode');
      if (stored !== null) return stored === 'true';
    } catch { /* localStorage no disponible */ }
    return new URLSearchParams(window.location.search).get('admin') === 'true';
  });

  const toggleFastMode = () => {
    setFastMode((prev) => {
      const next = !prev;
      try { localStorage.setItem('stellantis.fastMode', String(next)); } catch { /* ignorar */ }
      return next;
    });
    // Devolver el foco al input para seguir capturando sin usar el mouse ni desplazar la ventana
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0);
  };

  // Impedir que el llenado automático salte la bienvenida
  const [hasStarted, setHasStarted] = useState(false);

  // Estados para la secuencia de bienvenida animada
  const [welcomeParagraphs, setWelcomeParagraphs] = useState([]);
  const [welcomeTyping, setWelcomeTyping] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0);

  const [typedValue, setTypedValue] = useState("");

  // Rastrear el índice más avanzado alcanzado para permitir retornos directos y evitar bloqueos
  const [furthestQuestionIndex, setFurthestQuestionIndex] = useState(() => {
    let initialIndex = 0;
    for (let i = 0; i < allFieldKeys.length; i++) {
      if (formData[allFieldKeys[i]]) {
        initialIndex = i + 1;
      } else {
        break;
      }
    }
    return Math.min(initialIndex, allFieldKeys.length - 1);
  });

  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopyText = (e, text, key) => {
    if (e) e.stopPropagation();
    if (!text || text === "—") return;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(String(text));
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = String(text);
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 1800);
  };

  const handleJumpToFurthest = () => {
    setLocalError("");
    setEngineState((prev) => ({
      ...prev,
      currentQuestionIndex: furthestQuestionIndex
    }));
  };

  const activeFieldKey = allFieldKeys[engineState.currentQuestionIndex];
  const activeSchema = stellantisFieldSchema[activeFieldKey];

  // Sincronizar typedValue cuando cambie de pregunta
  useEffect(() => {
    if (activeFieldKey) {
      setTypedValue(formData[activeFieldKey] || "");
    }
  }, [engineState.currentQuestionIndex, activeFieldKey]);

  // Secuencia de bienvenida (ágil: ~0.9s total; instantánea en Modo rápido)
  useEffect(() => {
    if (!hasStarted) {
      const p1 = "¡Hola! Bienvenido al asistente inteligente de Stellantis Credit.";
      const p2 = "Cuéntanos sobre ti para iniciar el proceso.";
      const p3 = "Te guiaré paso a paso mediante esta entrevista interactiva e iré tomando nota de tu información en tiempo real. ¡Comencemos!";

      if (fastMode) {
        setWelcomeParagraphs([p1, p2, p3]);
        setWelcomeTyping(false);
        setWelcomeStep(3);
        return;
      }

      setWelcomeTyping(true);
      const timers = [
        setTimeout(() => {
          setWelcomeParagraphs([p1]);
          setWelcomeStep(1);
        }, 250),
        setTimeout(() => {
          setWelcomeParagraphs([p1, p2]);
          setWelcomeStep(2);
        }, 550),
        setTimeout(() => {
          setWelcomeParagraphs([p1, p2, p3]);
          setWelcomeTyping(false);
          setWelcomeStep(3);
        }, 900)
      ];

      return () => timers.forEach(clearTimeout);
    }
  }, [hasStarted]); // eslint-disable-line react-hooks/exhaustive-deps

  // 3. Sincronizar fase con el paso activo del formulario
  useEffect(() => {
    if (hasStarted && activeSchema) {
      setCurrentStep(activeSchema.phase);
      setEngineState((prev) => ({
        ...prev,
        currentPhase: activeSchema.phase
      }));
    }
  }, [hasStarted, engineState.currentQuestionIndex, activeSchema, setCurrentStep]);

  // Enfoque automático del input sin saltos de scroll en la ventana
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [engineState.currentQuestionIndex]);

  // Desplazamiento automático al fondo del chat (SOLO dentro de la caja del chat, sin mover la pantalla)
  useEffect(() => {
    if (chatBodyRef.current) {
      // Usamos requestAnimationFrame para asegurar que el DOM ya calculó la altura del nuevo mensaje
      requestAnimationFrame(() => {
        if (chatBodyRef.current) {
          chatBodyRef.current.scrollTo({
            top: chatBodyRef.current.scrollHeight,
            behavior: fastMode ? 'auto' : 'smooth'
          });
        }
      });
    }
  }, [engineState.currentQuestionIndex, fastMode]);

  const handleNext = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setCurrentStep(1);
      setEngineState((prev) => ({
        ...prev,
        currentQuestionIndex: 0
      }));
      return;
    }

    // Validar el campo actual antes de proceder
    let value = formData[activeFieldKey];
    if (typeof value === "string" && activeSchema.type !== "date") {
      value = value.toUpperCase().trim();
      setFormData((prev) => ({ ...prev, [activeFieldKey]: value }));
      setEngineState((prev) => ({
        ...prev,
        answers: { ...prev.answers, [activeFieldKey]: value }
      }));
    }
    const errorMsg = validateField(value, activeSchema.validation);

    if (errorMsg) {
      setLocalError(errorMsg);
      setErrors((prev) => ({ ...prev, [activeFieldKey]: errorMsg }));
      return;
    }

    setLocalError("");
    setErrors((prev) => ({ ...prev, [activeFieldKey]: "" }));
    setTypedValue("");

    const updatedCompleted = [...engineState.completedQuestions];
    if (!updatedCompleted.includes(activeFieldKey)) {
      updatedCompleted.push(activeFieldKey);
    }

    const updatedVisited = [...engineState.visitedQuestions];
    if (!updatedVisited.includes(activeFieldKey)) {
      updatedVisited.push(activeFieldKey);
    }

    const nextIdx = engineState.currentQuestionIndex + 1;
    setFurthestQuestionIndex((prev) => Math.max(prev, nextIdx));

    // Avance inmediato: sin esperas artificiales ("Tomando nota" / "Redactando").
    // La sensación conversacional la da la animación corta de la nueva burbuja (o ninguna en Modo rápido).
    if (nextIdx < allFieldKeys.length) {
      setEngineState((prev) => ({
        ...prev,
        completedQuestions: updatedCompleted,
        visitedQuestions: updatedVisited,
        currentQuestionIndex: nextIdx
      }));
    } else {
      setEngineState((prev) => ({
        ...prev,
        completedQuestions: updatedCompleted,
        visitedQuestions: updatedVisited
      }));
      setCurrentStep(5); // Pantalla de revisión final
    }
  };

  const handlePrev = () => {
    if (engineState.currentQuestionIndex > 0) {
      setLocalError("");
      setEngineState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    } else {
      setCurrentStep(0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleEditQuestion = (index) => {
    setLocalError("");
    setEngineState((prev) => ({
      ...prev,
      currentQuestionIndex: index
    }));
  };

  const handleInputChange = (value) => {
    setLocalError("");
    const formattedValue = (typeof value === "string" && activeSchema?.type !== "date")
      ? value.toUpperCase()
      : value;
    setTypedValue(formattedValue);
    setFormData((prev) => ({ ...prev, [activeFieldKey]: formattedValue }));
    setEngineState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [activeFieldKey]: formattedValue }
    }));
  };

  // Renderizar fase inicial de bienvenida si no ha comenzado expresamente
  if (!hasStarted) {
    const isAdminMode = new URLSearchParams(window.location.search).get('admin') === 'true';

    if (isAdminMode) {
      return (
        <div className="welcome-container animate-fade-in max-w-2xl mx-auto text-center py-12">
          <div className="brand-logo-container justify-center mb-6">
            <Sparkles className="logo-spark animate-bounce-slow" />
            <h2 className="brand-badge text-teal-accent">STELLANTIS CREDIT PANEL</h2>
          </div>
          
          <h1 className="welcome-title mb-2">ADMINISTRACIÓN DE SOLICITUDES</h1>
          <p className="welcome-subtitle text-lg text-gray-400 mb-8 font-semibold">BIENVENIDO</p>

          <div className="glass-panel p-8 rounded-xl max-w-md mx-auto mb-8 bg-dark-card border border-teal-accent/20">
            <p className="text-sm text-gray-400 mb-6">
              Este es tu panel privado para gestionar los expedientes de clientes de Stellantis.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                type="button"
                onClick={() => {
                  setHasStarted(true);
                  setCurrentStep(1);
                  setEngineState((prev) => ({
                    ...prev,
                    currentQuestionIndex: 0
                  }));
                }}
                className="btn btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                <Plus size={18} /> Iniciar Nueva Solicitud
              </button>
              <button 
                type="button"
                onClick={() => setCurrentStep(-1)}
                className="btn btn-secondary w-full flex items-center justify-center gap-2 py-3"
              >
                <FileText size={18} /> Ver Solicitudes Guardadas
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="welcome-container animate-fade-in max-w-2xl mx-auto">
        <div className="brand-logo-container text-center mb-6">
          <Sparkles className="logo-spark" />
          <h2 className="brand-badge">STELLANTIS CREDIT</h2>
        </div>
        
        <h1 className="welcome-title text-center mb-6">Asistente de Solicitud</h1>

        <div className="welcome-chat-box pulse-glow-border">
          {/* Cabecera estilo chat */}
          <div className="ai-terminal-header" style={{ borderRadius: '0.75rem 0.75rem 0 0', margin: '-2rem -2rem 1.5rem -2rem' }}>
            <div className="ai-core-visualizer">
              <div className="ai-core-sphere"></div>
              <div className="ai-core-info">
                <h3 className="ai-core-title">Asesor Stellantis</h3>
                <div className="ai-core-status">
                  <span className="ai-core-status-dot"></span>
                  <span>{welcomeStep < 3 ? "Asesor escribiendo..." : "En línea"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mensajes secuenciales estilo burbujas */}
          <div className="flex flex-col gap-4">
            {welcomeParagraphs.map((paragraph, index) => (
              <div key={index} className="ai-msg-row bot animate-message-slide">
                <div className="ai-bubble bot">
                  <p>{paragraph}</p>
                  <span className="ai-time-label">IA</span>
                </div>
              </div>
            ))}

            {/* Indicador de escritura */}
            {welcomeStep < 3 && (
              <div className="ai-msg-row bot animate-message-slide">
                <div className="ai-bubble bot active-question">
                  <div className="ai-typing-dots">
                    <div className="ai-typing-dot"></div>
                    <div className="ai-typing-dot"></div>
                    <div className="ai-typing-dot"></div>
                  </div>
                  <span className="ai-time-label flex items-center gap-1">
                    <span className="writing-pen-anim">✍️</span>
                    <span>Asesor preparando la entrevista...</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <button 
            onClick={handleNext} 
            className="btn btn-primary btn-large btn-welcome btn-welcome-ready"
          >
            ¡Empecemos! <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (!activeSchema) return null;

  const totalQuestions = allFieldKeys.length;
  const progressPercent = Math.round((engineState.currentQuestionIndex / totalQuestions) * 100);

  // Helper para verificar si un campo es el primero de su fase y debe mostrar una introducción
  const renderPhaseIntro = (key) => {
    const schema = stellantisFieldSchema[key];
    if (!schema) return null;
    const phase = stellantisFormFlow.phases.find((p) => p.id === schema.phase);
    if (!phase) return null;
    
    // Si la clave de pregunta es la primera listada en esta fase
    if (phase.fields && phase.fields[0] === key) {
      return (
        <div key={`phase-intro-${phase.id}`} className="ai-msg-row bot animate-message-slide">
          <div className="ai-bubble bot" style={{ borderLeftColor: '#005fc8', background: 'rgba(0, 95, 200, 0.03)' }}>
            <p className="font-semibold text-teal-accent text-xs uppercase tracking-wider mb-1">
              Comenzando Fase {phase.id}: {phase.title}
            </p>
            <p className="text-gray-300 text-sm">{phase.description}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`conversational-wizard-container animate-fade-in max-w-2xl mx-auto ${fastMode ? 'fast-mode' : ''}`}>
      
      {/* Progreso General */}
      <div className="conversational-progress mb-3 flex justify-between items-center">
        <span className="step-badge font-bold">
          Fase {currentStep}: {stellantisFormFlow.phases[currentStep].title}
        </span>
        <span className="text-xs text-gray-400">
          Progreso de Solicitud: {progressPercent}%
        </span>
      </div>

      <div className="progress-bar-wrapper mb-5">
        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Terminal de Chat IA */}
      <div className="ai-terminal-container">
        
        {/* Cabecera de la Terminal */}
        <div className="ai-terminal-header">
          <div className="ai-core-visualizer">
            <div className="ai-core-sphere"></div>
            <div className="ai-core-info">
              <h3 className="ai-core-title">Asesor Inteligente</h3>
              <div className="ai-core-status">
                <span className="ai-core-status-dot"></span>
                <span>{fastMode ? "En línea · Captura rápida" : "En línea"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFastMode}
              className={`fast-mode-toggle ${fastMode ? 'active' : ''}`}
              title={fastMode ? "Desactivar modo rápido (con animaciones)" : "Activar modo rápido (sin animaciones)"}
              aria-pressed={fastMode}
            >
              <Zap size={12} />
              <span>Modo rápido</span>
            </button>
            <span className="ai-phase-tag">
              Fase {currentStep} de 4
            </span>
          </div>
        </div>

        {/* Cuerpo del Chat */}
        <div className="ai-terminal-body" ref={chatBodyRef}>

          {/* Historial de la Conversación */}
          {allFieldKeys.slice(0, engineState.currentQuestionIndex).map((key, idx) => {
            const schema = stellantisFieldSchema[key];
            const val = formData[key];
            const displayVal = schema.type === "select" ? (val ? String(val).toUpperCase() : "") : (val ? (schema.type !== "date" ? String(val).toUpperCase() : val) : "—");

            return (
              <React.Fragment key={key}>
                {/* Introducción de Fase (si corresponde) */}
                {renderPhaseIntro(key)}

                {/* Pregunta */}
                <div className="ai-msg-row bot animate-message-slide">
                  <div className="ai-bubble bot">
                    <p>{schema.prompt}</p>
                    <span className="ai-time-label">IA</span>
                  </div>
                </div>

                {/* Respuesta */}
                <div 
                  className="ai-msg-row user animate-message-slide"
                >
                  <div className="ai-bubble user">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="user-answer-text">{displayVal}</span>
                      <div className="flex items-center gap-1.5 ml-2 shrink-0">
                        {/* Botón de Copiar */}
                        <button
                          type="button"
                          onClick={(e) => handleCopyText(e, displayVal, key)}
                          className="ai-bubble-action-btn copy-btn"
                          title="Copiar este dato al portapapeles"
                        >
                          {copiedKey === key ? (
                            <span className="flex items-center gap-1 text-teal-accent text-xs font-semibold">
                              <Check size={13} className="text-teal-accent" />
                              <span className="text-[10px]">Copiado</span>
                            </span>
                          ) : (
                            <Copy size={13} className="text-gray-400 hover:text-white" />
                          )}
                        </button>

                        {/* Botón de Editar */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditQuestion(idx);
                          }}
                          className="ai-bubble-action-btn edit-btn"
                          title="Editar esta respuesta"
                        >
                          <Edit2 size={12} className="text-gray-400 hover:text-teal-accent" />
                        </button>
                      </div>
                    </div>
                    <span className="ai-time-label flex items-center justify-end gap-1">
                      <span>Tú</span>
                      <CheckCheck size={14} className="text-teal-accent" />
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {/* Pregunta Activa: aparece al instante con una animación corta (sin esperas artificiales) */}
          <React.Fragment key={`active-${activeFieldKey}`}>
            {renderPhaseIntro(activeFieldKey)}
            <div className="ai-msg-row bot animate-message-slide">
              <div className="ai-bubble bot active-question">
                <p>{activeSchema.prompt}</p>
                <span className="ai-time-label">IA</span>
              </div>
            </div>
          </React.Fragment>
        </div>

        {/* Panel de Inputs */}
        <div className="ai-terminal-footer">
          {localError && (
            <div className="ai-error-message-bar animate-fade-in">
              <AlertTriangle size={16} className="text-rose-400 flex-shrink-0" />
              <span>{localError}</span>
            </div>
          )}

          {/* Banner de retorno rápido si el usuario está consultando/editando una pregunta anterior */}
          {engineState.currentQuestionIndex < furthestQuestionIndex && (
            <div className="ai-jump-return-banner animate-fade-in flex items-center justify-between p-2 px-3 rounded-lg mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="text-amber-400 font-bold">📍 Modo consulta:</span>
                <span>Paso {engineState.currentQuestionIndex + 1} de {allFieldKeys.length}</span>
              </div>
              <button
                type="button"
                onClick={handleJumpToFurthest}
                className="btn-jump-return"
                title="Volver al último paso alcanzado"
              >
                <FastForward size={14} />
                <span>Volver a donde me quedé (Paso {furthestQuestionIndex + 1})</span>
              </button>
            </div>
          )}

          <div className="ai-input-controls-row">
            {/* Atrás */}
            <button
              type="button"
              className="ai-control-btn back"
              onClick={handlePrev}
              title="Pregunta anterior"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Input según tipo */}
            <div className="ai-input-field-wrapper">
              {activeSchema.type === "select" ? (
                <select
                  ref={inputRef}
                  value={typedValue ? typedValue.toUpperCase() : ""}
                  onChange={(e) => handleInputChange(e.target.value.toUpperCase())}
                  onKeyDown={handleKeyDown}
                  className="ai-select-input-field"
                >
                  <option value="" disabled>{activeSchema.placeholder}</option>
                  {activeSchema.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  ref={inputRef}
                  type={activeSchema.type}
                  placeholder={activeSchema.placeholder}
                  value={typedValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="ai-text-input-field"
                  style={activeSchema.type !== 'date' ? { textTransform: 'uppercase' } : undefined}
                />
              )}
            </div>

            {/* Enviar */}
            <button
              type="button"
              className="ai-control-btn send"
              onClick={handleNext}
              title="Enviar respuesta"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
