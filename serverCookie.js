require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const { inngest } = require('./src/inngest/client');
const { serve } = require('inngest/express');
const { scoreRegistrado } = require('./src/inngest/functions/scoreWorkflow');

const { enviarMensajeTelegram, obtenerActualizaciones } = require('./src/utils/telegram');


obtenerActualizaciones().then(console.log);
enviarMensajeTelegram("Test");

const app = express();
app.use(cors());
app.use(express.json());
//npm install mongodb@4.1
//mongodb+srv://alvarod_db_user:ChangeMe@clustervending.o3ch2ve.mongodb.net/?appName=ClusterVending
//alvarod_db_user ChangeMe

//CREAR SERVIDOR
const server = http.createServer(app);


//WEBSOCKET PARA ADMINSITRACIÓN
const WebSocket = require('ws');
const wss = new WebSocket.Server({
  server: server,
});

//ALMACENAR CONEXIONES
const wsConnections = {
  android: new Map(),
  admin: new Set()
};
//CONEXION MONGO
mongoose.connect('mongodb+srv://alvarod_db_user:ChangeMe@clustervending.o3ch2ve.mongodb.net/?appName=ClusterVending')
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err));

const scoreSchema = new mongoose.Schema({
  clicks: Number,
  createdAt: { type: Date, default: Date.now }
 /* name: String, 
  clicks: Number*/
});
const Score = mongoose.model('Score', scoreSchema);

 app.use('/api/inngest', serve({
  client: inngest,
  functions: [scoreRegistrado]
}));

app.get('/', (req, res) => {
  res.send('Servidor scoresCoockies. Rutas: /cookies');
});
app.get('/health', (req, res) => {
  res.json({ status: 'running', timestamp: new Date() });
});

//Obtener todo
app.post('/cookies', async (req, res) => {
  try {
    const { clicks } = req.body;

    if (clicks === undefined) {
      return res.status(400).json({ error: 'Falta clicks' });
    }

    const newScore = new Score({ clicks });
    await newScore.save();

//INNCEST
    await inngest.send({
      name: 'score/registrado',
      data: {
        clicks,
        createdAt: newScore.createdAt
      }
    });

    res.status(201).json(newScore);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error guardando' });
  }
});


app.get('/cookies', async (req, res) => {
  try {
    const scores = await Score.find().sort({ clicks: -1 })
//LIMITAR A 10
    .limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Error en GET' });
  }
});


//INICAR SERVIDOR ==================== IP ADECUADA??
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
  console.log(`Servidor WebSocket corriendo en ws://localhost:${PORT}`);
});

//ERROES
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Excepción no capturada:', err);
});