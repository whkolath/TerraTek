#include <Arduino_MKRENV.h>
#include <SparkFun_Weather_Meter_Kit_Arduino_Library.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <MKRWAN.h>
#include "arduino_secrets.h"

String appEui = SECRET_APP_EUI;
String appKey = SECRET_APP_KEY;

LoRaModem modem;

const int windDirectionPin = A1;
const int temp_sensor = 0;
const int rainfallPin = 1;
const int echo = 2;
const int trig = 3;
const int windSpeedPin = 5;

double duration = 0;
double distance = 0;

SFEWeatherMeterKit weatherMeterKit(windDirectionPin, windSpeedPin, rainfallPin);
OneWire oneWire(temp_sensor);

DallasTemperature sensors(&oneWire);

float lastRainfall = 0.0;
unsigned long lastTime = 0;

// Function to convert kph to mph
float convertKphToMph(float kph) {
  return kph * 0.621371;
}

// Function to convert mm to inches
float convertMmToInches(float mm) {
  return mm * 0.0393701;
}

void LoRaWAN_send(char SID, char error, double reading)
{
  modem.beginPacket();
  modem.write(SID);
  modem.write(error);
  modem.write(reading);

  int err;
  err = modem.endPacket(true);
  if (err > 0) {
    Serial.println("Message sent correctly!");
  } else {
    Serial.println("Error sending message :(");
    Serial.println("(you may send a limited amount of messages per minute, depending on the signal strength");
    Serial.println("it may vary from 1 message every couple of seconds to 1 message every minute)");
  }
}

void setup() {
  Serial.begin(9600);

  // pinMode(echo, INPUT);
  // pinMode(trig, OUTPUT);

  if (!modem.begin(US915)) {
    Serial.println("Failed to start module");
    while (1) {}
  };
  // Serial.print("Your module version is: ");
  // Serial.println(modem.version());
  // Serial.print("Your device EUI is: ");
  // Serial.println(modem.deviceEUI());


  // // Begin weather meter kit
  // weatherMeterKit.begin();
  // lastTime = millis();  // Initialize last time

  // sensors.begin();
  int connected = false;
  do {
    Serial.println("Attempting to connect");
    connected = modem.joinOTAA(appEui, appKey);
  } while (!connected);
}

void loop() {
  // Serial.print("Requesting temperatures...");
  // sensors.requestTemperatures();  // Send the command to get temperatures
  // Serial.println("DONE");
  // // After we got the temperatures, we can print them here.
  // // We use the function ByIndex, and as an example get the temperature from the first sensor only.
  // float tempC = sensors.getTempCByIndex(0);

  // // Check if reading was successful
  // if (tempC != DEVICE_DISCONNECTED_C) {
  //   Serial.print("Temperature for the device 1 (index 0) is: ");
  //   Serial.println(tempC);
  // } else {
  //   Serial.println("Error: Could not read temperature data");
  // }
  // // Get the current wind speed and total rainfall
  // float windSpeedKph = weatherMeterKit.getWindSpeed();
  // float windSpeedMph = convertKphToMph(windSpeedKph);

  // // Calculate rainfall rate in inches per minute
  // float currentRainfall = weatherMeterKit.getTotalRainfall();
  // unsigned long currentTime = millis();
  // float timeDifference = (currentTime - lastTime) / 60000.0;  // Convert ms to minutes

  // // Check for time difference to avoid division by zero
  // float rainfallRateInchesPerMin = 0.0;
  // if (timeDifference > 0) {
  //   float rainfallDifference = currentRainfall - lastRainfall;
  //   rainfallRateInchesPerMin = convertMmToInches(rainfallDifference) / timeDifference;
  // }

  // // Update last recorded values
  // lastRainfall = currentRainfall;
  // lastTime = currentTime;

  // // Print data from weather meter kit
  // Serial.print(F("Wind direction (degrees): "));
  // Serial.print(weatherMeterKit.getWindDirection(), 1);
  // Serial.print(F("\t\t"));
  // Serial.print(F("Wind speed (kph): "));
  // Serial.print(windSpeedKph, 1);
  // Serial.print(F("\t\t"));
  // Serial.print(F("Wind speed (mph): "));
  // Serial.print(windSpeedMph, 1);
  // Serial.print(F("\t\t"));
  // Serial.print(F("Rainfall rate (inches/min): "));
  // Serial.println(rainfallRateInchesPerMin, 4);

  // // read all the sensor values
  // float temperature = ENV.readTemperature();
  // float humidity = ENV.readHumidity();
  // float pressure = ENV.readPressure();
  // float illuminance = ENV.readIlluminance();
  // float uva = ENV.readUVA();
  // float uvb = ENV.readUVB();
  // float uvIndex = ENV.readUVIndex();

  // // print each of the sensor values
  // Serial.print("Temperature = ");
  // Serial.print(temperature);
  // Serial.println(" °C");

  // Serial.print("Humidity    = ");
  // Serial.print(humidity);
  // Serial.println(" %");

  // Serial.print("Pressure    = ");
  // Serial.print(pressure);
  // Serial.println(" kPa");

  // Serial.print("Illuminance = ");
  // Serial.print(illuminance);
  // Serial.println(" lx");

  // Serial.print("UVA         = ");
  // Serial.println(uva);

  // Serial.print("UVB         = ");
  // Serial.println(uvb);

  // Serial.print("UV Index    = ");
  // Serial.println(uvIndex);

  // // print an empty line
  // Serial.println();
  // digitalWrite(trig, LOW);
  // delay(2);
  // digitalWrite(trig, HIGH);
  // delay(10);
  // digitalWrite(trig, LOW);

  // duration = pulseIn(echo, HIGH);

  // distance = (duration * .0343) / 2;

  // Serial.print("Distance: ");
  // Serial.print(distance);
  // Serial.println("CM");


  char SID = 0x01;
  char error = 0x00;

  double reading = 25.666;

  LoRaWAN_send(SID, error, reading);

  delay(10000);
}
