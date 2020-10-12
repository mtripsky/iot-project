#!/bin/bash
VERSION="0.1.1"
ARCH="arm32v7"
APP="iot-sensors-raspberry"
docker buildx build -f ./Dockerfile-$APP-$ARCH -t $APP:$VERSION . --load
docker tag $APP:$VERSION mtripsky/$APP:$VERSION
docker push mtripsky/$APP:$VERSION