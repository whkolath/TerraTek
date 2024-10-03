import requests
from time import sleep
from datetime import datetime
import pymysql
import threading
import configparser

thread_lock = threading.Lock()


class Config:
    def __init__(self, config_file):
        self.config_file = config_file
        self.config = configparser.ConfigParser()

    def read_database_config(self):

        self.config.read(self.config_file)
        host = self.config.get('Database', 'host')
        user = self.config.get('Database', 'user')
        password = self.config.get('Database', 'password')
        database = self.config.get('Database', 'database')

        return host, user, password, database


class Database:
    def __init__(self, host, user, password, database_name):
        self.host = host
        self.user = user
        self.password = password
        self.database_name = database_name

    def connect(self):
        return pymysql.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database_name
        )

    def insert_into_readings(self, Board_ID, Sensor_ID, Sensor_Value, Sensor_Timestamp):
        connection = None
        cursor = None
        try:
            connection = self.connect()
            cursor = connection.cursor()
            cursor.execute("INSERT INTO Readings (Board_ID, Sensor_ID, Sensor_Value, Sensor_Timestamp) VALUES (%s, %s, %s, %s)",
                           (Board_ID, Sensor_ID, Sensor_Value, Sensor_Timestamp))
            connection.commit()

        except Exception as e:
            print(str(e))

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()


class Board:
    def __init__(self, hostname, sensors):
        self.hostname = hostname
        self.sensors = sensors
        self.network = Network_Connection(self.hostname)

    def get_readings(self):
        return self.network.get_readings()


class Data_Collector:
    def __init__(self, board, database):
        self.board = board
        self.database = database

    def read_all(self):
        r = self.board.get_readings()
        if r != None:
            timestamp = str(datetime.now())
            for sensor in self.board.sensors:
                self.database.insert_into_readings(
                    self.board.hostname, sensor.sensor_name, sensor.read(r), timestamp)

    def read_sensor(self, sensor_name):
        r = self.board.get_readings()
        if r != None:
            for sensor in self.board.sensors:
                if (sensor.sensor_name == sensor_name):
                    self.database.insert_into_readings(
                        self.board.hostname, sensor.sensor_name, sensor.read(r), str(datetime.now()))


class Data_Collector_Thread(threading.Thread):
    def __init__(self, data_collector, delay=1800):
        threading.Thread.__init__(self)
        self.data_collector = data_collector
        self.delay = delay
        self.daemon = True

    def run(self):
        while True:
            thread_lock.acquire()
            self.data_collector.read_all()
            thread_lock.release()
            sleep(self.delay)


class Network_Connection:
    def __init__(self, hostname):
        self.hostname = hostname

    def get_readings(self):
        try:
            r = requests.get(f"http://{self.hostname}.local", timeout=5)
            r.raise_for_status()
            return r.json()

        except Exception as e:
            print(str(e))
            return None


class Sensor:
    def __init__(self, sensor_name):
        self.sensor_name = sensor_name

    def read(self):
        raise NotImplementedError(
            "This method should be overridden in child classes")


class SHT31_Temperature(Sensor):
    def __init__(self):
        super().__init__("SHT31_Temperature")

    def read(self, r):
        return r["temperature"]


class SHT31_Humidity(Sensor):
    def __init__(self):
        super().__init__("SHT31_Humidity")

    def read(self, r):
        return r["humidity"]


def main():

    config = Config('config.ini')
    host, user, password, database = config.read_database_config()

    TerraTek_db = Database(host, user, password, database)

    testingboard1 = Board(
        "testingboard1", [SHT31_Temperature(), SHT31_Humidity()])

    testingboard1_collector = Data_Collector(testingboard1, TerraTek_db)
    testingboard1_thread = Data_Collector_Thread(testingboard1_collector, 5)

    testingboard1_thread.start()

    try:
        while True:
            sleep(1)

    except KeyboardInterrupt:
        print("Program interrupted and exiting.")


if __name__ == "__main__":
    main()
