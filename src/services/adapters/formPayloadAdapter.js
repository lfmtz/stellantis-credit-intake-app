import { stellantisSheetMap } from "../../flows/stellantis/stellantisSheetMap.js";

/**
 * Convierte el estado local del formulario de React (camelCase)
 * a un payload estructurado utilizando los cabeceros exactos de Google Sheets.
 */
export const formPayloadAdapter = (formData) => {
  const payload = {};

  Object.keys(formData).forEach((key) => {
    // Si estamos en el flujo titular/edición donde 'rfc' existe en formData,
    // evitamos que 'rfcAcreditado' (campo puente de cónyuge que mapea a la misma columna "RFC")
    // sobreescriba el valor de 'rfc' editado por el usuario.
    if (key === "rfcAcreditado" && Object.prototype.hasOwnProperty.call(formData, "rfc")) {
      return;
    }

    const sheetHeader = stellantisSheetMap[key];
    if (sheetHeader) {
      let val = formData[key];
      
      // Si el valor es una fecha en formato YYYY-MM-DD (ej: 1980-07-06) o formato ISO (ej: 1962-04-22T06:00:00.000Z),
      // lo formateamos al formato DD/MM/YYYY (ej: 06/07/1980) solicitado por el cliente.
      if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) {
        const datePart = val.substring(0, 10);
        const parts = datePart.split("-");
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        val = `${day}/${month}/${year}`;
      } else if (typeof val === "string") {
        // Asegurar que todos los campos de texto se inserten en MAYÚSCULAS limpias
        val = val.toUpperCase().trim();
      }
      
      payload[sheetHeader] = val;
    }
  });

  return payload;
};
