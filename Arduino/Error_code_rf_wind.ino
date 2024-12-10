#include "DFRobot_RainfallSensor.h"
#include <Arduino_MKRENV.h>
#include "SparkFun_Weather_Meter_Kit_Arduino_Library.h"
#include <OneWire.h>
#include <DallasTemperature.h>

// Data wire is plugged into port 2 on the Arduino
#define ONE_WIRE_BUS 0

// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature.
DallasTemperature sensors(&oneWire);

// Below are the pin definitions for each sensor of the weather meter kit
const int windDirectionPin = A1;
const int windSpeedPin = 5;
const int rainfallPin = 1;
const int echo = 2;
const int trig = 3;

// Create an instance of the weather meter kit
SFEWeatherMeterKit weatherMeterKit(windDirectionPin, windSpeedPin, rainfallPin);

// Rainfall sensor via I2C
DFRobot_RainfallSensor_I2C Sensor(&Wire);

// Error codes
const int NO_ERROR = 0x00;
const int ERROR_SENSOR_DISCONNECTED = 0x01;

// Variables to store error states
int windSpeedError = NO_ERROR;
int windDirectionError = NO_ERROR;
int rainfallError = NO_ERROR;

double duration = 0;
double distance = 0;

// Variables to store rainfall data
float lastRainfall = 0.0;
unsigned long lastTime = 0;

void setup() {
  Serial.begin(115200);

  // Initialize the rainfall sensor
  delay(1000);
  while (!Sensor.begin()) {
    Serial.println("Rainfall Sensor init err!!!");
    rainfallError = ERROR_SENSOR_DISCONNECTED; // Set error code for rainfall sensor
    delay(1000);
  }

  // Initialize the weather meter kit
  weatherMeterKit.begin();

  // Initialize temperature sensors
  sensors.begin();

  // Set up the pins
  pinMode(echo, INPUT);
  pinMode(trig, OUTPUT);

  // Initialize MKR ENV Shield
  if (!ENV.begin()) {
    Serial.println("Failed to initialize MKR ENV Shield!");
    while (1);
  }
}

float convertKphToMph(float kph) {
  return kph * 0.621371;
}

float convertMmToInches(float mm) {
  return mm * 0.0393701;
}

void loop() {
  // --- Temperature Sensors ---
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);

  if (tempC != DEVICE_DISCONNECTED_C) {
    Serial.print("Temperature: ");
    Serial.println(tempC);
  } else {
    Serial.println("Error: Could not read temperature data");
  }

  // --- Wind Speed ---
  float windSpeedKph = weatherMeterKit.getWindSpeed();
  if (windSpeedKph < 0) {
    windSpeedError = ERROR_SENSOR_DISCONNECTED; // Error if sensor is disconnected
    Serial.println("Error: Wind speed sensor disconnected!");
  } else {
    windSpeedError = NO_ERROR; // No error
    Serial.print("Wind Speed (kph): ");
    Serial.println(windSpeedKph);
    Serial.print("Wind Speed (mph): ");
    Serial.println(convertKphToMph(windSpeedKph));
  }

  // --- Wind Direction ---
  float windDirection = weatherMeterKit.getWindDirection();
  if (windDirection < 0) {
    windDirectionError = ERROR_SENSOR_DISCONNECTED; // Error if sensor is disconnected
    Serial.println("Error: Wind direction sensor disconnected!");
  } else {
    windDirectionError = NO_ERROR; // No error
    Serial.print("Wind Direction (degrees): ");
    Serial.println(windDirection);
  }

  // --- Rainfall ---
  float rainfall = Sensor.getRainfall();
  if (rainfall == -1) {
    rainfallError = ERROR_SENSOR_DISCONNECTED; // Error if sensor is disconnected
    Serial.println("Error: Rainfall sensor disconnected!");
  } else {
    rainfallError = NO_ERROR; // No error
    Serial.print("Rainfall (mm): ");
    Serial.println(rainfall);
  }

  // --- ENV Shield ---
  Serial.print("Temperature = ");
  Serial.print(ENV.readTemperature());
  Serial.println(" °C");

  Serial.print("Humidity = ");
  Serial.print(ENV.readHumidity());
  Serial.println(" %");

  Serial.print("Pressure = ");
  Serial.print(ENV.readPressure());
  Serial.println(" kPa");

  Serial.print("Illuminance = ");
  Serial.print(ENV.readIlluminance());
  Serial.println(" lx");

  Serial.print("UVA = ");
  Serial.println(ENV.readUVA());

  Serial.print("UVB = ");
  Serial.println(ENV.readUVB());

  Serial.print("UV Index = ");
  Serial.println(ENV.readUVIndex());

  // --- Ultrasonic Distance Sensor ---
  digitalWrite(trig, LOW);
  delay(2);
  digitalWrite(trig, HIGH);
  delay(10);
  digitalWrite(trig, LOW);

  duration = pulseIn(echo, HIGH);
  distance = (duration * 0.0343) / 2;
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" CM");

  // Log errors if any
  logError("Wind Speed Sensor", windSpeedError);
  logError("Wind Direction Sensor", windDirectionError);
  logError("Rainfall Sensor", rainfallError);

  delay(1000);
}

void logError(const char* sensorName, int errorCode) {
  if (errorCode != NO_ERROR) {
    Serial.print(sensorName);
    Serial.print(" Error Code: ");
    Serial.println(errorCode, HEX); // Print error code in hexadecimal
  }
}
