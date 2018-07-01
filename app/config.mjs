const config = {
    // match these to the Arduino device and baud
    serial: {
        device: "/dev/cu.usbmodem1411",
        baud: 9600,
    },
    
    // the web server port
    port: 3000,

    // the data source: "mock" or "live"
    source: "mock", 
};

export default config;