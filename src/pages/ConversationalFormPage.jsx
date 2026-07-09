import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Send, Sparkles, AlertTriangle, CornerDownLeft, Edit2, CheckCheck } from 'lucide-react';
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
  const [isTyping, setIsTyping] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const inputRef = useRef(null);
  const feedEndRef = useRef(null);

  // Impedir que el llenado automático salte la bienvenida
  const [hasStarted, setHasStarted] = useState(false);

  // Estados para la secuencia de bienvenida animada
  const [welcomeParagraphs, setWelcomeParagraphs] = useState([]);
  const [welcomeTyping, setWelcomeTyping] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0);

  const [typedValue, setTypedValue] = useState("");

  const activeFieldKey = allFieldKeys[engineState.currentQuestionIndex];
  const activeSchema = stellantisFieldSchema[activeFieldKey];

  // Sincronizar typedValue cuando cambie de pregunta
  useEffect(() => {
    if (activeFieldKey) {
      setTypedValue(formData[activeFieldKey] || "");
    }
  }, [engineState.currentQuestionIndex, activeFieldKey]);

  // Secuencia de bienvenida
  useEffect(() => {
    if (!hasStarted) {
      const p1 = "¡Hola! Bienvenido al asistente inteligente de Stellantis Credit.";
      const p2 = "Cuéntanos sobre ti para iniciar el proceso.";
      const p3 = "Te guiaré paso a paso mediante esta entrevista interactiva e iré tomando nota de tu información en tiempo real. ¡Comencemos!";

      setWelcomeTyping(true);
      const t1 = setTimeout(() => {
        setWelcomeParagraphs([p1]);
        setWelcomeStep(1);
        
        const t2 = setTimeout(() => {
          setWelcomeParagraphs([p1, p2]);
          setWelcomeStep(2);
          
          const t3 = setTimeout(() => {
            setWelcomeParagraphs([p1, p2, p3]);
            setWelcomeTyping(false);
            setWelcomeStep(3);
          }, 2000);
          return () => clearTimeout(t3);
        }, 1800);
        return () => clearTimeout(t2);
      }, 1200);

      return () => {
        clearTimeout(t1);
      };
    }
  }, [hasStarted]);

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

  // Enfoque automático del input
  useEffect(() => {
    if (inputRef.current && !isTyping && !isSavingNote) {
      inputRef.current.focus();
    }
  }, [engineState.currentQuestionIndex, isTyping, isSavingNote]);

  // Desplazamiento automático al fondo del chat
  useEffect(() => {
    if (feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [engineState.currentQuestionIndex, isTyping, isSavingNote]);

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
    const value = formData[activeFieldKey];
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

    if (engineState.currentQuestionIndex < allFieldKeys.length - 1) {
      // Efecto "Tomando Nota" por 1 segundo, luego "Redactando siguiente pregunta" por 800ms
      setIsSavingNote(true);
      setTimeout(() => {
        setIsSavingNote(false);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setEngineState((prev) => ({
            ...prev,
            completedQuestions: updatedCompleted,
            visitedQuestions: updatedVisited,
            currentQuestionIndex: prev.currentQuestionIndex + 1
          }));
        }, 800);
      }, 1200);
    } else {
      setIsSavingNote(true);
      setTimeout(() => {
        setIsSavingNote(false);
        setCurrentStep(5); // Pantalla de revisión final
      }, 1000);
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
    setTypedValue(value);
    setFormData((prev) => ({ ...prev, [activeFieldKey]: value }));
    setEngineState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [activeFieldKey]: value }
    }));
  };

  // Renderizar fase inicial de bienvenida si no ha comenzado expresamente
  if (!hasStarted) {
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
            className={`btn btn-primary btn-large btn-welcome ${welcomeStep === 3 ? 'btn-welcome-ready' : ''}`}
          >
            {welcomeStep === 3 ? "¡Empecemos!" : "Omitir presentación"} <ArrowRight size={18} />
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
    <div className="conversational-wizard-container animate-fade-in max-w-2xl mx-auto">
      
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
                <span>{isSavingNote ? "Anotando respuesta..." : isTyping ? "IA está redactando..." : "En línea"}</span>
              </div>
            </div>
          </div>
          <span className="ai-phase-tag">
            Fase {currentStep} de 4
          </span>
        </div>

        {/* Cuerpo del Chat */}
        <div className="ai-terminal-body">

          {/* Historial de la Conversación */}
          {allFieldKeys.slice(0, engineState.currentQuestionIndex).map((key, idx) => {
            const schema = stellantisFieldSchema[key];
            const val = formData[key];
            const displayVal = schema.type === "select" ? val : (val || "—");

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
                  onClick={() => handleEditQuestion(idx)}
                  title="Haz clic aquí para cambiar esta respuesta"
                >
                  <div className="ai-bubble user">
                    <p className="flex items-center gap-2 justify-between">
                      <span>{displayVal}</span>
                      <Edit2 size={12} className="ai-edit-indicator" />
                    </p>
                    <span className="ai-time-label flex items-center justify-end gap-1">
                      <span>Tú</span>
                      <CheckCheck size={14} className="text-teal-accent" />
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {/* Si está guardando nota de la pregunta actual */}
          {isSavingNote && (
            <>
              {renderPhaseIntro(activeFieldKey)}
              {/* Mostrar la pregunta activa */}
              <div className="ai-msg-row bot animate-message-slide">
                <div className="ai-bubble bot">
                  <p>{activeSchema.prompt}</p>
                  <span className="ai-time-label">IA</span>
                </div>
              </div>
              {/* Mostrar la respuesta que se acaba de enviar */}
              <div className="ai-msg-row user animate-message-slide">
                <div className="ai-bubble user">
                  <p className="flex items-center gap-2 justify-between">
                    <span>{formData[activeFieldKey] || "—"}</span>
                  </p>
                  <span className="ai-time-label flex items-center justify-end gap-1">
                    <span>Tú</span>
                    <CheckCheck size={14} className="text-teal-accent" />
                  </span>
                </div>
              </div>
              {/* Mostrar el estado "Anotando respuesta..." */}
              <div className="ai-msg-row bot animate-message-slide">
                <div className="ai-bubble bot note-taking-bubble">
                  <div className="flex items-center gap-2 text-xs text-teal-accent font-semibold">
                    <span className="writing-pen-anim">📝</span>
                    <span>Guardando respuesta en el expediente...</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Si se está redactando la siguiente pregunta */}
          {isTyping && (
            <>
              {renderPhaseIntro(activeFieldKey)}
              <div className="ai-msg-row bot">
                <div className="ai-bubble bot">
                  <p>{activeSchema.prompt}</p>
                  <span className="ai-time-label">IA</span>
                </div>
              </div>
              <div className="ai-msg-row user">
                <div className="ai-bubble user">
                  <p className="flex items-center gap-2 justify-between">
                    <span>{formData[activeFieldKey] || "—"}</span>
                  </p>
                  <span className="ai-time-label flex items-center justify-end gap-1">
                    <span>Tú</span>
                    <CheckCheck size={14} className="text-teal-accent" />
                  </span>
                </div>
              </div>
              {/* Y mostramos la burbuja de escribiendo de la nueva pregunta */}
              <div className="ai-msg-row bot animate-message-slide">
                <div className="ai-bubble bot active-question">
                  <div className="ai-typing-dots">
                    <div className="ai-typing-dot"></div>
                    <div className="ai-typing-dot"></div>
                    <div className="ai-typing-dot"></div>
                  </div>
                  <span className="ai-time-label">IA</span>
                </div>
              </div>
            </>
          )}

          {/* Pregunta Activa (sólo si NO se está guardando ni escribiendo) */}
          {!isSavingNote && !isTyping && (
            <>
              {renderPhaseIntro(activeFieldKey)}
              <div className="ai-msg-row bot animate-message-slide">
                <div className="ai-bubble bot active-question">
                  <p>{activeSchema.prompt}</p>
                  <span className="ai-time-label">IA</span>
                </div>
              </div>
            </>
          )}

          <div ref={feedEndRef} />
        </div>

        {/* Panel de Inputs */}
        <div className="ai-terminal-footer">
          {localError && (
            <div className="ai-error-message-bar animate-fade-in">
              <AlertTriangle size={16} className="text-rose-400 flex-shrink-0" />
              <span>{localError}</span>
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
                  value={typedValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="ai-select-input-field"
                  disabled={isTyping}
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
                  disabled={isTyping}
                />
              )}
            </div>

            {/* Enviar */}
            <button
              type="button"
              className="ai-control-btn send"
              onClick={handleNext}
              disabled={isTyping}
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
