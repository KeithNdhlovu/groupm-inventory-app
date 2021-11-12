#!/bin/bash

# Dissable code signing
export CSC_IDENTITY_AUTO_DISCOVERY=false

# Lets make sure that there is a "build" folder
npm install
npm run build

# Lets copy that build folder to the elctron folder so that electron can use it to build
cp -a ./build ./desktop/

# Lets build the electron Production build
if [ -z "$1" ]
  then
    echo "No argument supplied, building production"
    cd ./desktop

    # We attach the electron-builder log, so we can see extensive logging during building, 
    # incase anything unexpected happens
    npm install
    DEBUG=electron-builder npm run publish:mac
fi

# # Once all that is done, we can cleanup
# rm -fr build
# rm -fr dist
# node -r dotenv/config electron/scripts/publish.js dotenv_config_path=electron/.env
echo "Done .."