/**
 * Cliente API para interactuar con el endpoint de Google Apps Script Web App.
 */

const getApiUrl = () => {
  return import.meta.env.VITE_SHEETS_API_URL || "https://script.google.com/macros/s/AKfycbzHw1GgzD58evJrZJqYzAVPHOV53vH_7EBvpDlSaEoASAdlOhFMKFMsykGUFiy-RCebag/exec";
};

// Generación de datos dummy/mock local en caso de que no haya API URL configurada
const dummyData = [
  {
    rowId: 2,
    "Timestamp": "30/7/2026 12:45:00",
    "Nombre(s) acreditado": "Luis",
    "Apellido Paterno acreditado": "Martínez",
    "Apellido Materno acreditado": "Gómez",
    "RFC": "MAGL800706XYZ",
    "CURP": "MAGL800706HDFRRN01",
    "País de Nacimiento": "México",
    "Entidad Federativa de nacimiento": "Ciudad de México",
    "Fecha de Nacimiento": "6/7/1980",
    "Número Celular": "5512345678",
    "Compañia telefonica": "Telcel",
    "Correo Electrónico": "luis.martinez@ejemplo.com",
    "Calle (solo nombre)": "Av. Insurgentes Sur",
    "Numero exterior": "1234",
    "Colonia acreditado": "Del Valle",
    "Código Postal": "03100",
    "Municipio ó Alcaldía": "Benito Juárez",
    "Estado": "Ciudad de México",
    "Ciudad o Población": "Ciudad de México",
    "Teléfono de casa fijo o celular": "5555432100",
    "Años de vivir en su domicilio": "5",
    "¿Qué puesto o actividad desempeñas en tu trabajo?": "Gerente de TI",
    "Nombre de la Empresa ó Institución": "Stellantis México",
    "¿A que se dedica la empresa donde laboras?": "Automotriz",
    "Calle trabajo (solo el nombre)": "Paseo de la Reforma",
    "Numero exterior trabajo": "505",
    "Colonia trabajo": "Cuauhtémoc",
    "Municipio ó Alcaldía trabajo": "Cuauhtémoc",
    "Estado trabajo": "Ciudad de México",
    "Código Postal trabajo": "06500",
    "Teléfono de oficina y extensión ó directo": "5550800000 Ext 4321",
    "Nombre de tu Jefe Inmediato": "Carlos Slim",
    "Antigüedad en el empleo, negocio ó jubilado ó pensionado años": "10",
    "Nombre (solo nombre) referencia 1": "Pedro",
    "Apellido Paterno (solo nombre) referencia 1": "Pérez",
    "Parentesco ref 1": "Hermano",
    "Teléfono de la Referencia 1": "5599887766",
    "Ocupacion de la referencia 1": "Ingeniero",
    "Nombre (solo nombre) referencia 2": "Ana",
    "Apellido Paterno (solo nombre) referencia 2": "García",
    "Parentesco ref 2": "Prima",
    "Teléfono de la Referencia 2": "5566778899",
    "Ocupacion de la referencia 2": "Abogada",
    "Nombre (solo nombre) referencia 3": "Juan",
    "Apellido Paterno (solo nombre) referencia 3": "Hernández",
    "Parentesco ref 3": "Amigo",
    "Teléfono de la Referencia 3": "5511223344",
    "Ocupacion de la referencia 3": "Médico"
  }
];

export const submitFormToSheets = async (payload) => {
  const url = getApiUrl();
  
  if (!url) {
    console.warn("VITE_SHEETS_API_URL no está definida en las variables de entorno. Simulando envío local...");
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRowId = dummyData.length + 2;
        const newRecord = { rowId: newRowId, ...payload, Timestamp: new Date().toLocaleString() };
        dummyData.push(newRecord);
        resolve({
          success: true,
          message: "Modo simulación local: datos procesados exitosamente",
          data: newRecord
        });
      }, 1500);
    });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al enviar datos a Google Sheets:", error);
    throw error;
  }
};

export const getRequestsFromSheets = async () => {
  const url = getApiUrl();

  if (!url) {
    console.warn("VITE_SHEETS_API_URL no está definida. Cargando mock local...");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dummyData);
      }, 1000);
    });
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener datos de Google Sheets:", error);
    // Fallback a dummy data en caso de fallo de red
    return dummyData;
  }
};

export const updateFormInSheets = async (rowId, payload) => {
  const url = getApiUrl();

  const updatePayload = {
    action: "update",
    rowId: rowId,
    ...payload
  };

  if (!url) {
    console.warn("VITE_SHEETS_API_URL no está definida. Simulando actualización local...");
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = dummyData.findIndex(item => item.rowId === rowId);
        if (index !== -1) {
          dummyData[index] = { ...dummyData[index], ...payload };
          resolve({
            success: true,
            message: "Modo simulación local: Registro actualizado exitosamente"
          });
        } else {
          resolve({
            success: false,
            error: "Registro no encontrado en mock local"
          });
        }
      }, 1500);
    });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(updatePayload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar datos en Google Sheets:", error);
    throw error;
  }
};
