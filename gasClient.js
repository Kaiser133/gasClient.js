const URL_API = https://script.google.com/macros/s/AKfycbxt94thOeZKs7f02URaIEzfaBn02StSuv2tBy_uFiHnLbSYJWLo9atstby71Ok-b8Mn/exec; // Pega aquí tu URL que termina en /exec

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
