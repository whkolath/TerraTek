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
VALUES  ("rwh1", "RWH Tank on East Side of House" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("SHT31_Temperature", "Atmospheric Temperature", "Celsius" );

INSERT INTO Sensors  (Sensor_ID, Sensor_Type, Units)
VALUES  ("SHT31_Humidity", "Humidity", "Percent" );

INSERT INTO Readings  (Board_ID, Sensor_ID, Sensor_Value)
VALUES  ("testingboard1", "SHT31_Temperature", 23.562);

INSERT INTO Readings  (Board_ID, Sensor_ID, Sensor_Value)
VALUES  ("rwh1", "SHT31_Humidity", 56.5);

SELECT * FROM Boards;
SELECT * FROM Sensors;
SELECT * FROM Readings;
