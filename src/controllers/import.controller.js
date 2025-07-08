const { getMongoClient } = require('../db/mongo');
const { logEvent } = require('../utils/logger');

async function importCollection(req, res) {
  const { collection } = req.params;
  const documents = req.body;

  if (!Array.isArray(documents)) {
    return res.status(400).json({ message: 'Esperado um array de documentos.' });
  }

  try {
    const db = await getMongoClient();
    await db.collection(collection).insertMany(documents);

    res.status(201).json({ message: 'Importação concluída.', inserted: documents.length });
  } catch (error) {
    console.error(`[Erro ao importar para ${collection}]`, error);
    res.status(500).json({ message: 'Erro na importação.' });
  }
}

module.exports = { importCollection };
