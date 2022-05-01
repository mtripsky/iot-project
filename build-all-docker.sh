#!/bin/bash
(cd iot-sensors-raspberry; ./build-docker-iot-sensors-raspberry.sh)
(cd iot-persistence; ./build-docker-iot-persistence.sh)
(cd iot-raspberrypi-pins; ./build-docker-iot-raspberrypi-pins)
