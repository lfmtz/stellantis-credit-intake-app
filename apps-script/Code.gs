/**
 * Código de Google Apps Script para recibir datos del formulario de crédito 
 * y guardarlos en una hoja de cálculo con columnas exactas.
 */

// Contraseña de seguridad para acceso administrativo (lectura y edición)
// Cambia este valor por la contraseña que tú decidas usar
var ADMIN_PASSWORD = "stellantis2026";

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

function doGet(e) {
  try {
    // Validar contraseña
    var password = e && e.parameter && e.parameter.password;
    if (password !== ADMIN_PASSWORD) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "No autorizado. Proporcione la contraseña correcta."
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Respuestas de formulario 1");
    if (!sheet) {
      sheet = ss.getActiveSheet();
    }
    
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    
    if (lastRow <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
    var values = dataRange.getValues();
    
    var records = [];
    for (var r = 0; r < values.length; r++) {
      var record = {
        rowId: r + 2 // Las filas en Sheets empiezan en 1, y la fila 1 son cabeceras, por lo que los datos empiezan en la fila 2
      };
      for (var c = 0; c < headers.length; c++) {
        var headerName = headers[c].toString().trim();
        if (headerName) {
          record[headerName] = values[r][c];
        }
      }
      records.push(record);
    }
    
    return ContentService.createTextOutput(JSON.stringify(records))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

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
    
    // Si la acción es actualizar
    if (data.action === "update" && data.rowId) {
      // Validar contraseña para edición
      if (data.password !== ADMIN_PASSWORD) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: "No autorizado. Proporcione la contraseña correcta."
        }))
        .setMimeType(ContentService.MimeType.JSON);
      }

      var rowId = parseInt(data.rowId, 10);
      if (rowId >= 2 && rowId <= sheet.getLastRow()) {
        // En lugar de appendRow, actualizamos la fila existente
        for (var i = 0; i < sheetHeaders.length; i++) {
          var headerName = sheetHeaders[i].toString().trim();
          var lowerHeader = headerName.toLowerCase();
          
          // No actualizamos el Timestamp original para mantener la fecha original de registro
          if (lowerHeader !== "timestamp" && lowerHeader !== "marca temporal") {
            var value = getValueFromData(data, headerName);
            if (value !== undefined) {
              sheet.getRange(rowId, i + 1).setValue(value);
            }
          }
        }
        
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          message: "Registro actualizado exitosamente"
        }))
        .setMimeType(ContentService.MimeType.JSON);
      } else {
        throw new Error("ID de fila inválido para actualización: " + rowId);
      }
    }
    
    // Generar la nueva fila alineando dinámicamente con los cabeceros del Google Sheet
    var row = [];
    for (var i = 0; i < sheetHeaders.length; i++) {
      var headerName = sheetHeaders[i].toString().trim();
      var lowerHeader = headerName.toLowerCase();
      // Detecta "Timestamp", "Marca temporal", "Marca Temporal", "fecha", etc.
      if (lowerHeader === "timestamp" || lowerHeader === "marca temporal") {
        row.push(new Date());
      } else {
        var value = getValueFromData(data, headerName);
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

// Helper robusto para obtener valores de un objeto sin importar la normalización o diferencias de acento
function getValueFromData(data, headerName) {
  var normalizedHeader = headerName.toString().trim().normalize("NFC").toLowerCase();
  for (var key in data) {
    if (key.toString().trim().normalize("NFC").toLowerCase() === normalizedHeader) {
      return data[key];
    }
  }
  return undefined;
}

// Manejar preflight CORS de navegadores modernos
function doOptions(e) {
  return ContentService.createTextOutput("");
}

/**
 * Función de una sola ejecución para normalizar todas las fechas existentes 
 * en la columna "Fecha de Nacimiento" al formato DD/MM/YYYY.
 * 
 * Para ejecutarla:
 * 1. Abre el editor de Apps Script en Google Sheets (Extensiones -> Apps Script).
 * 2. Selecciona la función "normalizarFechasExistentes" en la barra de herramientas superior.
 * 3. Haz clic en "Ejecutar".
 */
function normalizarFechasExistentes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Respuestas de formulario 1");
  if (!sheet) {
    sheet = ss.getActiveSheet();
  }
  
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;
  
  // Encontrar la columna "Fecha de Nacimiento"
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var colIndex = -1;
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].toString().trim() === "Fecha de Nacimiento") {
      colIndex = i + 1;
      break;
    }
  }
  
  if (colIndex === -1) {
    console.log("No se encontró la columna 'Fecha de Nacimiento'");
    return;
  }
  
  var range = sheet.getRange(2, colIndex, lastRow - 1, 1);
  var values = range.getValues();
  
  for (var r = 0; r < values.length; r++) {
    var val = values[r][0];
    if (val) {
      var dateStr = val.toString().trim();
      
      // Si es un objeto Date nativo en Apps Script
      if (val instanceof Date) {
        var day = ("0" + val.getDate()).slice(-2);
        var month = ("0" + (val.getMonth() + 1)).slice(-2);
        var year = val.getFullYear();
        var formattedDate = day + "/" + month + "/" + year;
        sheet.getRange(r + 2, colIndex).setValue(formattedDate);
      } 
      // Si es un string en formato ISO o YYYY-MM-DD
      else {
        var isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2}))?/);
        if (isoMatch) {
          var year = isoMatch[1];
          var month = isoMatch[2];
          var day = isoMatch[3];
          var formattedDate = day + "/" + month + "/" + year;
          sheet.getRange(r + 2, colIndex).setValue(formattedDate);
        }
      }
    }
  }
}
