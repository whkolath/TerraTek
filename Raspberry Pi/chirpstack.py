from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

from chirpstack_api import integration
from google.protobuf.json_format import Parse
from time import sleep
from datetime import datetime
import pymysql
import threading
import configparser


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


class Database_Manager:
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



class Data_Collector(BaseHTTPRequestHandler):
    def __init__(self, *args, database=None, **kwargs):
        self.__database = database
        self.json = False
        super().__init__(*args, **kwargs)

    def do_POST(self):
        self.send_response(200)
        self.end_headers()
        query_args = parse_qs(urlparse(self.path).query)

        content_len = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_len)

        if query_args["event"][0] == "up":
            self.up(body)

        elif query_args["event"][0] == "join":
            self.join(body)

        else:
            print("handler for event %s is not implemented" % query_args["event"][0])

    def up(self, body):
        up = self.unmarshal(body, integration.UplinkEvent())
        print("Uplink received from: %s with payload: %s" % (up.device_info.dev_eui, up.data.hex()))
        self.__database.connect()
        self.__database.insert_into_readings(up.device_info.dev_eui, "SHT31_Temperature", int(up.data.hex(), 16), str(datetime.now()))
        self.__database.close_connection()

    def join(self, body):
        join = self.unmarshal(body, integration.JoinEvent())
        print("Device: %s joined with DevAddr: %s" % (join.device_info.dev_eui, join.dev_addr))

    def unmarshal(self, body, pl):
        if self.json:
            return Parse(body, pl)
        
        pl.ParseFromString(body)
        return pl
    

def handler_factory(database):
    def handler(*args, **kwargs):
        return Data_Collector(*args, database=database, **kwargs)
    return handler


def main():

    config = Config('config.ini')
    host, user, password, database = config.read_database_config()

    TerraTek_db = Database_Manager(host, user, password, database)
    httpd = HTTPServer(('', 8090), handler_factory(TerraTek_db))
    httpd.serve_forever()

if __name__ == "__main__":
    main()