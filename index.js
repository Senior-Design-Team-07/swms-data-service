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
    console.log('GET request to /test')
    res.status(200).send('GET request to /test\n\n');
});

app.post('/test', (req, res) => {
    console.log('POST request to /test')
    res.status(200).send('POST request to /test\n\n');
});

app.post('/test/postData', (req, res) => {
    const testData = req.body.testData || null;
    console.log(`POST request to /test/postData; Data Recieved: ${testData || 'No Data'}`)

    if (testData) {
        db.ref('test').child('testData')
            .set(testData, (error) => {
                if (error) {
                    _handleDbError(res, error);
                } else {
                    res.status(200).send(`Data Recieved: ${testData || 'No Data'}\n\n`);
                }
            });
    } else {
        res.status(400).send('No data recieved.');
    }
});


app.put('/test/firebaseWrite', (req, res) => {
    const timestamp = Date.now();
    console.log(`PUT request to /test/firebaseWrite; Timestamp: ${timestamp}`)

    db.ref('test').child('timestamp')
        .set(timestamp, (error) => {
            if (error) {
                _handleDbError(res, error);
            } else {
                res.status(200).send(`Databse write successful.\nTimestamp: ${timestamp}\n\n`);
            }
        });
});

/** ----------------------------------------------------------------------
 * Start App
 * ---------------------------------------------------------------------- */
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
