import requests
from time import sleep
from datetime import datetime
import pymysql

hostnames = ["testingboard1"]
sensor_sql = "INSERT INTO Readings  (Board_ID, Sensor_ID, Sensor_Value, Sensor_Timestamp) VALUES  (%s, %s, %s, %s)"
 
TerraTek = pymysql.connect(
    host = "**********",
    user = "**********",
    password = "**********",
    database = "**********"
) 
 
cursor = TerraTek.cursor()

try:
    while True:
        for host in hostnames:
            url = f"http://{host}.local"
            try:
                r = requests.get(url)
                r = r.json()
                
            except Exception as e:
                print("Error connecting to Arduino with hostname " + host)
                print("Exeption: " + str(e))
                continue

            temperature = r["temperature"]  
            humidity = r["humidity"]
            current_timestamp = str(datetime.now())

            val = (host, "SHT31_Temperature", temperature, current_timestamp)
            cursor.execute(sensor_sql, val) 

            val = (host, "SHT31_Humidity", humidity, current_timestamp)
            cursor.execute(sensor_sql, val)

            TerraTek.commit()

            print("\n\nTemperature = " + str(temperature))
            print("Humidity = " + str(humidity))

        sleep(5)

finally:
    TerraTek.close()
