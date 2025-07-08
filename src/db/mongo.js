const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
let client;

async function getMongoClient(dbName = 'WoT') {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  return client.db(dbName);
}

module.exports = { getMongoClient };