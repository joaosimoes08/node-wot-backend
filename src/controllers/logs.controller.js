const fs = require('fs');
const path = require('path');
const { logEvent } = require('../utils/logger');

const logsPath = path.join(__dirname, '../logs/logs.json');

function readLogsFile() {
  if (!fs.existsSync(logsPath)) fs.writeFileSync(logsPath, '[]');
  return JSON.parse(fs.readFileSync(logsPath, 'utf-8'));
}

function writeLogsFile(data) {
  fs.writeFileSync(logsPath, JSON.stringify(data, null, 2));
}

// GET /api/logs
function getLogs(req, res) {
  try {
    const logs = readLogsFile();
    res.status(200).json(logs);
  } catch (error) {
    console.error('[Erro ao ler logs]', error);
    res.status(500).json({ message: 'Erro ao ler logs.' });
  }
}

// DELETE /api/logs
function deleteLogs(req, res) {
  try {
    writeLogsFile([]);
    res.status(200).json({ message: 'Logs apagados com sucesso.' });
  } catch (error) {
    console.error('[Erro ao apagar logs]', error);
    res.status(500).json({ message: 'Erro ao apagar logs.' });
  }
}

// GET /api/logs/export?format=txt|json
function exportLogs(req, res) {
  try {
    const format = req.query.format || 'json';
    const logs = readLogsFile();

    if (format === 'txt') {
      const txt = logs.map(l => `[${l.timestamp}] ${l.level}: ${l.message}`).join('\n');
      res.header('Content-Type', 'text/plain');
      res.attachment('logs.txt');
      return res.send(txt);
    }

    res.header('Content-Type', 'application/json');
    res.attachment('logs.json');
    return res.send(JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('[Erro ao exportar logs]', error);
    res.status(500).json({ message: 'Erro ao exportar logs.' });
  }
}

module.exports = {
  getLogs,
  deleteLogs,
  exportLogs
};
