#include "WiFiS3.h"
#include "Arduino_JSON.h"
#include "ArduinoMDNS.h"
#include "WiFiUdp.h"
#include "SPI.h"

#include "Wire.h"
#include "SHT31.h"
#include "ArduinoGraphics.h"
#include "Arduino_LED_Matrix.h"

#define SHT31_ADDRESS   0x44
#define SECRET_SSID "******"
#define SECRET_PASS "******"
const char hostname[] = "testingboard1";

SHT31 sht;
ArduinoLEDMatrix matrix;
WiFiUDP udp;

MDNS mdns(udp);

char ssid[] = SECRET_SSID;      
char pass[] = SECRET_PASS;  
int keyIndex = 0;            

int status = WL_IDLE_STATUS;
String text = "";

WiFiServer server(80);

void setup() {
  Serial.begin(9600);
  while (!Serial){;}

  matrix.begin();

  while (status != WL_CONNECTED) {
    status = WiFi.begin(ssid, pass);
    text = String("    CONNECTING TO: ") + String(ssid) + String("...");
    Serial.println(text); 
    printMatrix(text, 60);              
  }

  mdns.begin(WiFi.localIP(), hostname);

  server.begin();

  IPAddress ip = WiFi.localIP();
 
  text = String("    CONNECTED");                      
  Serial.println(ip);
  printMatrix(text, 60);

  // Initialize sensor
  Wire.begin();
  Wire.setClock(100000);
  if (!sht.begin()) {
    Serial.println("Failed to initialize SHT31 sensor");
  }

  uint16_t stat = sht.readStatus();
  Serial.print("SHT31 Status: ");
  Serial.println(stat, HEX);
}


void loop() {
  
  mdns.run();
  WiFiClient client = server.available();   

  if (client) {                             
    Serial.println("new client");          
    String currentLine = "";         
    while (client.connected()) {      
      if (client.available()) {           
        char c = client.read();            
        Serial.write(c);                    
        if (c == '\n') {              
          if (currentLine.length() == 0) {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:application/json");
            client.println("Connection: close");
            client.println();
            
            client.println(readSensors());
            
            break;
          } else {
            currentLine = "";
          }
        } else if (c != '\r') {
          currentLine += c;
        }
      }
      
    }
    client.stop();
    Serial.println("client disconnected");
  }
}

JSONVar readSensors() {
  JSONVar sensorData;

  sht.read();
  double temperature = sht.getTemperature();
  double humidity = sht.getHumidity();

  // double temperature = 123.5;
  // double humidity = 33.22;

  sensorData["temperature"] = temperature;
  sensorData["humidity"] = humidity;
  return sensorData;
}

void printMatrix(String text, int speed){
  matrix.beginDraw();

  matrix.stroke(0xFFFFFFFF);
  matrix.textScrollSpeed(speed);

  matrix.textFont(Font_4x6);
  matrix.beginText(0, 1, 0xFFFFFF);
  matrix.println(text);
  matrix.endText(SCROLL_LEFT);

  matrix.endDraw();
}