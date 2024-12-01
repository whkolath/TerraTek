#include <Wire.h>               // Library for I2C communication
#include <SparkFun_External_EEPROM.h> // SparkFun EEPROM library
#include <DallasTemperature.h>  // DS18B20 temperature sensor library
#include <OneWire.h>            // OneWire library for DS18B20

// Constants
#define EEPROM_ADDRESS 0x50     // I2C address of the 24FC512 EEPROM
#define PH_SENSOR_PIN A2        // Analog pin for the pH sensor
#define EC_SENSOR_PIN A0        // Analog pin for the EC sensor
#define TEMP_SENSOR_PIN 2       // Digital pin for the DS18B20 sensor

// EEPROM object
ExternalEEPROM eeprom;

// OneWire and DallasTemperature objects for DS18B20
OneWire oneWire(TEMP_SENSOR_PIN);
DallasTemperature ds18b20(&oneWire);

// Variables for EC and pH calibration
float ecKConstant = 1.0;         // Default EC sensor calibration constant
const float TEMP_COEFFICIENT = 0.02; // Temperature coefficient for EC correction
const float V_REF = 3.3;         // Reference voltage for MKR WAN 1310
const int ADC_RES_BITS = 4095;   // 12-bit ADC resolution (renamed to avoid conflict)

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  while (!Serial);

  // Set ADC resolution to 12 bits
  analogReadResolution(12);

  // Initialize DS18B20 temperature sensor
  ds18b20.begin();

  Wire.begin();

  // Initialize EEPROM
  Serial.println("Initializing EEPROM...");
if (eeprom.begin() != 0) {
  Serial.println("EEPROM initialization failed!");
} else {
  Serial.println("EEPROM initialized successfully.");
}

}

void loop() {
  // Read temperature from DS18B20
  float temperature = readTemperature();

  // Read EC sensor data and apply temperature correction
  float ec = readECSensor();
  float ecCorrected = correctEC(ec, temperature);

  // Read pH sensor data
  float pH = readPHSensor();

  // Display results
  Serial.print("Temperature (°C): "); Serial.println(temperature);
  Serial.print("EC Value: "); Serial.println(ec);
  Serial.print("Corrected EC Value: "); Serial.println(ecCorrected);
  Serial.print("pH Value: "); Serial.println(pH);

  delay(5000); // Delay between readings
}

// Function to read data from the pH sensor
float readPHSensor() {
  int sensorValue = analogRead(PH_SENSOR_PIN); // Read the analog value
  float voltage = sensorValue * (V_REF / ADC_RES_BITS); // Convert ADC value to voltage
  float current = voltage / 100.0 * 1000; // Calculate current in mA (Ohm's Law)
  float pH = (current - 4.0) * (14.0 / 16.0); // Convert current to pH value
  return pH;
}

// Function to read data from the EC sensor
float readECSensor() {
  int analogValue = analogRead(EC_SENSOR_PIN); // Read the analog voltage
  float voltage = analogValue * (V_REF / ADC_RES_BITS); // Convert to voltage
  float ec = voltage * ecKConstant; // Convert voltage to EC using calibration constant
  return ec;
}

// Function to correct EC value for temperature
float correctEC(float ec, float temperature) {
  return ec / (1 + TEMP_COEFFICIENT * (temperature - 25.0));
}

// Function to read temperature from DS18B20
float readTemperature() {
  ds18b20.requestTemperatures();            // Request temperature readings
  return ds18b20.getTempCByIndex(0);        // Get temperature in Celsius
}

// Function to load EC calibration data from EEPROM
void loadECCalibration() {
  ecKConstant = readFloatFromEEPROM(0); // Read EC calibration constant from EEPROM
  Serial.print("Loaded EC Calibration Constant: "); Serial.println(ecKConstant);
}

// Function to save EC calibration data to EEPROM
void saveECCalibration(float newKConstant) {
  ecKConstant = newKConstant; // Update the calibration constant
  writeFloatToEEPROM(0, ecKConstant); // Save to EEPROM at address 0
  Serial.print("Saved EC Calibration Constant to EEPROM: "); Serial.println(ecKConstant);
}

// Example function to perform EC calibration (call during calibration)
void performECCalibration(float measuredVoltage, float knownEC) {
  // Calculate the new calibration constant
  float newKConstant = knownEC / measuredVoltage;
  saveECCalibration(newKConstant); // Save the new constant to EEPROM
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
