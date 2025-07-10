const { getMongoClient } = require('../db/mongo');
const { logEvent } = require('../utils/logger');

async function createAlert(req, res) {
  const { sensorId, metric, condition, threshold, sendEmail, sendToast } = req.body;

  if (!sensorId || !metric || !condition || threshold === undefined) {
    return res.status(400).json({ message: 'Dados do alerta incompletos.' });
  }

  let alertId;

  if (metric == 'humidity') {
    alertId = `alert-${Date.now()}-${sensorId}-humidityAlert`;
  } else if (metric == 'temperature') {
    alertId = `alert-${Date.now()}-${sensorId}-temperatureAlert`
  } else if (metric == 'co2') {
    alertId = `alert-${Date.now()}-${sensorId}-co2Alert`
  } else if (metric == 'tvoc') {
    alertId = `alert-${Date.now()}-${sensorId}-tvocAlert`
  }
  

  const newAlert = {
    alertId,
    sensorId,
    metric,
    condition,
    threshold,
    sendEmail: !!sendEmail,
    sendToast: !!sendToast,
    createdAt: new Date()
  };

  try {
    const db = await getMongoClient();
    await db.collection('alerts').insertOne(newAlert);

    res.status(201).json({ message: 'Alerta criado com sucesso!', alert: newAlert });
  } catch (error) {
    console.error('[Erro ao criar alerta]', error);
    res.status(500).json({ message: 'Erro ao criar alerta.' });
  }
}


async function getAllAlerts(req, res) {
  try {
    const db = await getMongoClient();
    const alerts = await db.collection('alerts').find({}).sort({ createdAt: -1 }).toArray();

    res.status(200).json(alerts);
  } catch (error) {
    console.error('[Erro ao obter alertas]', error);
    res.status(500).json({ message: 'Erro ao obter alertas.' });
  }
}

const { ObjectId } = require('mongodb');

async function deleteAlert(req, res) {
  const { id } = req.params;

  try {
    const db = await getMongoClient();
    const result = await db.collection('alerts').deleteOne({ alertId: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Alerta não encontrado.' });
    }

    res.status(200).json({ message: 'Alerta eliminado com sucesso.' });
  } catch (error) {
    console.error('[Erro ao eliminar alerta]', error);
    res.status(500).json({ message: 'Erro ao eliminar alerta.' });
  }
}




module.exports = {
  createAlert,
  getAllAlerts,
  deleteAlert
};
