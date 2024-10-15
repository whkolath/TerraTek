use TerraTek;

SET FOREIGN_KEY_CHECKS=0;
Drop table IF EXISTS Boards;
drop table IF EXISTS Sensors;
drop table IF EXISTS Readings;
SET FOREIGN_KEY_CHECKS=1;


CREATE TABLE Boards (
    Board_ID VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    CONSTRAINT Boards_PK PRIMARY KEY (Board_ID)
);

CREATE TABLE Sensors (
    Sensor_ID VARCHAR(255) NOT NULL,
    Sensor_Type VARCHAR(255),
    Units VARCHAR(255),
    CONSTRAINT Sensors_PK PRIMARY KEY (Sensor_ID)
);

CREATE TABLE Readings (
    Reading_ID INT NOT NULL AUTO_INCREMENT,
    Board_ID VARCHAR(255) NOT NULL,
    Sensor_ID VARCHAR(255) NOT NULL,
    Sensor_Value DOUBLE,
    Sensor_Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT Readings_PK PRIMARY KEY (Reading_ID),
    CONSTRAINT Readings_FK1 FOREIGN KEY (Board_ID)
        REFERENCES Boards (Board_ID),
    CONSTRAINT Readings_FK2 FOREIGN KEY (Sensor_ID)
        REFERENCES Sensors (Sensor_ID)
);

INSERT INTO Boards  (Board_ID, Location)
VALUES  ("testingboard1", "WTAMU Campus" );

INSERT INTO Boards  (Board_ID, Location)
VALUES  ("rwh1", "1250 gallon fresh water RWH tank on north side of property." );

INSERT INTO Boards  (Board_ID, Location)
VALUES  ("rwh2", "1250 gallon fresh water RWH tank on west side of property." );

INSERT INTO Boards  (Board_ID, Location)
VALUES  ("rwh3", "3750 gallon fresh water RWH tank on east side of property." );

INSERT INTO Boards  (Board_ID, Location)
VALUES  ("rwh4", "3750 gallon grey water RWH tank on south side of property." );

INSERT INTO Boards  (Board_ID, Location)
VALUES  ("Weather_Station", "Garden" );


-- env_iii

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("SHT31_Temperature", "Atmospheric Temperature", "Celsius" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("SHT31_Humidity", "Humidity", "Percent" );


-- MKR_Environmental_Shield

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("MKR_Environmental_Shield_Temperature", "Atmospheric Temperature", "Celsius" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("MKR_Environmental_Shield_Humidity", "Humidity", "Percent" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("MKR_Environmental_Shield_Pressure", "Barometric Pressure", "Kilopascals" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("MKR_Environmental_Shield_Illuminance", "Illuminance", "lux" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("MKR_Environmental_Shield_UVA", "Ultra Violet A", "?" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("MKR_Environmental_Shield_UVB", "Ultra Violet B", "?" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("MKR_Environmental_Shield_UvIndex", "UV Index", "?" );



-- SparkFun_Weather_Meter_Kit

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("SEN-15901_Weather_Meter_Wind_Speed", "Wind Speed", "Kilometers per Hour" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("SEN-15901_Weather_Meter_Wind_Direction", "Wind Direction", "Degrees" );


-- DFRobot Gravity Analog Electrical Conductivity Meter

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("DFR0300_Conductivity_Meter", "Electrical Conductivity", "ms/cm" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("DFR0300_Temperature", "Water Temperature", "Celsius" );


-- Waterproof Ultrasonic Distance Sensor

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("ME007YS_Ultrasonic_Distance", "Tank Level Sensor", "CM" );




INSERT INTO Readings  (Board_ID, Sensor_ID, Sensor_Value)
VALUES  ("testingboard1", "SHT31_Temperature", 23.562);

INSERT INTO Readings  (Board_ID, Sensor_ID, Sensor_Value)
VALUES  ("rwh1", "SHT31_Humidity", 56.5);

SELECT * FROM Boards;
SELECT * FROM Sensors;
SELECT * FROM Readings;
