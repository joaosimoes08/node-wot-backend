const express = require('express');
const cors = require('cors');
require('dotenv').config();
require("./mqttClient");

const sensorsRoutes = require('./routes/sensors.routes');
const alertsRoutes = require('./routes/alerts.routes');
const dbRoutes = require('./routes/db.routes');
const exportRoutes = require('./routes/export.routes');
const importRoutes = require('./routes/import.routes');
const logsRoutes = require('./routes/logs.routes');
const userRoutes = require('./routes/users.routes');
const wotRoutes = require('./routes/wot.routes');
const { notificationRouter } = require('./routes/notifications.routes')

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/sensors', sensorsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/db', dbRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/import', importRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wot', wotRoutes);
app.use('/notifications', notificationRouter)




module.exports = app;
