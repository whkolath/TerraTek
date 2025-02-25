#define PH_SENSOR_PIN A3        // Analog pin for the pH sensor
#define EC_SENSOR_PIN A4        // Analog pin for the EC sensor


// Variables for EC and pH data reading
const float V_REF = 3.3;         // Reference voltage for MKR WAN 1310
const int ADC_RES_BITS = 4095;   // 12-bit ADC resolution (renamed to avoid conflict)

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  while (!Serial);

  // Set ADC resolution to 12 bits
  analogReadResolution(12);
}

void loop() {

  // Read EC sensor data
  double ec = readECSensor();

  // Read pH sensor data
  float pH = readPHSensor();

  // Display results
  Serial.print("EC Value: "); Serial.println(ec);
  Serial.print("pH Value: "); Serial.println(pH);

  delay(5000); // Delay between readings
}

// Function to read data from the pH sensor
float readPHSensor() {
  int sensorValue = analogRead(PH_SENSOR_PIN); // Read the analog value
  float voltage = sensorValue * (V_REF / ADC_RES_BITS); // Convert ADC value to voltage
  float current = voltage / 100.0 * 1000; // Calculate current in mA (Ohm's Law)
  float pH = current * (14.0 / 16.0); // Convert current to pH value
  return pH;
}

// Function to read data from the EC sensor
float readECSensor() {
  int analogValue = analogRead(EC_SENSOR_PIN); // Read the analog value
  double voltage = analogValue * (V_REF / ADC_RES_BITS); // Convert ADC value to voltage
  double current = voltage / 100.0 * 1000; // Calculate current in mA (Ohm's Law)
  double ec = current * 6.1; // Convert current to EC value
  return ec;
}


