/**
 * Código de Google Apps Script para recibir datos del formulario de crédito 
 * y guardarlos en una hoja de cálculo con columnas exactas.
 */

// Cabeceros exactos y orden esperados en la hoja de Google Sheets
var HEADERS_ORDER = [
  "Timestamp",
  "Nombre(s) acreditado",
  "Apellido Paterno acreditado",
  "Apellido Materno acreditado",
  "RFC",
  "CURP",
  "Nacionalidad",
  "País de Nacimiento",
  "Entidad Federativa de nacimiento",
  "Fecha de Nacimiento",
  "Número Celular",
  "Compañia telefonica",
  "Correo Electrónico",
  "Calle (solo nombre)",
  "Numero exterior",
  "Numero interior",
  "Colonia acreditado",
  "Código Postal",
  "Municipio ó Alcaldía",
  "Estado",
  "Ciudad o Población",
  "Teléfono de casa fijo o celular",
  "Años de vivir en su domicilio",
  "¿Qué puesto o actividad desempeñas en tu trabajo?",
  "Nombre de la Empresa ó Institución",
  "¿A que se dedica la empresa donde laboras?",
  "Calle trabajo (solo el nombre)",
  "Numero exterior trabajo",
  "Colonia trabajo",
  "Municipio ó Alcaldía trabajo",
  "Estado trabajo",
  "Código Postal trabajo",
  "Teléfono de oficina y extensión ó directo",
  "Nombre de tu Jefe Inmediato",
  "Antigüedad en el empleo, negocio ó jubilado ó pensionado años",
  "Nombre (solo nombre) referencia 1",
  "Apellido Paterno (solo nombre) referencia 1",
  "Parentesco ref 1",
  "Teléfono de la Referencia 1",
  "Ocupacion de la referencia 1",
  "Nombre (solo nombre) referencia 2",
  "Apellido Paterno (solo nombre) referencia 2",
  "Parentesco ref 2",
  "Teléfono de la Referencia 2",
  "Ocupacion de la referencia 2",
  "Nombre (solo nombre) referencia 3",
  "Apellido Paterno (solo nombre) referencia 3",
  "Parentesco ref 3",
  "Teléfono de la Referencia 3",
  "Ocupacion de la referencia 3"
];

function doPost(e) {
  try {
    // Parseo de los datos del POST
    var jsonString = e.postData.contents;
    var data = JSON.parse(jsonString);
    
    // Abrir la hoja activa por el nombre de la pestaña específica
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Respuestas de formulario 1");
    if (!sheet) {
      // Fallback si por alguna razón no se llama exactamente igual
      sheet = ss.getActiveSheet();
    }
    
    // Si la hoja está vacía, creamos los cabeceros oficiales
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS_ORDER);
    }
    
    // Leer los cabeceros que existen actualmente en la primera fila de la hoja
    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var headersRange = sheet.getRange(1, 1, 1, lastCol);
    var sheetHeaders = headersRange.getValues()[0];
    
    // Generar la nueva fila alineando dinámicamente con los cabeceros del Google Sheet
    var row = [];
    for (var i = 0; i < sheetHeaders.length; i++) {
      var headerName = sheetHeaders[i].toString().trim();
      var lowerHeader = headerName.toLowerCase();
      // Detecta "Timestamp", "Marca temporal", "Marca Temporal", "fecha", etc.
      if (lowerHeader === "timestamp" || lowerHeader === "marca temporal") {
        row.push(new Date());
      } else {
        var value = data[headerName];
        row.push(value !== undefined ? value : "");
      }
    }
    
    // Guardar fila en Google Sheets
    sheet.appendRow(row);
    
    // Retornar éxito
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Registro guardado exitosamente"
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Manejar preflight CORS de navegadores modernos
function doOptions(e) {
  return ContentService.createTextOutput("");
}
