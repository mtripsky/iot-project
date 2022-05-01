import paho.mqtt.client as mqtt
import json
import os
import sys
from bluepy import btle
import struct

environment = os.getenv('ENVIRONMENT','DEBUG')

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print(f'Connected with result code {rc}')

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    #client.subscribe('/raspberrypi-pins/set')

def on_disconnect(client, userdata, rc):
    print(f'Disconnecting with result code {rc}')

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
        
class SwitchbotScanDelegate(btle.DefaultDelegate):
    def __init__(self, macaddr):
        btle.DefaultDelegate.__init__(self)
        self.sensorValue = None
        self.macaddr = macaddr

    def handleDiscovery(self, dev, isNewDev, isNewData):
        if dev.addr == self.macaddr:
            for (adtype, desc, value) in dev.getScanData():  
                if desc == '16b Service Data':
                    self._decodeSensorData(value)

    def _decodeSensorData(self, valueStr):
        valueBinary = bytes.fromhex(valueStr[4:])
        batt = valueBinary[2] & 0b01111111
        isTemperatureAboveFreezing = valueBinary[4] & 0b10000000
        temp = ( valueBinary[3] & 0b00001111 ) / 10 + ( valueBinary[4] & 0b01111111 )
        if not isTemperatureAboveFreezing:
            temp = -temp
        humid = valueBinary[5] & 0b01111111
        self.sensorValue = {
            'SensorType': 'SwitchBot',
            'Temperature': temp,
            'Humidity': humid,
            'BatteryVoltage': batt
        }

def main():
    try:
        print(f'App started in {environment} mode')
        client = mqtt.Client()
        client.on_connect = on_connect
        client.on_message = on_message
        client.on_disconnect = on_disconnect
        client.connect("localhost", 1883, 60)
        
        scanner = btle.Scanner().withDelegate(SwitchbotScanDelegate('EF:FD:60:5C:7E:49'))
        scanner.scan(5.0)
        print(scanner.delegate.sensorValue)

        client.loop_forever()

    except (KeyboardInterrupt, SystemExit):
        print('Got SIGINT, gracefully shutting down')
        sys.exit()

if __name__ == "__main__":
    main()