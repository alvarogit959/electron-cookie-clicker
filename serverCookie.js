const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

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
mongoose.connect('mongodb+srv://alvarod_db_user:ChangeMe@clustervending.o3ch2ve.mongodb.net/vending?appName=ClusterVending')
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err));

const scoreSchema = new mongoose.Schema({
  name: String, 
  time: Number,  //No es Date, no
  difficulty: String
});
const Score = mongoose.model('Score', scoreSchema);
 
app.get('/', (req, res) => {
  res.send('Servidor Vending. Rutas: /scores');
});
app.get('/health', (req, res) => {
  res.json({ status: 'running', timestamp: new Date() });
});

//Obtener todos los sudokus
app.post('/scores', async (req, res) => {
  try {
    const { name, time, difficulty } = req.body;
    //test luego borrar!
        if (!name || time === undefined || !difficulty) {
      return res.status(400).json({ error: 'Faltan campos: name, time o difficulty' });
    }
    ///
    const newScore = new Score({
      name: name,
      time: time,
      difficulty: difficulty
    });
    
    await newScore.save();
   console.log('Puntaje guardado en BD:', newScore);
   res.status(201).json({
      message: 'Puntaje guardado exitosamente',
      id: newScore._id
    });

  } catch (error) {
    console.error('Error guardando:', error);
    res.status(500).json({ error: 'Error guardando' });
  }
});
app.get('/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ time: 1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Error en el get' });
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