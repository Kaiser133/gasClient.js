var GAS_URL = "https://script.google.com/macros/s/AKfycbyJCgBtmwUxvV-xUR_hdI02ip0kDDX01BQSjQCh6iNdaVVEZKpJfV_vcnkk2EZGPpzE/exec";

async function llamarAPI(action, payload) {
  payload = payload || {};
  try {
    var response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: action, payload: payload })
    });
    return await response.json();
  } catch (err) {
    // Respaldo mediante GET si falla POST por restricciones de red o CORS
    var url = GAS_URL + '?action=' + encodeURIComponent(action) + '&payload=' + encodeURIComponent(JSON.stringify(payload));
    var res = await fetch(url);
    return await res.json();
  }
}
