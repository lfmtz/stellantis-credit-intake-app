/**
 * Cliente API para interactuar con el endpoint de Google Apps Script Web App.
 */

export const submitFormToSheets = async (payload) => {
  const url = import.meta.env.VITE_SHEETS_API_URL;
  
  if (!url) {
    console.warn("VITE_SHEETS_API_URL no está definida en las variables de entorno. Simulando envío local...");
    // Simulamos una respuesta exitosa para pruebas de desarrollo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Modo simulación local: datos procesados exitosamente",
          data: payload
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

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al enviar datos a Google Sheets:", error);
    throw error;
  }
};
