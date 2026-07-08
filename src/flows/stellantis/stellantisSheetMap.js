import { stellantisFieldSchema } from "./stellantisFieldSchema";

// Genera un mapeo dinámico desde las keys del formulario en el frontend
// hacia los cabeceros exactos esperados por el Google Sheet.
export const stellantisSheetMap = Object.keys(stellantisFieldSchema).reduce((acc, key) => {
  acc[key] = stellantisFieldSchema[key].sheetHeader;
  return acc;
}, {});

// Exportamos explícitamente el mapa estático de cabeceros para validación rápida
export const stellantisSheetHeaders = Object.values(stellantisSheetMap);
