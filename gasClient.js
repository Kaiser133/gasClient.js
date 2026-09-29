/******************************************************************************
 * gasClient.js — CONECTOR CLIENTE ENTRE NETLIFY Y GOOGLE APPS SCRIPT
 ******************************************************************************/

// ⚠️ REEMPLAZA ESTA URL CON LA URL DE TU WEB APP DESPLEGADA EN GOOGLE APPS SCRIPT
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/TU_DEPLOYMENT_ID_AQUI/exec";

/**
 * Función centralizada que sustituye a google.script.run
 */
async function llamarAPI(action, payload = {}) {
  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({ action: action, payload: payload })
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const json = await response.json();
    if (!json.success) {
      throw new Error(json.error || "Error no especificado en el servidor GAS");
    }

    return json.data;
  } catch (err) {
    console.error(`Error al llamar a ${action}:`, err);
    throw err;
  }
}
