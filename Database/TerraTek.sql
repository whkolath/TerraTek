use TerraTek;

SET FOREIGN_KEY_CHECKS=0;
Drop table IF EXISTS Boards;
drop table IF EXISTS Sensors;
drop table IF EXISTS Readings;
drop table IF EXISTS Sensor_Errors;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE Dates (
    TIMESTAMP TIMESTAMP PRIMARY KEY
);

CREATE TABLE Boards (
    Board_ID VARCHAR(255) NOT NULL,
    Board_Description VARCHAR(255),
    CONSTRAINT Boards_PK PRIMARY KEY (Board_ID)
);

CREATE TABLE Sensors (
    Sensor_ID INT NOT NULL,
    Sensor_Description VARCHAR(255),
    Units VARCHAR(255),
    CONSTRAINT Sensors_PK PRIMARY KEY (Sensor_ID)
);

CREATE TABLE Sensor_Errors (
    Error_ID INT NOT NULL,
    Error_Description VARCHAR(255),
    CONSTRAINT Errors_PK PRIMARY KEY (Error_ID)
);

CREATE TABLE Readings (
    Reading_ID INT NOT NULL AUTO_INCREMENT,
    Board_ID VARCHAR(255),
    Sensor_ID INT NOT NULL,
    Error_ID INT DEFAULT 0,
    Sensor_Value DOUBLE,
    Sensor_Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT Readings_PK PRIMARY KEY (Reading_ID),
    CONSTRAINT Readings_FK1 FOREIGN KEY (Board_ID)
        REFERENCES Boards (Board_ID),
    CONSTRAINT Readings_FK2 FOREIGN KEY (Sensor_ID)
        REFERENCES Sensors (Sensor_ID),
	CONSTRAINT Readings_FK3 FOREIGN KEY (Error_ID)
        REFERENCES Sensor_Errors (Error_ID)
);

DELIMITER //
CREATE PROCEDURE FillDateTable(startDate DATETIME, endDate DATETIME) BEGIN
WHILE startDate <= endDate DO
    INSERT INTO Dates (timestamp) VALUES (startDate);         
    SET startDate = DATE_ADD(startDate, INTERVAL 1 hour);
END WHILE; END//
DELIMITER ;

CALL FillDateTable('2020-01-01', '2050-01-01');


-- ************************Boards************************
INSERT INTO Boards  (Board_ID, Board_Description)
VALUES  ("0xa8610a34362d800f", "WTAMU Campus" );

-- INSERT INTO Boards  (Board_ID, Location)
-- VALUES  ("0x___", "1250 gallon fresh water RWH tank on north side of property." );

-- INSERT INTO Boards  (Board_ID, Location)
-- VALUES  ("0x___", "1250 gallon fresh water RWH tank on west side of property." );

-- INSERT INTO Boards  (Board_ID, Location)
-- VALUES  ("0x___", "3750 gallon fresh water RWH tank on east side of property." );

-- INSERT INTO Boards  (Board_ID, Location)
-- VALUES  ("0x___", "3750 gallon grey water RWH tank on south side of property." );

-- INSERT INTO Boards  (Board_ID, Location)
-- VALUES  ("0x___, "Garden" );


-- ************************Sensors************************
-- Temperature Probe
INSERT INTO Sensors  (Sensor_ID, Sensor_Description, Units)
VALUES  (0x01, "DS18B2_Temperature_Probe", "Celsius" );


-- MKR_Environmental_Shield
INSERT INTO Sensors  (Sensor_ID, Sensor_Description, Units)
VALUES  (0x02, "MKR_Environmental_Shield_Temperature", "Celsius" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Description, Units)
VALUES  (0x03, "MKR_Environmental_Shield_Humidity", "Percent" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Description, Units)
VALUES  (0x04, "MKR_Environmental_Shield_Barometric_Pressure", "Kilopascals" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Description, Units)
VALUES  (0x05, "MKR_Environmental_Shield_Illuminance", "lux" );


-- SparkFun_Weather_Meter_Kit
INSERT INTO Sensors  (Sensor_ID, Sensor_Description, Units)
VALUES  (0x06, "SparkFun_Weather_Meter_Wind_Speed", "Kilometers per Hour" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Description, Units)
VALUES  (0x07, "SparkFun_Weather_Meter_Wind_Direction", "Degrees" );


-- DFRobot Gravity rainfall
INSERT INTO Sensors  (Sensor_ID, Sensor_Description, Units)
VALUES  (0x08, "DFR_Weather_Meter_Rainfall", "mm" );


-- DFRobot Gravity Analog Electrical Conductivity Meter
INSERT INTO Sensors  (Sensor_ID, Sensor_Description, Units)
VALUES  (0x09, "DFR_Conductivity_Meter", "ms/cm" );


-- Ultrasonic Distance Sensor
INSERT INTO Sensors  (Sensor_ID, Sensor_Description, Units)
VALUES  (0x0A, "DFR_Ultrasonic_Distance", "CM" );


-- PH
INSERT INTO Sensors  (Sensor_ID, Sensor_Description, Units)
VALUES  (0x0B, "PH", "ph" );


-- Tensiometer
INSERT INTO Sensors  (Sensor_ID, Sensor_Description, Units)
VALUES  (0x0C, "Soil_Moisture_Sensor", "kPa");



-- ************************Errors************************
INSERT INTO Sensor_Errors  (Error_ID, Error_Description)
VALUES  (0x00, "No Error");

INSERT INTO Sensor_Errors  (Error_ID, Error_Description)
VALUES  (0x01, "Error Reading Sensor");



-- ************************Readings************************
INSERT INTO Readings  (Board_ID, Sensor_ID, Sensor_Value)
VALUES  ('0xa8610a34362d800f', 0x01, 33.6);


SELECT * FROM Boards;
SELECT * FROM Sensors;
SELECT * FROM Readings;