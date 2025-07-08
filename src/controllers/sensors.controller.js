const { get } = require('../app');
const { getMongoClient } = require('../db/mongo');
const { logEvent } = require('../utils/logger');

const COLLECTION = 'sensorsData';

const getAllSensorData = async (req, res) => {
  try {
    const db = await getMongoClient();
    const data = await db.collection(COLLECTION).find({}).sort({ date: 1 }).toArray();
    res.status(200).json(data);
  } catch (err) {
    console.error('[Erro ao obter dados de sensores]', err);
    res.status(500).json({ error: 'Erro ao obter dados dos sensores' });
  }
};

async function getSensorData(req, res) {
  const sensorId = req.params.sensorId;

  try {
    const db = await getMongoClient();
    const data = await db
      .collection(COLLECTION)
      .find({ sensorId: sensorId })
      .sort({ timestamp: 1 })
      .toArray();

    res.status(200).json(data);
  } catch (error) {
    console.error(`[Erro ao obter dados do sensor ${sensorId}]`, error);
    res.status(500).json({ message: 'Erro ao obter dados do sensor.' });
  }
}

async function getAllSensorIds(req, res) {
  try {
    const db = await getMongoClient();
    const sensors = await db.collection('sensorLocation').find({}).toArray();

    const result = sensors.map((doc) => ({
      sensorId: doc._id,
      location: doc.data?.location?.value || 'Desconhecido',
      lastModified: doc.data?.location?.lastModified || null,
    }));

    res.status(200).json(result);

  } catch (error) {
    console.error('[Erro ao obter sensor IDs]', error);
    res.status(500).json({ message: 'Erro ao obter sensores.' });
  }
}

async function getSensorTD(req, res) {
  const { sensorId } = req.params;

  try {
    const db = await getMongoClient();
    const tdDoc = await db.collection('TDs').findOne({ _id: sensorId });

    if (!tdDoc) {
      return res.status(404).json({ message: 'Sensor não encontrado' });
    }

    res.status(200).json(tdDoc.thing); // retorna apenas a Thing Description
  } catch (error) {
    console.error('[Erro ao obter TD do sensor]', error);
    res.status(500).json({ message: 'Erro ao obter descrição do sensor' });
  }
}

async function updateSensorTD(req, res) {
  const { sensorId } = req.params;
  const updatedTD = req.body;

  // Verificação mínima de integridade da TD
  if (
    !updatedTD ||
    !updatedTD.thing ||
    !updatedTD.thing.title ||
    !updatedTD.thing.properties
  ) {
    return res.status(400).json({ message: 'TD inválida ou incompleta.' });
  }

  try {
    const db = await getMongoClient();
    const result = await db.collection('TDs').updateOne(
      { _id: sensorId },
      { $set: { thing: updatedTD.thing } }, // Corrigido aqui
      { upsert: true }
    );

    res.status(200).json({
      message: 'Thing Description atualizada com sucesso!',
      updated: result.modifiedCount > 0 || result.upsertedCount > 0
    });
  } catch (error) {
    console.error('[Erro ao atualizar TD]', error);
    res.status(500).json({ message: 'Erro ao atualizar a TD.' });
  }
}

async function getSensorLocation(req, res) {
  const { sensorId } = req.params;

  try {
    const db = await getMongoClient();
    const doc = await db.collection('sensorLocation').findOne({ _id: sensorId });

    if (!doc || !doc.data?.location?.value) {
      return res.status(404).json({ message: 'Localização não encontrada.' });
    }

    res.status(200).json({
      location: doc.data.location.value,
      lastModified: doc.data.location.lastModified || null
    });
  } catch (error) {
    console.error('[Erro ao obter localização]', error);
    res.status(500).json({ message: 'Erro ao obter localização.' });
  }
}

async function getAllSensorLocation(req, res) {

  try {
    const db = await getMongoClient();
    const doc = await db.collection('sensorLocation').find({}).toArray();;
    
    const result = doc.map((doc) => ({
      sensorId: doc._id,
      location: doc.data?.location?.value || 'Desconhecido',
      lastModified: doc.data?.location?.lastModified || null,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('[Erro ao obter localização]', error);
    res.status(500).json({ message: 'Erro ao obter localização.' });
  }
}

async function updateSensorLocation(req, res) {
  const { sensorId } = req.params;
  const { location } = req.body;

  if (!location || typeof location !== 'string') {
    return res.status(400).json({ message: 'Localização inválida.' });
  }

  try {
    const db = await getMongoClient();

    const result = await db.collection('sensorLocation').updateOne(
      { _id: sensorId },
      {
        $set: {
          'data.location.value': location,
          'data.location.lastModified': new Date()
        }
      },
      { upsert: true }
    );

    logEvent({
      message: `Localização do sensor ${sensorId} atualizada para ${location}.`
    });

    res.status(200).json({
      message: 'Localização atualizada com sucesso.',
      updated: result.modifiedCount > 0 || result.upsertedCount > 0
    });
  } catch (error) {
    logEvent({
      message: `Erro ao atualizar localização do sensor ${sensorId}.`
    });
    console.error('[Erro ao atualizar localização]', error);
    res.status(500).json({ message: 'Erro ao atualizar localização.' });
  }
}

async function getLatestSensorData(req, res) {
  try {
    const db = await getMongoClient();

    const pipeline = [
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: { sensor: "$sensor", metric: "$metric" },
          sensor: { $first: "$sensor" },
          metric: { $first: "$metric" },
          value: { $first: "$value" },
          timestamp: { $first: "$timestamp" }
        }
      },
      { $project: { _id: 0, sensor: 1, metric: 1, value: 1, timestamp: 1 } }
    ];

    const data = await db.collection('sensorsData').aggregate(pipeline).toArray();

    res.status(200).json(data);
  } catch (error) {
    console.error('[Erro ao obter dados mais recentes]', error);
    res.status(500).json({ message: 'Erro ao obter dados mais recentes.' });
  }
}

async function insertSensorData(req, res) {
  try {
    const { sensorId } = req.params;
    const payload = req.body;

    if (!sensorId || !payload || !payload.timestamp) {
      return res.status(400).json({ error: 'Parâmetros obrigatórios em falta.' });
    }

    const { temperature, humidity, co2, tvoc, timestamp } = payload;

    if ([temperature, humidity, co2, tvoc].some(val => typeof val === 'undefined')) {
      return res.status(400).json({ error: 'Faltam métricas no payload.' });
    }

    const db = await getMongoClient();
    const collection = db.collection('sensorsData');

    const document = {
      sensorId,
      deviceType: 'Buffet-Food-Quality-Analyzer',
      temperature,
      humidity,
      co2,
      tvoc,
      date: new Date(timestamp)
    };

    await collection.insertOne(document);

    return res.status(201).json({ message: 'Dados inseridos com sucesso!', data: document });
  } catch (error) {
    console.error('[Erro ao atualizar dados do sensor]', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}



module.exports = 
{   getAllSensorData,
    getSensorData,
    getAllSensorIds,
    getSensorTD,
    updateSensorTD,
    getSensorLocation,
    updateSensorLocation,
    getLatestSensorData,
    insertSensorData,
    getAllSensorLocation
};
