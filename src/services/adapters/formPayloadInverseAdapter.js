import { stellantisFieldSchema } from "../../flows/stellantis/stellantisFieldSchema.js";

// Normaliza texto quitando espacios extra y pasando a minúsculas (con y sin acentos)
const normalizeExact = (str) => String(str || "").normalize("NFC").trim().toLowerCase();
const normalizeNoAccents = (str) =>
  String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

// Genera un mapeo inverso desde los cabeceros de Google Sheet hacia TODAS las keys asociadas
// (por ejemplo, "RFC" alimenta tanto a "rfc" del titular como a "rfcAcreditado" del modo cónyuge)
const inverseMapExact = {};
const inverseMapNoAccents = {};

Object.keys(stellantisFieldSchema).forEach((key) => {
  const header = stellantisFieldSchema[key].sheetHeader;
  if (header) {
    const exactKey = normalizeExact(header);
    const noAccentKey = normalizeNoAccents(header);

    if (!inverseMapExact[exactKey]) inverseMapExact[exactKey] = [];
    if (!inverseMapExact[exactKey].includes(key)) inverseMapExact[exactKey].push(key);

    if (!inverseMapNoAccents[noAccentKey]) inverseMapNoAccents[noAccentKey] = [];
    if (!inverseMapNoAccents[noAccentKey].includes(key)) inverseMapNoAccents[noAccentKey].push(key);
  }
});

// Alias adicionales comunes para RFC en caso de que la columna en Sheets tenga variante de nombre
["rfc acreditado", "rfc del acreditado", "rfc titular", "rfc con homoclave"].forEach((alias) => {
  inverseMapExact[alias] = ["rfc", "rfcAcreditado"];
  inverseMapNoAccents[alias] = ["rfc", "rfcAcreditado"];
});

/**
 * Convierte un registro obtenido de Google Sheets (con cabeceros en español)
 * al estado local del formulario de React (camelCase).
 */
export const formPayloadInverseAdapter = (sheetData) => {
  const formData = {};

  if (!sheetData || typeof sheetData !== "object") {
    return formData;
  }

  Object.keys(sheetData).forEach((header) => {
    const exactHeader = normalizeExact(header);
    const noAccentHeader = normalizeNoAccents(header);
    const matchedKeys = inverseMapExact[exactHeader] || inverseMapNoAccents[noAccentHeader];

    if (matchedKeys && matchedKeys.length > 0) {
      let val = sheetData[header];

      if (val === undefined || val === null) {
        val = "";
      }

      // Convertir valores numéricos a string (como teléfonos o códigos postales) para que React los maneje correctamente
      if (typeof val === "number") {
        val = String(val);
      }

      // Si el valor es una fecha en formato D/M/YYYY (ej: 6/7/1980),
      // lo convertimos al formato estándar HTML YYYY-MM-DD (ej: 1980-07-06).
      if (typeof val === "string" && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val.trim())) {
        const parts = val.trim().split("/");
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        const year = parts[2];
        val = `${year}-${month}-${day}`;
      } else if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val.trim())) {
        // Si viene con formato ISO (ej: 1962-04-22T06:00:00.000Z) o similar, extraemos YYYY-MM-DD
        val = val.trim().substring(0, 10);
      } else if (typeof val === "string") {
        // Convertir campos de texto a MAYÚSCULAS para que la edición muestre siempre mayúsculas
        val = val.toUpperCase().trim();
      }

      matchedKeys.forEach((key) => {
        // No sobreescribir un valor ya encontrado con uno vacío
        if (val !== "" || !formData[key]) {
          formData[key] = val;
        }
      });
    }
  });

  return formData;
};
