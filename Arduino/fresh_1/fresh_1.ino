#include <MKRWAN.h>
#include <Arduino.h>
#include <OneWire.h>
#include <Wire.h>
#include <DallasTemperature.h>
#include <wiring_private.h>
#include <wdt_samd21.h>

#include "arduino_secrets.h"
#include "sensor_ids.h"


// LoRaWAN credentials are stored in arduino_secrets.h
String appEui = SECRET_APP_EUI;
String appKey = SECRET_APP_KEY;

#define EC_SENSOR_PIN A4     // Analog pin for the EC sensor
// #define PH_SENSOR_PIN A3

// Variables for EC and pH calibration
const double V_REF = 3.3;              // Reference voltage for MKR WAN 1310
const int ADC_RES_BITS = 4095;         // 12-bit ADC resolution (renamed to avoid conflict)


LoRaModem modem;

#define ONE_WIRE_BUS 0
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

Uart mySerial(&sercom3, 7, 6, SERCOM_RX_PAD_3, UART_TX_PAD_2);  // RX on pin 7, TX on pin 6

char error = 0x00;
double temp = 0;
double distance = 0;

unsigned char data[4] = {0};

unsigned long start;
unsigned long last_success;

void setup() {
  start = millis();
  
  wdt_init (WDT_CONFIG_PER_16K);

  Serial.begin(115200);
  mySerial.begin(9600);

  pinPeripheral(6, PIO_SERCOM_ALT);
  pinPeripheral(7, PIO_SERCOM_ALT);

  pinMode(LED_BUILTIN, OUTPUT);

  // Initialize temperature sensors
  sensors.begin();

  wdt_reset();

  if (!modem.begin(US915)) {
    Serial.println("Failed to start module");
    NVIC_SystemReset();
  };

  wdt_reset();

  for (unsigned int i = 0; i < 72; i++) {
    modem.disableChannel(i);
  }

  // LoRaWAN Regional Parameters and TTN specification: channels 8 to 15 plus 65
  for (unsigned int i = 8; i <= 15; i++) {
    modem.enableChannel(i);
  }

  modem.enableChannel(65);

  wdt_reset();

  // Connect to the LoRaWAN network
  int connected = false;
  int tries = 0;
  do {
    Serial.println("Attempting to connect");
    wdt_disable ( );
    connected = modem.joinOTAA(appEui, appKey);
    wdt_reEnable ( );
    tries++;
    if(tries >= 15){
      NVIC_SystemReset();
    }
    delay(1000);
    wdt_reset();
  } while (!connected);

  modem.minPollInterval(5);
  last_success = millis();

  wdt_reset();
}

// the loop routine runs over and over again forever:
void loop() {
  wdt_reset();

  // --- Temperature Sensor ---
  sensors.requestTemperatures();
  temp = sensors.getTempCByIndex(0);
  if (temp < -50 || temp > 65) {
    error = 0x01;  // DS18B20 Temperature out of range
  }

  else {
    error = 0x00;
  }

  Serial.print("Temperature: ");
  Serial.println(temp);

  wdt_reset();
  LoRaWAN_send(DS18B2_Temperature_Probe_ID, error, temp);
  wdt_reset();

  // --- Depth Sensor ---
  distance = ultrasonic_read();
  if (distance) {
    error = 0x00;
  } else {
    error = 0x01;
  }

  wdt_reset();
  LoRaWAN_send(DFR_Ultrasonic_Distance_ID, error, distance);
  wdt_reset();

  Serial.print("EC = ");
  Serial.println(readECSensor());

  wdt_reset();
  LoRaWAN_send(EC_ID, 0x00, readECSensor());
  wdt_reset();

  // Serial.print("PH = ");
  // Serial.println(readPHSensor());

  // wdt_reset();
  // LoRaWAN_send(PH_ID, 0x00, readPHSensor());
  // wdt_reset();


  // Reboot every 3 days
  if((millis() - start) >= 259200000UL){
    NVIC_SystemReset();
  }

  // Reboot if last message was more than 15 mins
  if((millis() - last_success) >= 900000UL){
    NVIC_SystemReset();
  }

  for (int i = 0; i < 1; i++) {
    delay(1000);
    wdt_reset();
  }
}

// Attach the interrupt handler to the SERCOM
void SERCOM3_Handler() {
  mySerial.IrqHandler();
}

bool LoRaWAN_send(char SID, char error, double reading) {
  int err;
  for (int i = 0; i < 5; i++) {
    wdt_reset();
    modem.beginPacket();
    modem.write(SID);
    modem.write(error);
    modem.write(reading);
    err = modem.endPacket(true);
    wdt_reset();
    unsigned long start_w = millis();
    while (millis() - start_w < 5000)
      ;
    wdt_reset();
    if (err > 0) {
      Serial.println("Message sent correctly!");
      last_success = millis();
      
      for (int i = 0; i < 3; i++) {
        digitalWrite(LED_BUILTIN, HIGH);
        delay(100);
        digitalWrite(LED_BUILTIN, LOW);
        delay(100);
      }
      break;
    } else {
      Serial.println("Error sending message.");
    }
  }

  wdt_reset();
  if (!modem.available()) {
    Serial.println("No downlink message received at this time.");
    return err > 0;
  }
  char rcv[64];
  int i = 0;
  while (modem.available()) {
    rcv[i++] = (char)modem.read();
  }
  wdt_reset();
  Serial.print("Received: ");
  for (unsigned int j = 0; j < i; j++) {
    Serial.print(rcv[j] >> 4, HEX);
    Serial.print(rcv[j] & 0xF, HEX);
    Serial.print(" ");
  }
  Serial.println();
  wdt_reset();
  return err > 0;
}

double ultrasonic_read() {
  unsigned long timeout = millis() + 1000;
  while (millis() < timeout) {
    if (mySerial.available() >= 4) {
      unsigned char data[4];
      for (int i = 0; i < 4; i++) {
        data[i] = mySerial.read();
      }
      while (mySerial.available() && mySerial.read() == 0xFF) {
        if (mySerial.available() >= 4) {
          for (int i = 0; i < 4; i++) {
            data[i] = mySerial.read();
          }
        } else {
          return 0;
        }
      }
      while (mySerial.available()) {
        mySerial.read();
      if (data[0] == 0xFF) {
        int sum = (data[0] + data[1] + data[2]) & 0x00FF;
        if (sum == data[3]) {
          float distance = (data[1] << 8) + data[2];
          distance /= 10.0;
          if (distance > 28.0) {
            Serial.print("Distance: ");
            Serial.print(distance);
            Serial.println(" cm");
            return (double)distance;
          } else {
            Serial.println("Below the lower limit");
          }
        } else {
          Serial.println("Checksum error");
        }
      }
    }
  }
  Serial.println("No valid data received");
  return 0;
}

// Function to read data from the pH sensor
// float readPHSensor() {
//    int sensorValue = analogRead(PH_SENSOR_PIN);           // Read the analog value
//    float voltage = sensorValue * (V_REF / ADC_RES_BITS);  // Convert ADC value to voltage
//    float current = voltage / 100.0 * 1000;                // Calculate current in mA (Ohm's Law)
//    float pH = (current - 4.0) * (14.0 / 16.0);            // Convert current to pH value
//    return pH;
//  }

 // Function to read data from the EC sensor
 float readECSensor() {
    float EC;
    int sensorValue = analogRead(EC_SENSOR_PIN);           // Read the analog value
    Serial.print("EC analog:");
    Serial.println(sensorValue);
    
    EC = sensorValue * .22541;

   return EC;
 }