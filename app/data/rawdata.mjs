/**
 * A CLI tool to log all data received from the serial 
 * device to the console. 
 * 
 * To run:
 * 
 * npm run rawdata
 */
import SerialPort from "serialport";
import config from "../config";

const port = new SerialPort(config.serial.device);
const parser = port.pipe(
    new SerialPort.parsers.Readline({ 
        delimiter: '\n' 
    })
);
parser.on('data', console.log);
