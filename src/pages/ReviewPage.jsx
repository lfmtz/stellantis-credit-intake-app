import React, { useState } from 'react';
import { Edit2, Check, Send, AlertCircle, FileText } from 'lucide-react';
import { stellantisFormFlow } from '../flows/stellantis/stellantisFormFlow';
import { stellantisFieldSchema } from '../flows/stellantis/stellantisFieldSchema';
import { validateField } from '../utils/validators';

const formatDisplayValue = (fieldId, value) => {
  if (!value) return "";
  if (fieldId === "fechaNacimiento" && typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`;
    }
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
      return value;
    }
  }
  return String(value);
};

export default function ReviewPage({
  formData,
  setFormData,
  setCurrentStep,
  onSubmit,
  isSubmitting,
  submitError
}) {
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [localErrors, setLocalErrors] = useState({});

  const startEditing = (fieldId, currentVal) => {
    setEditingField(fieldId);
    let val = currentVal || '';
    if (fieldId === "fechaNacimiento" && typeof val === "string") {
      const match = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        val = `${match[1]}-${match[2]}-${match[3]}`;
      } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) {
        const parts = val.split("/");
        val = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
      }
    }
    setTempValue(val);
    setLocalErrors((prev) => ({ ...prev, [fieldId]: '' }));
  };

  const cancelEditing = () => {
    setEditingField(null);
  };

  const saveEditing = (fieldId) => {
    const schema = stellantisFieldSchema[fieldId];
    if (schema) {
      const errorMsg = validateField(tempValue, schema.validation);
      if (errorMsg) {
        setLocalErrors((prev) => ({ ...prev, [fieldId]: errorMsg }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [fieldId]: tempValue }));
    setEditingField(null);
  };

  return (
    <div className="review-page-container animate-fade-in">
      <div className="review-header">
        <h1 className="welcome-title text-center">Revisión de tu Solicitud</h1>
        
        <div className="review-notice-banner my-5 flex items-start gap-3 p-4 rounded-xl border border-teal-accent/30 bg-teal-accent/5">
          <AlertCircle className="text-teal-accent shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-semibold text-white">
              Valida por favor que tus datos sean correctos, porque de esto depende tu autorización de crédito.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Puedes corregir algún dato dando clic en el lápiz (<Edit2 size={12} className="inline mx-0.5 text-teal-accent" />) de tu lado derecho.
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
        {stellantisFormFlow.phases.map((phase) => {
          if (phase.id === 0 || phase.id === 5) return null; // Saltar bienvenida y revisión

          return (
            <div key={phase.id} className="phase-review-card glass-panel mb-6">
              <div className="phase-card-header flex justify-between items-center border-b pb-3">
                <h3 className="phase-review-title">Fase {phase.id} — {phase.title}</h3>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCurrentStep(phase.id)}
                >
                  Volver a esta sección
                </button>
              </div>

              <div className="phase-card-body grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {phase.fields.map((fieldId) => {
                  const schema = stellantisFieldSchema[fieldId];
                  const value = formData[fieldId];
                  const isEditing = editingField === fieldId;
                  const error = localErrors[fieldId];

                  return (
                    <div key={fieldId} className="review-field-item flex flex-col justify-between p-3 rounded-lg border bg-dark-card">
                      <div className="flex justify-between items-start">
                        <span className="review-field-label">{schema.label}</span>
                        {!isEditing && (
                          <button
                            onClick={() => startEditing(fieldId, value)}
                            className="btn-icon-edit"
                            title="Editar campo"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="review-field-value-container mt-2">
                        {isEditing ? (
                          <div className="flex flex-col gap-2">
                            {schema.type === "select" ? (
                              <select
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="form-control"
                              >
                                <option value="" disabled>{schema.placeholder}</option>
                                {schema.options.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={schema.type}
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="form-control"
                              />
                            )}
                            {error && <span className="error-message">{error}</span>}
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={cancelEditing}
                                className="btn btn-secondary btn-xs"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => saveEditing(fieldId)}
                                className="btn btn-primary btn-xs flex items-center gap-1"
                              >
                                <Check size={12} /> Guardar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="review-field-value text-white font-medium">
                            {value ? formatDisplayValue(fieldId, value) : <em className="text-gray-500">Sin responder</em>}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="submit-actions flex flex-col items-center justify-center mt-8 py-6 border-t gap-4">
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentStep(4)} // Regresar a Referencias
            className="btn btn-secondary btn-large"
            disabled={isSubmitting}
          >
            Atrás
          </button>
          
          <button
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
