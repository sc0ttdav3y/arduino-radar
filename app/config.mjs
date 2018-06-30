const config = {
    // match these to the Arduino device and baud
    serial: {
        device: "/dev/cu.usbmodem1421",
        baud: 9600,
    },
    
    // the web server port
    port: 3000,

    // the data source: "mock" or "live"
    source: "live", 
};

export default config;