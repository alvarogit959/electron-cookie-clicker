const axios = require('axios');

async function enviarMensajeTelegram(mensaje) {

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram no configurado');
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  return axios.post(url, {
    chat_id: chatId,
    text: mensaje,
    parse_mode: 'Markdown'
  });
}

async function obtenerActualizaciones() {

  const token = process.env.TELEGRAM_BOT_TOKEN;

  const url = `https://api.telegram.org/bot${token}/getUpdates`;

  const response = await axios.get(url);
  return response.data;
}

module.exports = {
  enviarMensajeTelegram,
  obtenerActualizaciones
};
