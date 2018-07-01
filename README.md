# Arduino Radar

This project builds an Arduino with a servo and ultrasonic sensor that performs a regular sweeping motion and sends the distance measurements to a web UI to draw a radar screen. 

[![Arduino with radar screen](radar.png)](https://youtu.be/6x1YQxa2cOI)


It comprises of three parts:

1. An Arduino-powered radar (well, actually it's sonar)
2. The server-side radar data stream processor
3. The radar screen web interface

The Arduino uses the servo motor to sweep the ultrasonic sensor through 180 degrees at 10 degree increments, and sends the data via a serial interface to the connected computer. A Node server receives the serial data and forwards it via web sockets to a connected web client. The web client connects to the server via web sockets, and uses HTML5 canvas to draw the radar display.

---

## Quickstart: app

1. Clone this project from GitHub
2. `cd app`
2. `npm install` to pull down the dependencies
3. Set the configuration in `config.mjs` (hint: the serial port will be found in your Arduino IDE) 
4. `npm run start` to start the web server

Now, browse to [http://localhost:3000](http://localhost:3000)

### Configuration

By default the radar uses mock data. 

To get it using live data, configure it with the settings that you can find in the Arduino IDE via __Tools__ > __Port__.

The baud rate must match the same setting in the Arduino code.

```
{
    port: 3000,
    source: "live", 
    serial: {
        device: "/dev/cu.usbmodem1421",
        baud: 9600,
    }
}
```

To use mock data, set up your config like this:

```
{
    port: 3000,
    source: "mock"
}
```


--- 

## Quickstart: Arduino

1. Wire up your Arduino and plug it in.
2. In your Arduino IDE, load the project found in the `./arduino` directory
3. You will need the [NewPing library](http://playground.arduino.cc/Code/NewPing). Download the zip file, and then in your Arduino IDE select __Sketch__ > __Include Library__ > __Add ZIP Library...__ to load the library.
4. Now compile and upload the Arduino project to your Arduino device.

---

## How it works

### Arduino
The arduino has an ultrasonic sensor mounted onto a servo. The servo motor spins through 0 - 180 degrees in a repeating sweep from side to side, and it collects distance measurements as it goes. The angle and distance is sent via the serial port as a JSON string whic looks like this:

```
{"angle": 110, "distance": 78.00}
```

### Node Server

The node server runs via the command-line.

It hosts (via http) the HTML file and JS file needed for the web client to load.

It also connects to the serial port of the Arduino device, and listens for JSON payloads. 
It is treats the carriage return `\n` as the delimeter of payloads.  When it gets a payload, it relays 
that data to any connected websocket clients.

### Web client

The web client is a HTML web page with an HTML `<CANVAS>` element, along with some Javascript.

The web page connects back to the server via WebSockets and listens for the data being relayed from the Arduino.

When it receives this data, it stores it in a list of recent data points.

Separately, an animation loop runs to continuously draw the data on screen in the form of a radar screen.

The system scales the data to fit the canvas, and fades the data points so that older points fade to black, just like a real radar. It also shows the current data point with a sweep line.

