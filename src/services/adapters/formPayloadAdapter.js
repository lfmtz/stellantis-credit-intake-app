import { stellantisSheetMap } from "../../flows/stellantis/stellantisSheetMap";

/**
 * Convierte el estado local del formulario de React (camelCase)
 * a un payload estructurado utilizando los cabeceros exactos de Google Sheets.
 */
export const formPayloadAdapter = (formData) => {
  const payload = {};

  Object.keys(formData).forEach((key) => {
    const sheetHeader = stellantisSheetMap[key];
    if (sheetHeader) {
      let val = formData[key];
      
      // Si el valor es una fecha en formato YYYY-MM-DD (ej: 1980-07-06),
      // lo formateamos al formato D/M/YYYY (ej: 6/7/1980) solicitado por el cliente.
      if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
        const parts = val.split("-");
        const year = parts[0];
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        val = `${day}/${month}/${year}`;
      }
      
      payload[sheetHeader] = val;
    }
  });

  return payload;
};
