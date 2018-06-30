/**
 * Use an ultrasonic sensor as a radar
 * 
 * By Scott Davey
 * www.coderdojorealm.com 
 * June 2018
 * 
 * Work in progress
 * 
 * Uses NewPing library from http://playground.arduino.cc/Code/NewPing
 * 
 */

#include <Servo.h>
#include <NewPing.h>

const int SERIAL_BAUD_RATE = 9600;

// The Pan/Tilt pin configuration
const int PIN_NECK_TILT = 10;
const int PIN_NECK_PAN = 11;

// The ultrasonic sensor pin configuration
const int PIN_ULTRASONIC_TRIG = 8;
const int PIN_ULTRASONIC_ECHO = 9;
const int MAX_ULTRASONIC_DISTANCE = 200;

// Set up the sonar 
NewPing sonar(PIN_ULTRASONIC_TRIG, PIN_ULTRASONIC_ECHO, MAX_ULTRASONIC_DISTANCE);

// The neck servos: each servo's position ranges 
// from - 0 to 180, with 90 being in the middle.
const int DEFAULT_NECK_TILT_POS = 90; 
const int DEFAULT_NECK_PAN_POS = 90; 

Servo neckPan;
Servo neckTilt;

// These variables store the current position of the pan/tilt
int panPosition = DEFAULT_NECK_PAN_POS;
int tiltPosition = DEFAULT_NECK_TILT_POS;
int panDirection = -5; // LEFT
int tiltDirection = 0; // DON'T MOVE

/**
 * Set up
 * 
 * Sets up the ultrasonic sensor and the pan/tilt servos
 */
void setup() {
  setupNeckServos();
  Serial.begin(SERIAL_BAUD_RATE);
}

/**
 * Loop... again and again and again
 */
void loop() {

  // flip the pan direction if at the extent
  if (panPosition < 9 || panPosition > 170) {
    panDirection = panDirection * -1;
  }
  // pan the US sensor
  panPosition += panDirection;
  panToAngle(panPosition);
  
  // sense the distance
  float distance = sonar.ping_cm();

  // output to the serial port
  writeDataToSerial(panPosition, distance);

  delay(300);
}


/**
 * Look at the specified direction
 * 
 * @param int direction The pan angle from 0 - 180
 */
void panToAngle(int direction)
{
  neckPan.write(direction);
}

/**
 * Tilt the head up or down
 * 
 * @param int direction The pan angle from 0 - 180
 */
void tiltToAngle(int direction)
{
  neckTilt.write(direction);
}


/**
 * Writes a JSON packet to the serial port with the data
 * 
 * @param int angle The angle of the pan servo
 * @param float  distance The measured distance in cm
 */
void writeDataToSerial(int angle, float distance)
{
  Serial.print("{\"angle\": ");
  Serial.print(angle);
  Serial.print(", \"distance\": ");
  Serial.print(distance);
  Serial.print("}"); 
  Serial.println();
}


/**
 * Sets up the pan/tilt servos
 */
void setupNeckServos()
{
  pinMode(PIN_NECK_TILT, OUTPUT);
  pinMode(PIN_NECK_PAN, OUTPUT);

  digitalWrite(PIN_NECK_TILT, LOW);
  digitalWrite(PIN_NECK_PAN, LOW);

  neckPan.attach(PIN_NECK_PAN);
  neckTilt.attach(PIN_NECK_TILT);

  neckPan.write(DEFAULT_NECK_PAN_POS);
  neckTilt.write(DEFAULT_NECK_TILT_POS);
  
}
