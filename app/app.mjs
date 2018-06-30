import express from "express";
import expressWs from "express-ws";
import path from 'path';

import config from "./config";
import liveDataProvider from "./data/livedata";
import mockDataProvider from "./data/mockdata";

// Provide the '__dirname' constant, which is not available
// when running ES6 with 'node --experimental-modules'
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Set up the app with a default route of '/' for GET and WS.
const app = express();
const wsApp = expressWs(app);

// Register index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/web/index.html")
});

// Regster radar.js 
app.get('/radar.js', (req, res) => {
    res.sendFile(__dirname + "/web/radar.js", { headers: { "content-type": "text/javascript" }})
});

// Register the websocket endpoint
app.ws('/', (ws, req) => {});
const wss = wsApp.getWss('/');

// Start the appropriate data provider
if (config.source === "live") {
    liveDataProvider.start(wss, config);
} else {
    mockDataProvider.start(wss, config);
}

// Fire up the web server
app.listen(
    config.port, 
    () => console.log(`The radar is available at http://localhost:${config.port}/ using ${config.source} data`)
);