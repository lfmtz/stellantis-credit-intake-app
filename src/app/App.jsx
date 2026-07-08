import React, { useState } from 'react';
import ConversationalFormPage from '../pages/ConversationalFormPage';
import ReviewPage from '../pages/ReviewPage';
import SuccessPage from '../pages/SuccessPage';
import { submitFormToSheets } from '../services/api/sheetsApi';
import { formPayloadAdapter } from '../services/adapters/formPayloadAdapter';
import { Sparkles } from 'lucide-react';

const INITIAL_FORM_DATA = {
  // Fase 1
  nombreAcreditado: "",
  apellidoPaternoAcreditado: "",
  apellidoMaternoAcreditado: "",
  rfc: "",
  curp: "",
  paisNacimiento: "",
  entidadFederativaNacimiento: "",
  fechaNacimiento: "",
  numeroCelular: "",
  companiaTelefonica: "",
  correoElectronico: "",
  // Fase 2
  calle: "",
  numeroExterior: "",
  numeroInterior: "",
  coloniaAcreditado: "",
  codigoPostal: "",
  municipioAlcaldia: "",
  estado: "",
  ciudadPoblacion: "",
  telefonoCasaFijo: "",
  anosVivirDomicilio: "",
  // Fase 3
  puestoActividad: "",
  nombreEmpresa: "",
  giroEmpresa: "",
  calleTrabajo: "",
  numeroExteriorTrabajo: "",
  coloniaTrabajo: "",
  municipioAlcaldiaTrabajo: "",
  estadoTrabajo: "",
  codigoPostalTrabajo: "",
  telefonoOficinaExt: "",
  nombreJefeInmediato: "",
  antiguedadEmpleoAnos: "",
  // Fase 4
  ref1Nombre: "",
  ref1ApellidoPaterno: "",
  ref1Parentesco: "",
  ref1Telefono: "",
  ref1Ocupacion: "",
  ref2Nombre: "",
  ref2ApellidoPaterno: "",
  ref2Parentesco: "",
  ref2Telefono: "",
  ref2Ocupacion: "",
  ref3Nombre: "",
  ref3ApellidoPaterno: "",
  ref3Parentesco: "",
  ref3Telefono: "",
  ref3Ocupacion: ""
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Bienvenida, 5 = Review, 6 = Éxito
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const sheetPayload = formPayloadAdapter(formData);

    try {
      const response = await submitFormToSheets(sheetPayload);
      if (response && (response.success || response.status === 'success')) {
        setCurrentStep(6); // Success
      } else {
        throw new Error(response.error || "Error desconocido al guardar en Sheets");
      }
    } catch (err) {
      setSubmitError(err.message || "Fallo en la comunicación con el Web App. Verifica CORS y tu URL.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSubmitError(null);
    setCurrentStep(0);
  };

  return (
    <div className="app-root-layout">
      {/* Header Fijo */}
      <header className="app-nav-header glass-panel">
        <div className="nav-container flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-teal-accent" />
            <h1 className="logo-text">STELLANTIS <span className="text-gray-400">CREDIT</span></h1>
          </div>
          <div className="nav-actions">
            <span className="badge badge-outline">Fase 1: Stellantis</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-main-content">
        <div className="content-container max-w-4xl mx-auto px-4 py-8">
          {currentStep >= 0 && currentStep <= 4 && (
            <ConversationalFormPage
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {currentStep === 5 && (
            <ReviewPage
              formData={formData}
              setFormData={setFormData}
              setCurrentStep={setCurrentStep}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}

          {currentStep === 6 && (
            <SuccessPage
              formData={formData}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      {/* Footer Fijo */}
      <footer className="app-footer text-center py-6 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Stellantis Credit Intake. Desarrollado con React y Vite.
      </footer>
    </div>
  );
}
