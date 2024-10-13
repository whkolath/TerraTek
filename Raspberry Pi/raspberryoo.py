import requests
from time import sleep
from datetime import datetime
import pymysql
import threading
import configparser

thread_lock = threading.Lock()


class Config:
    def __init__(self, config_file):
        self.__config_file = config_file
        self.__config = configparser.ConfigParser()

    def read_database_config(self):
        self.__config.read(self.__config_file)
        host = self.__config.get('Database', 'host')
        user = self.__config.get('Database', 'user')
        password = self.__config.get('Database', 'password')
        database = self.__config.get('Database', 'database')
        return host, user, password, database


class Database:
    def __init__(self, host, user, password, database_name):
        self.__host = host
        self.__user = user
        self.__password = password
        self.__database_name = database_name
        self.__connection = None
        self.__cursor = None

    def is_connected(self):
        if self.__connection == None:
            return False
        else:
            return True

    def connect(self):
        if self.is_connected() == False:
            try:
                self.__connection = pymysql.connect(
                    host=self.__host,
                    user=self.__user,
                    password=self.__password,
                    database=self.__database_name
                )
                self.__cursor = self.__connection.cursor()
                return True
            except Exception as e:
                print(str(e))
                return False

    def close_connection(self):
        if self.is_connected() == True:
            self.__cursor.close()
            self.__connection.close()
            self.__cursor = None
            self.__connection = None

    def insert_into_readings(self, Board_ID, Sensor_ID, Sensor_Value, Sensor_Timestamp):
        if self.is_connected() == True:
            try:
                self.__cursor.execute("INSERT INTO Readings (Board_ID, Sensor_ID, Sensor_Value, Sensor_Timestamp) VALUES (%s, %s, %s, %s)",
                                      (Board_ID, Sensor_ID, Sensor_Value, Sensor_Timestamp))
                self.__connection.commit()

            except Exception as e:
                print(str(e))


class Board:
    def __init__(self, hostname, sensors):
        self.__hostname = hostname
        self.__sensors = sensors
        self.__network = Network_Connection(self.__hostname)

    def get_hostname(self):
        return self.__hostname

    def get_sensors(self):
        return self.__sensors

    def get_readings(self):
        return self.__network.get_readings()


class Data_Collector:
    def __init__(self, boards, database):
        self.__boards = boards
        self.__database = database

    def read_all(self):
        self.__database.connect()
        for board in self.__boards:
            r = board.get_readings()
            if r != None:
                timestamp = str(datetime.now())
                for sensor in board.get_sensors():
                    self.__database.insert_into_readings(
                        board.get_hostname(), sensor.get_sensor_name(), sensor.read(r), timestamp)
        self.__database.close_connection()

    def read_sensor(self, sensor_name):
        self.__database.connect()
        for board in self.__boards:
            r = board.get_readings()
            if r != None:
                for sensor in board.get_sensors():
                    if (sensor.get_sensor_name() == sensor_name):
                        self.__database.insert_into_readings(
                            board.get_hostname(), sensor.get_sensor_name(), sensor.read(r), str(datetime.now()))
        self.__database.close_connection()


class Data_Collector_Thread(threading.Thread):
    def __init__(self, data_collector, delay=1800):
        threading.Thread.__init__(self)
        self.__data_collector = data_collector
        self.__delay = delay
        self.daemon = True

    def run(self):
        while True:
            thread_lock.acquire()
            self.__data_collector.read_all()
            thread_lock.release()
            sleep(self.__delay)


class Network_Connection:
    def __init__(self, hostname):
        self.__hostname = hostname

    def get_readings(self):
        try:
            r = requests.get(f"http://{self.__hostname}.local", timeout=5)
            r.raise_for_status()
            return r.json()

        except Exception as e:
            print(str(e))
            return None


class Sensor:
    def __init__(self, sensor_name):
        self.__sensor_name = sensor_name

    def get_sensor_name(self):
        return self.__sensor_name

    def read(self):
        raise NotImplementedError(
            "This method should be overridden in child classes")


class SHT31_Temperature(Sensor):
    def __init__(self):
        super().__init__("SHT31_Temperature")

    def read(self, r):
        print(r["temperature"])
        return r["temperature"]


class SHT31_Humidity(Sensor):
    def __init__(self):
        super().__init__("SHT31_Humidity")

    def read(self, r):
        print(r["humidity"])
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
