const express = require('express');
const bodyParser = require('body-parser');
const request = require('request'); // "Request" library
const cors = require('cors');
// const querystring = require('querystring');
const base64 = require('base-64');
const admin = require('firebase-admin');

if (process.env.NODE_ENV !== 'production') { require('dotenv').config(); }

/** ----------------------------------------------------------------------
 * INITIALIZATIONS
 * ---------------------------------------------------------------------- */
const app = express();

// Your web app's Firebase configuration
const serviceAccount = {
    type: 'service_account',
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: JSON.parse(process.env.PRIVATE_KEY),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://accounts.google.com/o/oauth2/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.CERT_URL,
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://smart-water-monitoring-s-1211d.firebaseio.com/',
    databaseAuthVariableOverride: {
      uid: "swms-service-worker"
    },
});
const db = admin.database();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/** ----------------------------------------------------------------------
 * TEST ENDPOINTS
 * ---------------------------------------------------------------------- */

const _handleDbError = (res, error) => {
    res.status(400).send(error.message);
};

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.get('/test', (req, res) => {
    res.status(200).send('GET request to /test');
});

app.post('/test', (req, res) => {
    res.status(200).send('POST request to /test');
});

app.get('/testFirebaseWrite', (req, res) => {
    db.ref('test').child('test')
        .set(Date.now(), (error) => {
            if (error) {
                _handleDbError(res, error);
            } else {
                res.status(200).send('Databse write successful');
            }
        });
});

/** ----------------------------------------------------------------------
 * Start App
 * ---------------------------------------------------------------------- */
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
