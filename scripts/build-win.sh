#!/bin/bash

# Lets make sure that there is a "build" folder
npm install
npm run build

# Lets copy that build folder to the elctron folder so that electron can use it to build
cp -a ./build ./desktop/

# Lets build the electron Production build
cd ./desktop
npm install

# Since we are doing a multi-platform build from mac, we will create Window/Linux assets using docker-wine
docker-compose up

echo "Done .."