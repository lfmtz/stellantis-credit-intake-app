import React, { useState } from 'react';
import { Edit2, Check, Send, AlertCircle, Copy, Users, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { stellantisFormFlow } from '../flows/stellantis/stellantisFormFlow';
import { conyugeFormFlow } from '../flows/stellantis/conyugeFormFlow';
import { stellantisFieldSchema } from '../flows/stellantis/stellantisFieldSchema';
import { validateField } from '../utils/validators';

const formatDisplayValue = (fieldId, value) => {
  if (value === undefined || value === null || value === "") return "";
  if ((fieldId === "fechaNacimiento" || fieldId === "fechaNacimientoConyuge") && typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`;
    }
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
      return value;
    }
  }
  return String(value).toUpperCase();
};

// Campos del cónyuge (sin rfcAcreditado que es el mismo RFC del titular)
const CONYUGE_FIELDS = conyugeFormFlow.phases
  .filter((p) => p.fields && p.fields.length > 0)
  .flatMap((p) => p.fields)
  .filter((f) => f !== "rfcAcreditado");

export default function ReviewPage({
  formData,
  setFormData,
  setCurrentStep,
  onSubmit,
  isSubmitting,
  submitError,
  formFlow = stellantisFormFlow,
  fieldSchema = stellantisFieldSchema,
  isConyugeMode = false
}) {
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [localErrors, setLocalErrors] = useState({});
  const [copiedField, setCopiedField] = useState(null);
  const [lastCopiedField, setLastCopiedField] = useState(null);

  const getFieldValue = (fieldId) => {
    if (fieldId === "rfc") {
      return formData.rfc || formData.rfcAcreditado || "";
    }
    if (fieldId === "rfcAcreditado") {
      return formData.rfcAcreditado || formData.rfc || "";
    }
    return formData[fieldId];
  };

  const handleCopyField = (fieldId, value, e) => {
    if (e) e.stopPropagation();
    if (value === undefined || value === null || value === "") return;
    const textToCopy = formatDisplayValue(fieldId, value);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(String(textToCopy));
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = String(textToCopy);
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedField(fieldId);
    setLastCopiedField(fieldId);
    setTimeout(() => {
      setCopiedField((prev) => (prev === fieldId ? null : prev));
    }, 1500);
  };

  const startEditing = (fieldId, currentVal, e) => {
    if (e) e.stopPropagation();
    setEditingField(fieldId);
    let val = currentVal || '';
    if ((fieldId === "fechaNacimiento" || fieldId === "fechaNacimientoConyuge") && typeof val === "string") {
      const match = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        val = `${match[1]}-${match[2]}-${match[3]}`;
      } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) {
        const parts = val.split("/");
        val = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
      }
    } else if (typeof val === "string") {
      val = val.toUpperCase();
    }
    setTempValue(val);
    setLocalErrors((prev) => ({ ...prev, [fieldId]: '' }));
  };

  const cancelEditing = (e) => {
    if (e) e.stopPropagation();
    setEditingField(null);
  };

  const saveEditing = (fieldId, e) => {
    if (e) e.stopPropagation();
    const schema = fieldSchema[fieldId];
    let valToSave = tempValue;
    if (typeof valToSave === "string" && fieldId !== "fechaNacimiento" && fieldId !== "fechaNacimientoConyuge") {
      valToSave = valToSave.toUpperCase().trim();
    }
    if (schema) {
      const errorMsg = validateField(valToSave, schema.validation);
      if (errorMsg) {
        setLocalErrors((prev) => ({ ...prev, [fieldId]: errorMsg }));
        return;
      }
    }

    setFormData((prev) => {
      const next = { ...prev, [fieldId]: valToSave };
      if (fieldId === "rfc") {
        next.rfcAcreditado = valToSave;
      } else if (fieldId === "rfcAcreditado" && Object.prototype.hasOwnProperty.call(prev, "rfc")) {
        next.rfc = valToSave;
      }
      return next;
    });
    setEditingField(null);
  };

  const handleEditKeyDown = (e, fieldId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEditing(fieldId);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
  };

  // Detectar si este expediente tiene datos de cónyuge capturados (cuando estamos viendo el expediente titular)
  const hasConyugeData = !isConyugeMode && CONYUGE_FIELDS.some((key) => {
    if (key === "nacionalidadConyuge") return false; // Tiene valor por defecto "MEXICANA"
    const v = formData[key];
    return v !== undefined && v !== null && String(v).trim() !== "";
  });

  const [showConyugeSection, setShowConyugeSection] = useState(false);
  const [copiedConyugeLink, setCopiedConyugeLink] = useState(false);
  const isConyugeExpanded = hasConyugeData || showConyugeSection;

  const titularRfcValue = (formData.rfc || formData.rfcAcreditado || "").trim().toUpperCase();
  const conyugeDirectLink = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}?modo=conyuge${
        titularRfcValue ? `&rfc=${encodeURIComponent(titularRfcValue)}` : ""
      }`
    : "";

  const handleCopyConyugeLink = () => {
    if (!conyugeDirectLink) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(conyugeDirectLink);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = conyugeDirectLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedConyugeLink(true);
    setTimeout(() => setCopiedConyugeLink(false), 2200);
  };

  const renderFieldCard = (fieldId) => {
    const schema = fieldSchema[fieldId];
    if (!schema) return null;
    const value = getFieldValue(fieldId);
    const hasValue = value !== undefined && value !== null && String(value).trim() !== "";
    const isEditing = editingField === fieldId;
    const isCopied = copiedField === fieldId;
    const isLastCopied = lastCopiedField === fieldId;
    const error = localErrors[fieldId];

    return (
      <div
        key={fieldId}
        onClick={() => {
          if (!isEditing && hasValue) {
            handleCopyField(fieldId, value);
          }
        }}
        className={`review-field-item flex flex-col justify-between rounded-lg border bg-dark-card ${
          !isEditing && hasValue ? 'review-field-copyable' : ''
        } ${isCopied ? 'review-field-copied' : isLastCopied ? 'review-field-last-copied' : ''}`}
        title={!isEditing && hasValue ? "Clic para copiar este dato" : undefined}
      >
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="review-field-label">{schema.label}</span>
            {isLastCopied && !isCopied && !isEditing && (
              <span className="last-copied-pill">Último copiado</span>
            )}
          </div>
          {!isEditing && (
            <div className="review-field-actions">
              {hasValue && (
                <button
                  type="button"
                  onClick={(e) => handleCopyField(fieldId, value, e)}
                  className={`btn-review-action ${isCopied ? 'copied' : ''}`}
                  title="Copiar este dato al portapapeles"
                >
                  {isCopied ? (
                    <>
                      <Check size={13} />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={(e) => startEditing(fieldId, value, e)}
                className="btn-review-action edit"
                title="Editar este campo"
              >
                <Edit2 size={13} />
                <span>Editar</span>
              </button>
            </div>
          )}
        </div>

        <div className="review-field-value-container mt-2">
          {isEditing ? (
            <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
              {schema.type === "select" ? (
                <select
                  autoFocus
                  value={tempValue ? tempValue.toUpperCase() : ""}
                  onChange={(e) => setTempValue(e.target.value.toUpperCase())}
                  onKeyDown={(e) => handleEditKeyDown(e, fieldId)}
                  className="form-control"
                >
                  <option value="" disabled>{schema.placeholder}</option>
                  {schema.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  autoFocus
                  type={schema.type}
                  value={tempValue}
                  placeholder={schema.placeholder}
                  onChange={(e) => setTempValue(schema.type === 'date' ? e.target.value : e.target.value.toUpperCase())}
                  onKeyDown={(e) => handleEditKeyDown(e, fieldId)}
                  className="form-control"
                  style={schema.type !== 'date' ? { textTransform: 'uppercase' } : undefined}
                />
              )}
              {error && <span className="error-message">{error}</span>}
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-xs text-gray-500">Enter = Guardar · Esc = Cancelar</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="btn btn-secondary btn-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={(e) => saveEditing(fieldId, e)}
                    className="btn btn-primary btn-xs flex items-center gap-1"
                  >
                    <Check size={12} /> Guardar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <span className="review-field-value text-white font-medium">
              {hasValue ? formatDisplayValue(fieldId, value) : <em className="text-gray-500">Sin responder</em>}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="review-page-container animate-fade-in">
      <div className="review-header">
        <h1 className="welcome-title text-center">
          {isConyugeMode ? "Revisión de Datos del Cónyuge" : "Revisión de tu Solicitud"}
        </h1>
        
        <div className="review-notice-banner my-5 flex items-start gap-3 p-4 rounded-xl border border-teal-accent/30 bg-teal-accent/5">
          <AlertCircle className="text-teal-accent shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-semibold text-white">
              Valida por favor que tus datos sean correctos, porque de esto depende tu autorización de crédito.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              💡 <strong>Tip rápido:</strong> Haz clic directamente sobre cualquier recuadro para <strong>copiar el dato</strong> con un solo clic, o presiona <strong>Editar</strong> (<Edit2 size={11} className="inline mx-0.5 text-teal-accent" />) para corregirlo (usa <kbd className="enter-key-badge">Enter</kbd> para guardar al instante).
            </p>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="alert alert-danger flex items-center gap-2">
          <AlertCircle size={20} />
          <span>Error al guardar los datos: {submitError}. Por favor, vuelve a intentarlo.</span>
        </div>
      )}

      <div className="review-phases-list">
        {formFlow.phases.map((phase) => {
          if (phase.id === 0 || !phase.fields || phase.fields.length === 0) return null; // Saltar bienvenida y revisión

          return (
            <div key={phase.id} className="phase-review-card glass-panel mb-6">
              <div className="phase-card-header flex justify-between items-center border-b pb-3">
                <h3 className="phase-review-title">Fase {phase.id} — {phase.title}</h3>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCurrentStep(phase.id)}
                >
                  Volver a esta sección
                </button>
              </div>

              <div className="phase-card-body pt-4">
                {phase.fields.map((fieldId) => renderFieldCard(fieldId))}
              </div>
            </div>
          );
        })}

        {/* Bloque de Cónyuge / Coacreditado dentro del expediente titular: permite copiar el link o capturar/editar los datos directamente aquí */}
        {!isConyugeMode && (
          <div className="phase-review-card glass-panel mb-6">
            <div className="phase-card-header flex flex-wrap justify-between items-center gap-3 border-b pb-3">
              <div>
                <h3 className="phase-review-title flex items-center gap-2">
                  <Users size={18} className="text-teal-accent" />
                  <span>Datos del Cónyuge / Coacreditado</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Puedes enviarle el link exclusivo al cónyuge o capturar/editar sus datos directamente aquí.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyConyugeLink}
                  className="btn btn-secondary btn-sm flex items-center gap-1.5"
                  title="Copiar enlace exclusivo para que el cónyuge capture sus datos"
                >
                  {copiedConyugeLink ? (
                    <>
                      <Check size={14} className="text-teal-accent" />
                      <span className="text-teal-accent">¡Link Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="text-teal-accent" />
                      <span>Copiar Link Cónyuge</span>
                    </>
                  )}
                </button>
                <a
                  href={conyugeDirectLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm flex items-center gap-1.5"
                  title="Abrir el asistente conversacional del cónyuge en una pestaña nueva"
                >
                  <ExternalLink size={14} className="text-teal-accent" />
                  <span>Abrir Asistente Cónyuge</span>
                </a>
                {!hasConyugeData && (
                  <button
                    type="button"
                    onClick={() => setShowConyugeSection((prev) => !prev)}
                    className="btn btn-primary btn-sm flex items-center gap-1.5"
                  >
                    {showConyugeSection ? (
                      <>
                        <ChevronUp size={15} />
                        <span>Ocultar campos</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={15} />
                        <span>Capturar aquí mismo</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {isConyugeExpanded && (
              <div className="phase-card-body pt-4">
                {CONYUGE_FIELDS.map((fieldId) => renderFieldCard(fieldId))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="submit-actions flex flex-col items-center justify-center mt-8 py-6 border-t gap-4">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setCurrentStep(isConyugeMode ? 2 : 4)}
            className="btn btn-secondary btn-large"
            disabled={isSubmitting}
          >
            Atrás
          </button>
          
          <button
            type="button"
            onClick={onSubmit}
            className="btn btn-primary btn-large flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner-border text-white" role="status"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send size={18} /> Confirmar y enviar
              </>
            )}
          </button>
        </div>

        <div className="disclaimer text-xs text-gray-400 text-center max-w-lg mt-2">
          Al confirmar, tus datos se guardarán exactamente en el archivo de Google Sheets configurado y se preparará tu perfil para el mapeo final al contrato Stellantis.
        </div>
      </div>
    </div>
  );
}
