const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');

const sensorsRoutes = require('./routes/sensors.routes');
const alertsRoutes = require('./routes/alerts.routes');
const dbRoutes = require('./routes/db.routes');
const exportRoutes = require('./routes/export.routes');
const importRoutes = require('./routes/import.routes');
const logsRoutes = require('./routes/logs.routes');
const userRoutes = require('./routes/users.routes');

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

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
});

app.post("/api/upload", upload.single("file"), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        // Convert the uploaded file (buffer) to Base64
        const base64Image = req.file.buffer.toString("base64");

        const response = await fetch("http://192.168.137.248/buffet-food-quality-cam-01/properties/photo", {
            method: "PUT",
            headers: {
                "Content-Type": "text/plain"
            },
            body: base64Image
        });

        if (!response.ok) {
            console.error("Erro:", response.status);
        } else {
            console.log("Enviado com sucesso!");
        }

        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to process the image." });
    }
});


module.exports = app;
