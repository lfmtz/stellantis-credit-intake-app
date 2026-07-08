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
      payload[sheetHeader] = formData[key];
    }
  });

  return payload;
};
