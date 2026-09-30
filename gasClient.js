/******************************************************************************
 * gasClient.js — CONECTOR FRONTEND (NETLIFY) -> BACKEND (APPS SCRIPT)
 ******************************************************************************/

// ⚠️ REEMPLAZA ESTA URL POR LA TUYA EXACTA DE GOOGLE APPS SCRIPT
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/TU_DEPLOYMENT_ID_AQUI/exec";

async function llamarAPI(action, payload = {}) {
  // 1. Verificación estricta de la acción
  if (!action || typeof action !== "string") {
    console.error("Acción recibida no válida:", action);
    throw new Error("No se definió una acción válida.");
  }

  try {
    // 2. Enviamos 'action' directamente en la URL (Query Param) para garantizar que GAS la capture
    const url = `${GAS_WEB_APP_URL}?action=${encodeURIComponent(action)}`;

    // 3. Petición POST enviando JSON
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
    console.error(`Error al invocar ${action}:`, err);
    throw err;
  }
}

// ============================================================================
// FUNCIÓN MANEJADORA DEL BOTÓN "ENTRAR" EN PANTALLA DE LOGIN
// ============================================================================
async function ejecutarLogin() {
  const pinInput = document.getElementById("pinInput") || document.querySelector("input[type='password']") || document.querySelector("input[type='text']");
  const errorBox = document.getElementById("errorMensaje") || document.getElementById("loginError");
  
  const pin = pinInput ? pinInput.value.trim() : "";

  if (!pin) {
    if (errorBox) errorBox.innerText = "Escribe tu clave para entrar.";
    return;
  }

  try {
    if (errorBox) errorBox.innerText = "Verificando...";

    // Llamada explícita con la acción 'loginConPin'
    const respuesta = await llamarAPI("loginConPin", { pin: pin });

    if (respuesta && respuesta.ok) {
      localStorage.setItem("token", respuesta.token);
      localStorage.setItem("rol", respuesta.rol);
      localStorage.setItem("nombre", respuesta.nombre);
      
      // Recargar o ingresar al sistema
      window.location.reload();
    } else {
      if (errorBox) errorBox.innerText = respuesta.mensaje || "Clave incorrecta.";
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    if (errorBox) errorBox.innerText = "Error: " + error.message;
  }
}
