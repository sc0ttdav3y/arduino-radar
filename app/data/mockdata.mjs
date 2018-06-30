/**
 * A Mock Data Provider
 * 
 * This generates random data and relays it to the connected 
 * websocket clients. 
 * 
 * @param {WebSocket.Server} client 
 * @param {Object} config
 */
const dataProvider = {
    start: (wss, config) => {

        // Send an update every second
        let angle = 90;
        let angleDirection = -5;
        let distance = 100;

        // Send some data every 100ms 
        setInterval(() => {
            // get the next angle and randomise a distance
            angle += angleDirection;
            if (angle == 0 || angle == 180) {
                angleDirection *= -1;
            }
            distance = Math.ceil(Math.random() * 100);

            const data = {
                angle,
                distance,
            };

            // send the data to the clients
            wss.clients.forEach((client) => {
                client.send(JSON.stringify(data));
            });
        }, 100);

    }
}

export default dataProvider;