# Project Overview
This project presents the development of TerraTek, an IoT-based monitoring system designed
to assist a customer in tracking environmental data. The system utilizes Arduino-controlled
sensor clusters to gather data on key parameters such as rainfall, water pH, water level, and
so on, which are then transmitted to a centralized server. A responsive web interface allows
users to visualize data trends and generate reports to aid decision-making processes. Through
data analysis, the project demonstrates improved statistics by utilizing historical and real-time
data. Future work will involve extending the system’s capabilities to include real-time camera
monitoring based on sensor data


# Error Codes for MKR ENV SHIELD & DS18B20 Sensors

| **Sensor**         | **Error Code** | **Threshold**                                  | **Description**                     |
|---------------------|----------------|-----------------------------------------------|-------------------------------------|
| **DS18B20**         | `0x311`        | Below 0°C                                     | Temperature too low                |
|                     | `0x312`        | Above 50°C                                    | Temperature too high               |
|                     | `0x323`        | Sensor read failure                           | Sensor unresponsive                |
| **Humidity**        | `0x411`        | Below 20%                                     | Humidity too low                   |
|                     | `0x412`        | Above 90%                                     | Humidity too high                  |
| **Pressure**        | `0x421`        | Below 80 kPa                                  | Pressure too low                   |
|                     | `0x422`        | Above 120 kPa                                 | Pressure too high                  |
| **Illuminance**     | `0x431`        | Below 0 lx                                    | Illuminance too low (sensor issue) |
|                     | `0x432`        | Above 100,000 lx                              | Illuminance too high               |
| **UVA/UVB**         | `0x441`        | Negative values                               | Sensor failure                     |
| **UV Index**        | `0x451`        | Above 15                                      | UV Index too high                  |
| **MKR ENV Shield**  | `0x423`        | Initialization failure                        | Sensor initialization failed       |
