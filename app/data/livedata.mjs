import SerialPort from "serialport";

/**
 * A Live Data Provider
 * 
 * This connects to the Arduino serial port and relays 
 * any data it finds to the connected websocket clients. 
 * 
 * @param {WebSocket.Server} client 
 * @param {Object} config
 */
const dataProvider = {
    start: (wss, config) => {
        const port = new SerialPort(config.serial.device);
        const parser = port.pipe(
            new SerialPort.parsers.Readline({ 
                delimiter: '\n' 
            })
        );
        parser.on('data', (data) => {
            wss.clients.forEach((client) => {
                client.send(data);
            });
        });
    }
}

export default dataProvider;