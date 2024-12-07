
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(express.json());

//const privateKey = 'my_private_key';

function isValidToken(phoneNumber, token) {
    const hash = crypto.createHash('sha256');
    hash.update(phoneNumber);
    hash.update(privateKey);
    return hash.digest('hex') === token;
}

app.post('/api/device/data', async (req, res) => {
    const { phone_number, battery, location, token } = req.body;

    if (!phone_number || !token || !battery || !location) {
        return res.status(400).send('Datos inválidos');
    }

    if (!isValidToken(phone_number, token)) {
        return res.status(401).send('Autenticación fallida');
    }

    try {
        await db.collection('device_data').add({
            phone_number,
            battery,
            location,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(200).send('Datos almacenados');
    } catch (error) {
        console.error('Error al almacenar datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

exports.ARfindDevices = functions.https.onRequest(app);
