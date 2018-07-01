/**
 * Arduino Radar
 * 
 * See https://github.com/sc0ttdav3y/arduino-radar
 * 
 * This file contains the server-side application. It has two jobs:
 * 
 * 1. It relays the data received from the serial port onto connected 
 *    websocket clients, and
 * 2. It hosts the static website files.
 * 
 * It is written in Javascript ES6, so as of July 2018 must be run with 
 * the --experimental-modules flag.
 */

// Import the required modules
import express from "express";
import expressWs from "express-ws";
import path from 'path';

// Import our config and data providers
import config from "./config";
import liveDataProvider from "./data/livedata";
import mockDataProvider from "./data/mockdata";

// Set up the '__dirname' constant, which is normally available in node
// but not when running ES6 with 'node --experimental-modules'.
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Set up the web server with a default route of '/' for GET and WS.
const app = express();
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/web/index.html")
});
app.get('/radar.js', (req, res) => {
    res.sendFile(__dirname + "/web/radar.js", { headers: { "content-type": "text/javascript" }})
});

// Now, set up web sockets and register the websocket endpoint, 
// so web clients can connect and receive their data.
const wsApp = expressWs(app);
app.ws('/', (ws, req) => {});
const wss = wsApp.getWss('/');

// Start the appropriate data provider
const source = config.source || "mock";
if (source === "live") {
    liveDataProvider.start(wss, config);
} else {
    mockDataProvider.start(wss, config);
}

// Finally, fire up the server. 
const port = config.port || 3000;
app.listen(
    config.port, 
    () => console.log(`The radar is available at http://localhost:${port}/ using ${source} data`)
);