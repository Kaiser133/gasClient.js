/******************************************************************************
 * gasClient.js — CONECTOR ENTRE NETLIFY Y GOOGLE APPS SCRIPT
 ******************************************************************************/

// ⚠️ Coloca la URL exacta de tu despliegue ejecutable de Google Apps Script
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/TU_DEPLOYMENT_ID_AQUI/exec";

async function llamarAPI(action, payload = {}) {
  // Validación estricta para evitar que la acción viaje vacía
  if (!action || typeof action !== "string") {
    console.error("Acción no válida enviada a llamarAPI:", action);
    throw new Error("No se especificó una acción válida.");
  }

  try {
    // Se envía 'action' como parámetro URL para garantizar que Apps Script la capture
    const url = `${GAS_WEB_APP_URL}?action=${encodeURIComponent(action)}`;

    const bodyData = {
      action: action,
      payload: payload,
      pin: payload.pin || null
    };

    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const json = await response.json();

    if (!json.success) {
      throw new Error(json.error || "Error en el servidor Apps Script");
    }

    return json.data;

  } catch (err) {
    console.error(`Error al ejecutar ${action}:`, err);
    throw err;
  }
}
