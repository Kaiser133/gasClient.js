const URL_API = 'https://script.google.com/macros/s/AKfycbwWQusZZzlQ6dOg074_sw3Wf4k8aABIPITF5jNgtq2V8s4hU0unyZkF8_YWhR57U5iH/exec';

let tokenSesionLocal = localStorage.getItem('RESUELVE_TOKEN') || null;

export async function llamarAPI(accion, datos = {}) {
  try {
    const respuesta = await fetch(URL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        accion: accion,
        datos: datos,
        token: tokenSesionLocal
      })
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const json = await respuesta.json();

    if (!json.ok) {
      throw new Error(json.error || 'Error en el servidor');
    }

    if (accion === 'loginConPin' && json.data && json.data.ok) {
      tokenSesionLocal = json.data.token;
      localStorage.setItem('RESUELVE_TOKEN', tokenSesionLocal);
    }

    return json.data;

  } catch (err) {
    console.error(`[API Error] ${accion}:`, err);
    throw err;
  }
}
}
