async function openBuffet(req, res) { 
  
  try {
    const response = await fetch('http://10.147.18.50:8080/buffet-food-quality-analyzer-01/actions/openBuffet', {
      method: 'POST',
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao enviar comando para o buffet.' });
    }

    res.json({ message: "Comando 'openBuffet' enviado com sucesso!" });
  } catch (error) {
    console.error('Erro no proxy:', error.message);
    res.status(500).json({ error: 'Erro no servidor proxy.' });
  }
}

async function closeBuffet(req, res) { 
  
  try {
    const response = await fetch('http://10.147.18.50:8080/buffet-food-quality-analyzer-01/actions/closeBuffet', {
      method: 'POST',
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao enviar comando para o buffet.' });
    }

    res.json({ message: "Comando 'openBuffet' enviado com sucesso!" });
  } catch (error) {
    console.error('Erro no proxy:', error.message);
    res.status(500).json({ error: 'Erro no servidor proxy.' });
  }
}

async function getCurrentData(req, res) {
    try {
    const response = await fetch('http://10.147.18.50:8080/buffet-food-quality-analyzer-01/properties/currentSensorData', {
      method: 'GET',
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao enviar comando para o buffet.' });
    }

    res.json({ message: "Comando 'currentSensorData' enviado com sucesso!" });
  } catch (error) {
    console.error('Erro no proxy:', error.message);
    res.status(500).json({ error: 'Erro no servidor proxy.' });
  }
}

module.exports = {
  openBuffet,
  closeBuffet,
  getCurrentData
};
