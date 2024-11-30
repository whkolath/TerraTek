// #include "Wire.h"
// #include "SHT31.h"

// #define SHT31_ADDRESS   0x44

// uint32_t start;
// uint32_t stop;

// SHT31 sht;


// void setup()
// {
//   Serial.begin(115200);
  
//   Serial.println(__FILE__);
//   Serial.print("SHT31_LIB_VERSION: \t");
//   Serial.println(SHT31_LIB_VERSION);

//   Wire.begin();
//   Wire.setClock(100000);
//   sht.begin();

//   uint16_t stat = sht.readStatus();
//   Serial.print(stat, HEX);
//   Serial.println();
//   Serial.print("hello");
// }


// void loop()
// {
//   start = micros();
//   sht.read();         //  default = true/fast       slow = false
//   stop = micros();

//   Serial.print("\t");
//   Serial.print(stop - start);
//   Serial.print("\t");
//   Serial.print(sht.getTemperature(), 1);
//   Serial.print("\t");
//   Serial.println(sht.getHumidity(), 1);
//   delay(100);
// }

// Old Code
//********************************************************************************************************************
// New Code

#include "Wire.h"
#include "SHT31.h"
#include <Arduino_MKRENV.h>

#define SHT31_ADDRESS 0x44

// DS18B20 Error Codes:
// 0x311: DS18B20 Temperature too low (below 0°C)
// 0x312: DS18B20 Temperature too high (above 50°C)
// 0x323: DS18B20 Sensor read failure

// MKR ENV Shield Error Codes:
// 0x411: Humidity too low (below 20%)
// 0x412: Humidity too high (above 90%)
// 0x421: Pressure too low (below 80 kPa)
// 0x422: Pressure too high (above 120 kPa)
// 0x431: Illuminance too low (below 0 lx)
// 0x432: Illuminance too high (above 100,000 lx)
// 0x441: UVA/UVB sensor failure (negative values)
// 0x451: UV Index too high (above 15)
// 0x423: ENV Shield initialization failure

SHT31 sht;

// Function to log errors
void logError(uint16_t errorCode) {
  Serial.print("Error Code: ");
  Serial.println(errorCode, HEX);
}

void setup() {
  Serial.begin(115200);
  while (!Serial);

  // Initialize DS18B20 (SHT31)
  Serial.println("Initializing DS18B20...");
  if (!sht.begin(SHT31_ADDRESS)) {
    logError(0x323);  // DS18B20 Sensor initialization failed
    while (1) delay(10);  // Halt further operation
  }

  // Initialize MKR ENV Shield
  Serial.println("Initializing MKR ENV Shield...");
  if (!ENV.begin()) {
    logError(0x423);  // MKR ENV Shield initialization failed
    while (1);  // Halt further operation
  }
}

void loop() {
  // DS18B20 Temperature Reading
  if (!sht.read()) {  // Attempt to read DS18B20 sensor
    logError(0x323);  // DS18B20 Sensor read failure
  } else {
    float ds18b20Temp = sht.getTemperature();

    // DS18B20 Error Checks
    if (ds18b20Temp < 0) {
      logError(0x311);  // DS18B20 Temperature too low
    } else if (ds18b20Temp > 50) {
      logError(0x312);  // DS18B20 Temperature too high
    } else {
      // Print DS18B20 Temperature
      Serial.print("DS18B20 Temperature: ");
      Serial.print(ds18b20Temp, 1);
      Serial.println(" °C");
    }
  }

  // MKR ENV Shield Sensor Readings
  float humidity = ENV.readHumidity();
  float pressure = ENV.readPressure();
  float illuminance = ENV.readIlluminance();
  float uva = ENV.readUVA();
  float uvb = ENV.readUVB();
  float uvIndex = ENV.readUVIndex();

  // MKR ENV Shield Error Checks
  if (humidity < 20) {
    logError(0x411);  // Humidity too low
  } else if (humidity > 90) {
    logError(0x412);  // Humidity too high
  }

  if (pressure < 80) {
    logError(0x421);  // Pressure too low
  } else if (pressure > 120) {
    logError(0x422);  // Pressure too high
  }

  if (illuminance < 0) {
    logError(0x431);  // Illuminance too low
  } else if (illuminance > 100000) {
    logError(0x432);  // Illuminance too high
  }

  if (uva < 0 || uvb < 0) {
    logError(0x441);  // UVA/UVB sensor failure
  }

  if (uvIndex > 15) {
    logError(0x451);  // UV Index too high
  }

  // Print MKR ENV Shield Readings
  Serial.print("Humidity    = ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("Pressure    = ");
  Serial.print(pressure);
  Serial.println(" kPa");

  Serial.print("Illuminance = ");
  Serial.print(illuminance);
  Serial.println(" lx");

  Serial.print("UVA         = ");
  Serial.println(uva);

  Serial.print("UVB         = ");
  Serial.println(uvb);

  Serial.print("UV Index    = ");
  Serial.println(uvIndex);

  // Print an empty line
  Serial.println();

  // Wait 1 second before next iteration
  delay(1000);
}
