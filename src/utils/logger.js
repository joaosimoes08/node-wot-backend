const fs = require('fs');
const path = require('path');

const LOG_FILE_PATH = path.join(__dirname, '../logs/logs.json');

function logEvent({ message }) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    message
  };

  let logs = [];

  // Lê os logs existentes, se houver
  if (fs.existsSync(LOG_FILE_PATH)) {
    try {
      const fileContent = fs.readFileSync(LOG_FILE_PATH, 'utf8');
      logs = JSON.parse(fileContent);
    } catch (err) {
      console.error('[Logger] Erro ao ler logs.json:', err);
    }
  }

  logs.push(logEntry);

  try {
    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2), 'utf8');
  } catch (err) {
    console.error('[Logger] Erro ao escrever no logs.json:', err);
  }
}

module.exports = { logEvent };
