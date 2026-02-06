require('dotenv').config();
const { enviarMensajeTelegram } = require('./src/utils/telegram');

enviarMensajeTelegram("Test desde Node!")
  .then(() => console.log('Mensaje enviado correctamente'))
  .catch(err => console.error('Error Telegram:', err.response?.data || err));
