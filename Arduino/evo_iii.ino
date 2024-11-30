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

#define SHT31_ADDRESS   0x44

// Error Codes:
// 0x311: Temperature too low (below 0°C)
// 0x312: Temperature too high (above 50°C)
// 0x323: Sensor read failure

uint32_t start;
uint32_t stop;

SHT31 sht;

// Function to log errors
void logError(uint16_t errorCode) {
  Serial.print("Error Code: ");
  Serial.println(errorCode, HEX);
}

void setup()
{
  Serial.begin(115200);

  Serial.println(__FILE__);
  Serial.print("SHT31_LIB_VERSION: \t");
  Serial.println(SHT31_LIB_VERSION);

  Wire.begin();
  Wire.setClock(100000);

  if (!sht.begin(SHT31_ADDRESS)) {
    logError(0x323); // Sensor initialization failed
    while (1) delay(10); // Halt further operation
  }

  uint16_t stat = sht.readStatus();
  Serial.print("Sensor Status: 0x");
  Serial.println(stat, HEX);
}

void loop()
{
  start = micros();
  if (!sht.read()) {  // Attempt to read sensor data
    logError(0x323);  // Sensor read failure
    delay(1000);
    return;
  }
  stop = micros();

  float temperature = sht.getTemperature();

  // Error Checks
  if (temperature < 0) {
    logError(0x311);  // Temperature too low
  } else if (temperature > 60) {
    logError(0x312);  // Temperature too high
  }

  // Print valid readings
  Serial.print("Time: ");
  Serial.print(stop - start);
  Serial.print(" us\tTemperature: ");
  Serial.print(temperature, 1);
  Serial.println(" °C");

  delay(100);
}