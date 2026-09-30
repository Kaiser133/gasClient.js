/******************************************************************************
 * gasClient.js — CONECTOR NETLIFY A GOOGLE APPS SCRIPT
 ******************************************************************************/

const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyJCgBtmwUxvV-xUR_hdI02ip0kDDX01BQSjQCh6iNdaVVEZKpJfV_vcnkk2EZGPpzE/exec";

async function llamarAPI(actionName, payloadData) {
  var action = actionName;
  var payload = payloadData;

  // Maneja llamarAPI('loginConPin', { pin: '1234' })
  if (typeof actionName === 'string' && payloadData !== undefined) {
    action = actionName;
    payload = payloadData;
  } 
  // Maneja llamarAPI({ action: 'loginConPin', payload: {...} })
  else if (typeof actionName === 'object' && actionName !== null) {
    action = actionName.action;
    payload = actionName.payload || actionName;
  }

  if (!action || typeof action !== 'string') {
    throw new Error('No se especificó una acción válida.');
  }

  payload = payload || {};

  try {
    // Forzar el parámetro action en la URL
    var url = GAS_WEB_APP_URL + '?action=' + encodeURIComponent(action);

    var bodyObj = {
      action: action,
      payload: payload,
      pin: payload.pin || null,
      token: payload.token || payload._token || null
    };

    var response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(bodyObj)
    });

    if (!response.ok) {
      throw new Error('Error HTTP: ' + response.status);
    }

    var json = await response.json();

    if (!json.success) {
      throw new Error(json.error || 'Error reportado por Apps Script');
    }

    return json.data;

  } catch (err) {
    console.error("Error en llamarAPI (" + action + "):", err);
    throw err;
  }
}
