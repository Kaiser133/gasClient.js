/******************************************************************************
 * gasClient.js — CONECTOR FRONTEND (NETLIFY) -> BACKEND (APPS SCRIPT)
 ******************************************************************************/

// ⚠️ REEMPLAZA ESTA URL POR TU DESPLIEGUE EXACTO DE GOOGLE APPS SCRIPT
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyJCgBtmwUxvV-xUR_hdI02ip0kDDX01BQSjQCh6iNdaVVEZKpJfV_vcnkk2EZGPpzE/exec";

async function llamarAPI(action, payload = {}) {
  if (!action || typeof action !== "string") {
    console.error("Acción no válida:", action);
    throw new Error("No se especificó una acción válida.");
  }

  try {
    // Se fuerza la acción en la URL para que e.parameter.action NUNCA sea undefined
    const url = `${GAS_WEB_APP_URL}?action=${encodeURIComponent(action)}`;

    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: action,
        payload: payload,
        pin: payload.pin || null
      })
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const json = await response.json();

    if (!json.success) {
      throw new Error(json.error || "Error reportado por Apps Script");
    }

    return json.data;

  } catch (err) {
    console.error(`Error al invocar la acción '${action}':`, err);
    throw err;
  }
}
