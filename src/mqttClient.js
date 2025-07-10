const mqtt = require("mqtt");
const { broadcast } = require("./routes/notifications.routes");

const client = mqtt.connect("mqtt://test.mosquitto.org:1883");

client.on("connect", () => {
  const topic = "buffet-food-quality-analyzer-01/events/#";
  client.subscribe(topic, (err) => {
    if (!err) console.log("✅ Subscrito a", topic);
    else console.error("Erro ao subscrever:", err.message);
  });
});

client.on("message", (topic, message) => {
  try {
    const msg = message.toString(); 
    const payload = JSON.parse(msg)
    console.log("📡 MQTT:", topic, payload);

    broadcast({
      topic,
      ...msg
    });

  } catch (err) {
    console.error("❌ Erro ao processar mensagem MQTT:", err.message);
  }
});

module.exports = client;
