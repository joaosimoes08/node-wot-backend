const express = require("express");
const router = express.Router();

let clients = [];

router.get("/stream", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter(c => c !== res);
  });
});

function broadcast(data) {
  clients.forEach(res => res.write(`data: ${JSON.stringify(data)}\n\n`));
}

// 👇 Exportar separadamente o router e o broadcast
module.exports = {
  notificationRouter: router,
  broadcast,
};