# Stellantis Credit Intake App

Formulario conversacional inteligente diseñado para capturar solicitudes de crédito Stellantis, guardar las respuestas en Google Sheets y dejar la estructura mapeada para el llenado automático de PDF.

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior instalado.
- Una cuenta de Google para alojar la hoja de Google Sheets y publicar la Google Apps Script Web App.

---

## 🛠️ Configuración Local

1. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la raíz del proyecto para enlazar tu backend de Google Apps Script:
   ```env
   VITE_SHEETS_API_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec
   ```
   *Nota: Si dejas el archivo `.env` vacío, el frontend entrará en **modo simulación local**, permitiéndote probar la interfaz completa y revisar el JSON de salida directamente sin mandar llamadas de red.*

3. Inicia el servidor de desarrollo local:
   ```bash
   npm run dev
   ```

---

## 📝 Configuración de Google Sheets y Google Apps Script

Sigue estos pasos detallados para conectar tu base de datos:

1. **Crear Google Sheet**:
   Crea una nueva hoja de cálculo en Google Sheets. Copia los cabeceros exactos del archivo [field-mapping.md](file:///c:/Users/luism/Documents/stellantis-credit-intake-app/docs/field-mapping.md) en la primera fila (Fila 1) en orden horizontal.

2. **Abrir editor de Scripts**:
   En tu Google Sheet, haz clic en **Extensiones** > **Apps Script**.

3. **Pegar Código**:
   Borra cualquier código existente y pega el contenido del archivo [Code.gs](file:///c:/Users/luism/Documents/stellantis-credit-intake-app/apps-script/Code.gs).

4. **Implementar como Web App**:
   - Haz clic en **Implementar** (en la esquina superior derecha) > **Nueva implementación**.
   - Haz clic en el engranaje de configuración y selecciona **Aplicación web**.
   - Configura las opciones:
     - *Descripción*: `Stellantis Credit Web App`
     - *Ejecutar como*: `Tu usuario (correo de Google)`
     - *Quién tiene acceso*: `Cualquier persona` (Esto es requerido para recibir los POST desde el formulario sin autenticación compleja).
   - Haz clic en **Implementar**.
   - Copia la **URL de la aplicación web** (termina en `/exec`).

5. **Actualizar el archivo `.env`**:
   Pega la URL de la aplicación web obtenida en tu archivo `.env` local (`VITE_SHEETS_API_URL`).

---

## 🌍 Despliegue en GitHub Pages

Para publicar la aplicación web de manera estática y gratuita en GitHub Pages:

1. Agrega el paquete `gh-pages` como dependencia de desarrollo:
   ```bash
   npm install -D gh-pages
   ```

2. Añade la propiedad `homepage` y los scripts de despliegue a tu `package.json`:
   ```json
   "homepage": "https://nombre-usuario-github.github.io/nombre-repositorio",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Ejecuta el comando de despliegue:
   ```bash
   npm run deploy
   ```
