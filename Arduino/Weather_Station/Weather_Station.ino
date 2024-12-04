#include "SparkFun_Weather_Meter_Kit_Arduino_Library.h"

// Below are the pin definitions for each sensor of the weather meter kit
// Pins for the Arduino Uno
int windDirectionPin = A1;
int windSpeedPin = 3;
int rainfallPin = 2;

// Create an instance of the weather meter kit
SFEWeatherMeterKit weatherMeterKit(windDirectionPin, windSpeedPin, rainfallPin);

// Function to convert kph to mph
float convertKphToMph(float kph) {
    return kph * 0.621371;
}

// Function to convert mm to inches
float convertMmToInches(float mm) {
    return mm * 0.0393701;
}

// Variables to store rainfall data
float lastRainfall = 0.0;
unsigned long lastTime = 0;

void setup()
{
    // Begin serial
    Serial.begin(9600);

#ifdef SFE_WMK_PLAFTORM_UNKNOWN
    weatherMeterKit.setADCResolutionBits(10);
    
    Serial.println(F("Unknown Signal"));
    Serial.println();
#endif

    // Begin weather meter kit
    weatherMeterKit.begin();
    lastTime = millis();  // Initialize last time
}

void loop()
{
    // Get the current wind speed and total rainfall
    float windSpeedKph = weatherMeterKit.getWindSpeed();
    float windSpeedMph = convertKphToMph(windSpeedKph);
    
    // Calculate rainfall rate in inches per minute
    float currentRainfall = weatherMeterKit.getTotalRainfall();
    unsigned long currentTime = millis();
    float timeDifference = (currentTime - lastTime) / 60000.0; // Convert ms to minutes
    
    // Check for time difference to avoid division by zero
    float rainfallRateInchesPerMin = 0.0;
    if (timeDifference > 0) {
        float rainfallDifference = currentRainfall - lastRainfall;
        rainfallRateInchesPerMin = convertMmToInches(rainfallDifference) / timeDifference;
    }

    // Update last recorded values
    lastRainfall = currentRainfall;
    lastTime = currentTime;

    // Print data from weather meter kit
    Serial.print(F("Wind direction (degrees): "));
    Serial.print(weatherMeterKit.getWindDirection(), 1);
    Serial.print(F("\t\t"));
    Serial.print(F("Wind speed (kph): "));
    Serial.print(windSpeedKph, 1);
    Serial.print(F("\t\t"));
    Serial.print(F("Wind speed (mph): "));
    Serial.print(windSpeedMph, 1);
    Serial.print(F("\t\t"));
    Serial.print(F("Rainfall rate (inches/min): "));
    Serial.println(rainfallRateInchesPerMin, 4);

    delay(100);
}
