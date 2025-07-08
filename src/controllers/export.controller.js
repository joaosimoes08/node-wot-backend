const { getMongoClient } = require('../db/mongo');
const { Parser } = require('json2csv');
const { logEvent } = require('../utils/logger');

async function exportCollection(req, res) {
  const { collection } = req.params;
  const { format } = req.query;

  try {
    const db = await getMongoClient();
    const data = await db.collection(collection).find().toArray();

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(data);

      res.header('Content-Type', 'text/csv');
      res.attachment(`${collection}.csv`);
      return res.send(csv);
    } else {
      res.header('Content-Type', 'application/json');
      res.attachment(`${collection}.json`);
      return res.send(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error(`[Erro ao exportar ${collection}]`, error);
    res.status(500).json({ message: 'Erro ao exportar dados.' });
  }
}

module.exports = { exportCollection };
