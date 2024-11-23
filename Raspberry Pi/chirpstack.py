from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

from chirpstack_api import integration
from google.protobuf.json_format import Parse
from datetime import datetime
import pymysql
import configparser

import struct


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
                self.__cursor.execute("INSERT INTO Readings (Board_ID, Sensor_ID, Sensor_Value, Sensor_Timestamp) VALUES ('0x%s', 0x%s, %s, '%s')" %
                                      (Board_ID, Sensor_ID, Sensor_Value, Sensor_Timestamp))
                self.__connection.commit()

            except Exception as e:
                print(str(e))


class Data_Collector(BaseHTTPRequestHandler):
    json = False
    global TerraTek_db

    def do_POST(self):
        self.send_response(200)
        self.end_headers()
        query_args = parse_qs(urlparse(self.path).query)

        content_len = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_len)

        if query_args["event"][0] == "up":
            self.up(body)

    def up(self, body):
        up = integration.UplinkEvent()
        up.ParseFromString(body)

        data = up.data.hex(' ').split()
        SID = data[0]
        error = data[1]
        reading = struct.unpack('>d', int("".join(data[2:10]), 16).to_bytes(8, 'little'))[0]

        print("Uplink received from: %s with SID: %s, error: %s, reading: %s" %
              (up.device_info.dev_eui, SID, error, reading))

        TerraTek_db.connect()
        TerraTek_db.insert_into_readings(up.device_info.dev_eui, SID, reading, str(datetime.now()))
        TerraTek_db.close_connection()


def main():
    config = Config('config.ini')
    host, user, password, database = config.read_database_config()
    
    global TerraTek_db
    TerraTek_db = Database_Manager(host, user, password, database)

    httpd = HTTPServer(('', 8090), Data_Collector)
    httpd.serve_forever()


if __name__ == "__main__":
    main()
