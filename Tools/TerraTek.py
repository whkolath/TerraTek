import os
import requests
from datetime import datetime


class Tools:
    def __init__(self):
        pass


    def get_temperature_data(self) -> str:
        """
        Get the current the current temperature reading.
        :return: Current temperature reading.
        """

        base_url = "http://terratekrwh.com/api/latest/"

        try:
            response = requests.get(base_url + "3")
            response.raise_for_status()
            data = response.json()

           
            return f"""The Temperature is {data[0]['Sensor_Value']} degrees C. This information is current as of {data[0]['Sensor_Timestamp']}"""
        except requests.RequestException as e:
            return f"Error fetching sensor data: {str(e)}"

tool = Tools()

print(tool.get_temperature_data())