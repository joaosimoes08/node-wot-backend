const { ObjectId } = require('mongodb');
const { get } = require('../app');
const { getMongoClient } = require('../db/mongo');
const { logEvent } = require('../utils/logger');

async function getAllCollections(req, res) {
  try {
    const db = await getMongoClient();
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);

    res.status(200).json(collectionNames);
  } catch (error) {
    console.error('[Erro ao listar collections]', error);
    res.status(500).json({ message: 'Erro ao listar collections.' });
  }
}

async function getCollectionData(req, res) {
  const { name } = req.params;

  try {
    const db = await getMongoClient();
    const docs = await db.collection(name).find().toArray();

    res.status(200).json(docs);
  } catch (error) {
    console.error(`[Erro ao obter dados da collection ${name}]`, error);
    res.status(500).json({ message: 'Erro ao obter dados da collection.' });
  }
}

async function updateCollectionData(req, res) {
  const { name } = req.params;
  const documents = req.body;

  if (!Array.isArray(documents)) {
    return res.status(400).json({ message: 'Payload deve ser um array de documentos.' });
  }

  try {
    const db = await getMongoClient();
    const collection = db.collection(name);

    for (const doc of documents) {
      // Usa alertId se existir, senão tenta _id como fallback
      const filterKey = doc.alertId ? { alertId: doc.alertId } : { _id: doc._id };

      await collection.replaceOne(filterKey, doc, { upsert: true });
    }

    res.status(200).json({ message: 'Documentos atualizados com sucesso.' });
  } catch (error) {
    console.error('[Erro ao atualizar documentos]', error);
    res.status(500).json({ message: 'Erro ao atualizar documentos.' });
  }
}

async function deleteData(req, res) {
  const { name, id } = req.params;

  try {
    const db = await getMongoClient();
    const collection = db.collection(name);
    let result;
    if (name != "alerts") {
      result = await collection.deleteOne({ _id: id });
    } else {
      result = await collection.deleteOne({ alertId: id })
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Documento não encontrado." });
    }

    res.status(200).json({ message: "Documento eliminado com sucesso." });
  } catch (error) {
    console.error("[Erro ao eliminar documento]", error);
    res.status(500).json({ message: "Erro ao eliminar documento." });
  }
}


module.exports = 
{   
    getAllCollections,
    getCollectionData,
    updateCollectionData,
    deleteData
};