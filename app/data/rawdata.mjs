/**
 * A quick CLI tool to log all data received from the serial 
 * device. 
 * 
 * To run:
 * 
 * node --experimental-modules ./data/rawdata.mjs
 * 
 * This is configured via npm as:
 * 
 * npm run rawdata
 * 
 */
import SerialPort from "serialport";
import { 
    SERIAL_DEVICE, 
    SERIAL_BAUD_RATE,
} from "./config";

const port = new SerialPort(SERIAL_DEVICE, { SERIAL_BAUD_RATE });
const parser = port.pipe(
    new SerialPort.parsers.Readline({ 
        delimiter: '\n' 
    })
);
parser.on('data', console.log);
