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

double duration = 0;
double distance = 0;

// Create an instance of the weather meter kit
SFEWeatherMeterKit weatherMeterKit(windDirectionPin, windSpeedPin, rainfallPin);

// Variables to store rainfall data
float lastRainfall = 0.0;
unsigned long lastTime = 0;

// Uncomment this line to use UART communication
// #define MODE_UART

#ifdef MODE_UART
#include "SoftwareSerial.h"
SoftwareSerial mySerial(/*rx =*/10, /*tx =*/11);
DFRobot_RainfallSensor_UART Sensor(&mySerial);
#else // I2C communication
DFRobot_RainfallSensor_I2C Sensor(&Wire);
#endif

void setup() {
  Serial.begin(115200);

  // Initialize the sensor
  #ifdef MODE_UART
    mySerial.begin(9600);
  #endif 

  delay(1000);
  while(!Sensor.begin()){
    Serial.println("Sensor init err!!!");
    delay(1000);
  }

  // Set up the pins
  pinMode(echo, INPUT);
  pinMode(trig, OUTPUT);

  // Initialize MKR ENV Shield
  // if (!ENV.begin()) {
  //   Serial.println("Failed to initialize MKR ENV Shield!");
  //   while (1);
  // }

  // Initialize the weather meter kit
  weatherMeterKit.begin();
  lastTime = millis();

  sensors.begin();
}

float convertKphToMph(float kph) {
  return kph * 0.621371;
}

float convertMmToInches(float mm) {
  return mm * 0.0393701;
}

void loop() {
  // Request temperatures
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);

  if (tempC != DEVICE_DISCONNECTED_C) {
    Serial.print("Temperature: ");
    Serial.println(tempC);
  } else {
    Serial.println("Error: Could not read temperature data");
  }

  // Get wind speed and direction
  float windSpeedKph = weatherMeterKit.getWindSpeed();
  float windSpeedMph = convertKphToMph(windSpeedKph);

  Serial.print("Wind direction (degrees): ");
  Serial.print(weatherMeterKit.getWindDirection(), 1);
  Serial.print(" | Wind speed (kph): ");
  Serial.print(windSpeedKph, 1);
  Serial.print(" | Wind speed (mph): ");
  Serial.println(windSpeedMph, 1);

  // Get rainfall rate
  float rainfallRateInchesPerMin = 0.0; // Define and calculate this as per your rainfall logic
  Serial.print("Rainfall rate (inches/min): ");
  Serial.println(rainfallRateInchesPerMin, 4);

  // Read ENV sensor values
  Serial.print("Temperature = ");
  Serial.print(ENV.readTemperature());
  Serial.println(" °C");

  Serial.print("Humidity    = ");
  Serial.print(ENV.readHumidity());
  Serial.println(" %");

  Serial.print("Pressure    = ");
  Serial.print(ENV.readPressure());
  Serial.println(" kPa");

  Serial.print("Illuminance = ");
  Serial.print(ENV.readIlluminance());
  Serial.println(" lx");

  Serial.print("UVA         = ");
  Serial.println(ENV.readUVA());

  Serial.print("UVB         = ");
  Serial.println(ENV.readUVB());

  Serial.print("UV Index    = ");
  Serial.println(ENV.readUVIndex());

  // Ultrasonic sensor
  digitalWrite(trig, LOW);
  delay(2);
  digitalWrite(trig, HIGH);
  delay(10);
  digitalWrite(trig, LOW);

  duration = pulseIn(echo, HIGH);
  distance = (duration * .0343) / 2;
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" CM");

  // Rainfall sensor readings
  Serial.print("Sensor WorkingTime: ");
  Serial.print(Sensor.getSensorWorkingTime());
  Serial.println(" H");

  Serial.print("Rainfall: ");
  Serial.println(Sensor.getRainfall());

  Serial.print("1 Hour Rainfall: ");
  Serial.print(Sensor.getRainfall(1));
  Serial.println(" mm");

  Serial.print("Rainfall raw data: ");
  Serial.println(Sensor.getRawData());

  delay(1000);
}