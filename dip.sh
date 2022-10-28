#!/bin/sh
ROOT_PATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ALLOW_FLAGS="--allow-env --allow-net --allow-read --allow-write"
IMPORT_FLAGS="--import-map=${ROOT_PATH}/imports.json"
deno run ${ALLOW_FLAGS} ${IMPORT_FLAGS} ${ROOT_PATH}/src/main.ts $*
