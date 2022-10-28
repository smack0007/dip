#!/bin/sh
ROOT_PATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ALLOW_FLAGS="--allow-net"
deno test ${ALLOW_FLAGS}
