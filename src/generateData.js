const fs = require('fs');

const sensors = [
  {
    sensorId: 'wot:dev:buffet-food-quality-analyzer-01',
    deviceType: 'Buffet-Food-Quality-Analyzer'
  },
  {
    sensorId: 'wot:dev:buffet-food-quality-analyzer-02',
    deviceType: 'Buffet-Food-Quality-Analyzer'
  }
];

const startDate = new Date('2025-07-01T00:00:00.000Z');
const endDate = new Date();
const intervalMinutes = 15;

const results = [];

for (let d = new Date(startDate); d < endDate; d.setMinutes(d.getMinutes() + intervalMinutes)) {
  for (const sensor of sensors) {
    const entry = {
      sensorId: sensor.sensorId,
      deviceType: sensor.deviceType,
      temperature: +(20 + Math.random() * 10).toFixed(2), // 20ºC - 30ºC
      humidity: +(50 + Math.random() * 20).toFixed(2), // 50% - 70%
      co2: Math.floor(400 + Math.random() * 1000), // 400 - 1400 ppm
      tvoc: Math.floor(50 + Math.random() * 200), // 50 - 250
      timestamp: new Date(d).toISOString()
    };

    results.push(entry);
  }
}

fs.writeFileSync('mock_sensor_data.json', JSON.stringify(results, null, 2));
console.log(`✅ Gerados ${results.length} registos para ${sensors.length} sensores.`);
