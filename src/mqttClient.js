const mqtt = require("mqtt");
const { broadcast } = require("./routes/notifications.routes");
require('dotenv').config();

const client = mqtt.connect(`mqtts://${process.env.MQTT_HOST}:8885`, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  clientId: process.env.MQTT_CLIENTID,
  rejectUnauthorized: false, // ou usar `ca: fs.readFileSync('ca.crt')`
});

client.on("connect", () => {
  const topic = "buffet-food-quality-analyzer-01/events/#";
  client.subscribe(topic, (err) => {
    if (!err) console.log("✅ Subscrito a", topic);
    else console.error("Erro ao subscrever:", err.message);
  });
});

client.on("message", (topic, message) => {
  const msg = message.toString();

  try {
    const payload = JSON.parse(msg); // se for JSON válido
    console.log("📡 MQTT (JSON):", topic, payload);

    broadcast({
      topic,
      ...payload
    });

  } catch (err) {
    console.log("📡 MQTT (texto):", topic, msg);

    broadcast({
      topic,
      message: msg
    });
  }

});

module.exports = client;
