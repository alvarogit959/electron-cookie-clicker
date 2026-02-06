import { inngest } from '../client.js';
import { enviarMensajeTelegram } from '../../utils/telegram.js';

export const scoreRegistrado = inngest.createFunction(
  { id: 'score-registrado' },
  { event: 'score/registrado' },

  async ({ event, step }) => {

    await step.run('notificar-telegram', async () => {

      const mensaje =
        `*Nueva partida terminada*\n\n` +
        `Clicks: *${event.data.clicks}*\n` +
        `Fecha: ${new Date(event.data.createdAt).toLocaleString()}`;

      return enviarMensajeTelegram(mensaje);
    });

  }
);

