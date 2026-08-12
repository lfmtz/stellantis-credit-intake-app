import { stellantisFieldSchema } from "../../flows/stellantis/stellantisFieldSchema";

// Genera un mapeo inverso desde los cabeceros de Google Sheet hacia las keys del formulario en el frontend
const inverseMap = Object.keys(stellantisFieldSchema).reduce((acc, key) => {
  const header = stellantisFieldSchema[key].sheetHeader;
  if (header) {
    // Normalizar a NFC y recortar espacios
    acc[header.normalize("NFC").trim()] = key;
  }
  return acc;
}, {});

/**
 * Convierte un registro obtenido de Google Sheets (con cabeceros en español)
 * al estado local del formulario de React (camelCase).
 */
export const formPayloadInverseAdapter = (sheetData) => {
  const formData = {};

  Object.keys(sheetData).forEach((header) => {
    // Normalizar a NFC y recortar espacios para evitar problemas de codificación de acentos
    const normalizedHeader = header.normalize("NFC").trim();
    const key = inverseMap[normalizedHeader];
    
    if (key) {
      let val = sheetData[header];

      // Convertir valores numéricos a string (como teléfonos) para que React los maneje correctamente
      if (typeof val === "number") {
        val = String(val);
      }

      // Si el valor es una fecha en formato D/M/YYYY (ej: 6/7/1980),
      // lo convertimos al formato estándar HTML YYYY-MM-DD (ej: 1980-07-06).
      if (typeof val === "string" && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) {
        const parts = val.split("/");
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        const year = parts[2];
        val = `${year}-${month}-${day}`;
      } else if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) {
        // Si viene con formato ISO (ej: 1962-04-22T06:00:00.000Z) o similar, extraemos YYYY-MM-DD
        val = val.substring(0, 10);
      }

      formData[key] = val;
    }
  });

  return formData;
};
