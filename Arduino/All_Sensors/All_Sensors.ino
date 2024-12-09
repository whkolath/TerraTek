#include <MKRWAN.h>
#include <DFRobot_RainfallSensor.h>
#include <Arduino_MKRENV.h>
#include <SparkFun_Weather_Meter_Kit_Arduino_Library.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <SparkFun_External_EEPROM.h>

#include "arduino_secrets.h"
#include "sensor_ids.h"

// LoRaWAN credentials are stored in arduino_secrets.h
String appEui = SECRET_APP_EUI;
String appKey = SECRET_APP_KEY;

// Constants
#define EEPROM_ADDRESS 0x50  // I2C address of the 24FC512 EEPROM
#define PH_SENSOR_PIN A3     // Analog pin for the pH sensor
#define EC_SENSOR_PIN A4     // Analog pin for the EC sensor
#define TEMP_SENSOR_PIN 2    // Digital pin for the DS18B20 sensor

// EEPROM object
ExternalEEPROM eeprom;

// Variables for EC and pH calibration
double ecKConstant = 1.0;              // Default EC sensor calibration constant
const double TEMP_COEFFICIENT = 0.02;  // Temperature coefficient for EC correction
const double V_REF = 3.3;              // Reference voltage for MKR WAN 1310
const int ADC_RES_BITS = 4095;         // 12-bit ADC resolution (renamed to avoid conflict)

// Initialize the LoRaWAN modem
LoRaModem modem;

// Data wire is plugged into port 2 on the Arduino
#define ONE_WIRE_BUS 0

// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature.
DallasTemperature sensors(&oneWire);

// Below are the pin definitions for each sensor of the weather meter kit
const int windDirectionPin = A1;
const int windSpeedPin = 1;
const int rainfallPin = 5;
const int echo = 3;
const int trig = 2;

// Create an instance of the weather meter kit
SFEWeatherMeterKit weatherMeterKit(windDirectionPin, windSpeedPin, rainfallPin);

// Rainfall sensor via I2C
DFRobot_RainfallSensor_I2C Sensor(&Wire);

// Error codes
const char NO_ERROR = 0x00;
const char ERROR_SENSOR_DISCONNECTED = 0x01;

// Variables to store error states
char windSpeedError = NO_ERROR;
char windDirectionError = NO_ERROR;
char rainfallError = NO_ERROR;

double duration = 0;
double distance = 0;

// Variables to store rainfall data
double lastRainfall = 0.0;
unsigned long lastTime = 0;

// Function to convert kph to mph
double convertKphToMph(double kph) {
  return kph * 0.621371;
}

// Function to convert mm to inches
double convertMmToInches(double mm) {
  return mm * 0.0393701;
}


// Function to read data from the pH sensor
float readPHSensor() {
  int sensorValue = analogRead(PH_SENSOR_PIN);           // Read the analog value
  float voltage = sensorValue * (V_REF / ADC_RES_BITS);  // Convert ADC value to voltage
  float current = voltage / 100.0 * 1000;                // Calculate current in mA (Ohm's Law)
  float pH = (current - 4.0) * (14.0 / 16.0);            // Convert current to pH value
  return pH;
}

// Function to read data from the EC sensor
float readECSensor() {
  int analogValue = analogRead(EC_SENSOR_PIN);           // Read the analog voltage
  float voltage = analogValue * (V_REF / ADC_RES_BITS);  // Convert to voltage
  float ec = voltage * ecKConstant;                      // Convert voltage to EC using calibration constant
  return ec;
}

// Function to correct EC value for temperature
float correctEC(float ec, float temperature) {
  return ec / (1 + TEMP_COEFFICIENT * (temperature - 25.0));
}

// Function to load EC calibration data from EEPROM
void loadECCalibration() {
  ecKConstant = readFloatFromEEPROM(0);  // Read EC calibration constant from EEPROM
  Serial.print("Loaded EC Calibration Constant: ");
  Serial.println(ecKConstant);
}

// Function to save EC calibration data to EEPROM
void saveECCalibration(float newKConstant) {
  ecKConstant = newKConstant;          // Update the calibration constant
  writeFloatToEEPROM(0, ecKConstant);  // Save to EEPROM at address 0
  Serial.print("Saved EC Calibration Constant to EEPROM: ");
  Serial.println(ecKConstant);
}

// Example function to perform EC calibration (call during calibration)
void performECCalibration(float measuredVoltage, float knownEC) {
  // Calculate the new calibration constant
  float newKConstant = knownEC / measuredVoltage;
  saveECCalibration(newKConstant);  // Save the new constant to EEPROM
}

// Helper function to write a float to EEPROM
void writeFloatToEEPROM(uint16_t address, float value) {
  byte* data = (byte*)&value;
  for (int i = 0; i < sizeof(float); i++) {
    eeprom.write(address + i, data[i]);
  }
}

// Helper function to read a float from EEPROM
float readFloatFromEEPROM(uint16_t address) {
  float value = 0.0;
  byte* data = (byte*)&value;
  for (int i = 0; i < sizeof(float); i++) {
    data[i] = eeprom.read(address + i);
  }
  return value;
}

// Function to send data over LoRaWAN
bool LoRaWAN_send(char SID, char error, double reading) {

  for (int i = 0; i < 5; i++) {
    int err;
    modem.beginPacket();
    modem.write(SID);
    modem.write(error);
    modem.write(reading);
    err = modem.endPacket(true);
    if (err > 0) {
      Serial.println("Message sent correctly!");
      delay(5000);  // Delay to avoid overcrowding the network
      return false;
    } else {
      Serial.println("Error sending message.");
      delay(5000);
    }
  }
  return true;
}

void setup() {
  Serial.begin(115200);

  // Initialize the rainfall sensor
  delay(5000);
// while (!Sensor.begin())
// {
//   Serial.println("Rainfall Sensor init err!!!");
//   rainfallError = ERROR_SENSOR_DISCONNECTED; // Set error code for rainfall sensor
//   delay(1000);
// }

// Initialize the weather meter kit
#ifdef SFE_WMK_PLAFTORM_UNKNOWN
  weatherMeterKit.setADCResolutionBits(10);

  //Serial.println(F("Unknown Signal"));
  Serial.println();
#endif

  // Begin weather meter kit
  weatherMeterKit.begin();
  lastTime = millis();  // Initialize last time


  // Initialize temperature sensors
  sensors.begin();

  // Set up the pins
  pinMode(echo, INPUT);
  pinMode(trig, OUTPUT);

  // Initialize MKR ENV Shield
  if (!ENV.begin()) {
    Serial.println("Failed to initialize MKR ENV Shield!");
    while (1)
      ;
  }

  // Set ADC resolution to 12 bits
  //analogReadResolution(12);

  // Initialize DS18B20 temperature sensor
  // ds18b20.begin();

  Wire.begin();

  // Initialize EEPROM
  // Serial.println("Initializing EEPROM...");
  // if (eeprom.begin() != 0) {
  //   Serial.println("EEPROM initialization failed!");
  // } else {
  //   Serial.println("EEPROM initialized successfully.");
  // }


  // Initialize LoRaWAN
  if (!modem.begin(US915)) {
    Serial.println("Failed to start module");
    while (1)
      ;
  };

  // Connect to the LoRaWAN network
  int connected = false;
  do {
    Serial.println("Attempting to connect");
    connected = modem.joinOTAA(appEui, appKey);
  } while (!connected);
}

void loop() {
  char error = 0x00;
  // --- Temperature Sensors ---
  sensors.requestTemperatures();
  double tempC = sensors.getTempCByIndex(0);
  if (tempC < 0) {
    error = 0x01;  // DS18B20 Temperature too low
  } else if (tempC > 50) {
    error = 0x01;  // DS18B20 Temperature too high
  }

  if (tempC != DEVICE_DISCONNECTED_C) {
    error = 0x00;
    Serial.print("Temperature: ");
    Serial.println(tempC);
  } else {
    error = 0x01;
  }
  
  LoRaWAN_send(DS18B2_Temperature_Probe, error, tempC);

  // // Read EC sensor data and apply temperature correction
  // double ec = readECSensor();
  // double ecCorrected = correctEC(ec, tempC);irectionError);

  // Serial.print("EC Value: "); Serial.println(ec);
  // Serial.print("Corrected EC Value: "); Serial.println(ecCorrected);

  // //LoRaWAN_send(DFR_Conductivity_Meter, 0x00, ecCorrected)

  // // Read pH sensor data
  // double pH_val = readPHSensor();
  // Serial.print("pH Value: "); Serial.println(pH);

  // //LoRaWAN_send(PH, 0x00, pH_val)

  // --- Wind Speed ---
  double windSpeedKph = weatherMeterKit.getWindSpeed();
  if (windSpeedKph < 0) {
    windSpeedError = ERROR_SENSOR_DISCONNECTED;  // Error if sensor is disconnected
    Serial.println("Error: Wind speed sensor disconnected!");
  } else {
    windSpeedError = NO_ERROR;  // No error
    Serial.print("Wind Speed (kph): ");
    Serial.println(windSpeedKph);
    Serial.print("Wind Speed (mph): ");
    Serial.println(convertKphToMph(windSpeedKph));
  }

  LoRaWAN_send(SparkFun_Weather_Meter_Wind_Speed, windSpeedError, windSpeedKph);

  // --- Wind Direction ---
  double windDirection = weatherMeterKit.getWindDirection();
  if (windDirection < 0) {
    windDirectionError = ERROR_SENSOR_DISCONNECTED;  // Error if sensor is disconnected
    Serial.println("Error: Wind direction sensor disconnected!");
  } else {
    windDirectionError = NO_ERROR;  // No error
    Serial.print("Wind Direction (degrees): ");
    Serial.println(windDirection);
  }

  LoRaWAN_send(SparkFun_Weather_Meter_Wind_Direction, windDirectionError, windDirection);

  // --- Rainfall ---
  double rainfall = Sensor.getRainfall(1);
  if (rainfall == -1) {
    rainfallError = ERROR_SENSOR_DISCONNECTED;  // Error if sensor is disconnected
    Serial.println("Error: Rainfall sensor disconnected!");
  } else {
    rainfallError = NO_ERROR;  // No error
    Serial.print("Rainfall (mm): ");
    Serial.println(rainfall);
  }


  LoRaWAN_send(DFR_Weather_Meter_Rainfall, rainfallError, tempC);

  //--- ENV Shield ---
  Serial.print("Temperature = ");
  Serial.print(ENV.readTemperature());
  Serial.println(" °C");

  LoRaWAN_send(MKR_Environmental_Shield_Temperature, 0x00, ENV.readTemperature());

  Serial.print("Humidity = ");
  Serial.print(ENV.readHumidity());
  Serial.println(" %");

  LoRaWAN_send(MKR_Environmental_Shield_Humidity, 0x00, ENV.readHumidity());

  Serial.print("Pressure = ");
  Serial.print(ENV.readPressure());
  Serial.println(" kPa");

  LoRaWAN_send(MKR_Environmental_Shield_Barometric_Pressure, 0x00, ENV.readPressure());

  Serial.print("Illuminance = ");
  Serial.print(ENV.readIlluminance());
  Serial.println(" lx");

  LoRaWAN_send(MKR_Environmental_Shield_Illuminance, 0x00, ENV.readIlluminance());

  // --- Ultrasonic Distance Sensor ---
  digitalWrite(trig, LOW);
  delay(2);
  digitalWrite(trig, HIGH);
  delay(10);
  digitalWrite(trig, LOW);

  duration = pulseIn(echo, HIGH);
  distance = (duration * 0.0343) / 2;
  if (distance <= 20 || distance >= 600) {
    Serial.println("Error reading Ultrasonic Distance Sensor");
    error = 0x01;
  } else {
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" CM");
    error = 0x00;
  }

  LoRaWAN_send(DFR_Ultrasonic_Distance, error, distance);
}
