const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');

const sensorsRoutes = require('./routes/sensors.routes');
const alertsRoutes = require('./routes/alerts.routes');
const dbRoutes = require('./routes/db.routes');
const exportRoutes = require('./routes/export.routes');
const importRoutes = require('./routes/import.routes');
const logsRoutes = require('./routes/logs.routes');
const userRoutes = require('./routes/users.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/sensors', sensorsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/db', dbRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/import', importRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/users', userRoutes);

router.post('/api/openBuffet', async (req, res) => {
  try {
    const response = await fetch('http://10.147.18.50:8080/buffet-food-quality-analyzer-01/actions/openBuffet', {
      method: 'POST',
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao enviar comando para o buffet.' });
    }

    res.json({ message: "Comando 'openBuffet' enviado com sucesso!" });
  } catch (error) {
    console.error('Erro no proxy:', error.message);
    res.status(500).json({ error: 'Erro no servidor proxy.' });
  }
});

router.post('/api/closeBuffet', async (req, res) => {
  try {
    const response = await fetch('http://10.147.18.50:8080/buffet-food-quality-analyzer-01/actions/closeBuffet', {
      method: 'POST',
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao enviar comando para o buffet.' });
    }

    res.json({ message: "Comando 'closeBuffet' enviado com sucesso!" });
  } catch (error) {
    console.error('Erro no proxy:', error.message);
    res.status(500).json({ error: 'Erro no servidor proxy.' });
  }
});

router.post('/api/currentSensorData', async (req, res) => {
  try {
    const response = await fetch('http://10.147.18.50:8080/buffet-food-quality-analyzer-01/properties/currentSensorData', {
      method: 'GET',
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao enviar comando para o buffet.' });
    }

    res.json({ message: "Comando 'currentSensorData' enviado com sucesso!" });
  } catch (error) {
    console.error('Erro no proxy:', error.message);
    res.status(500).json({ error: 'Erro no servidor proxy.' });
  }
});




module.exports = app;
