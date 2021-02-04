#!/bin/bash
VERSION="0.1.38"
ARCH="arm32v7"
APP="iot-persistence"
docker buildx build -f ./Dockerfile-$APP-$ARCH -t $APP:$VERSION . --load
docker tag $APP:$VERSION mtripsky/$APP:$VERSION
docker push mtripsky/$APP:$VERSION