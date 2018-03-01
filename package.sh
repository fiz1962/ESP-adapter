#!/bin/bash

rm -f SHA256SUMS
sha256sum -- package.json *.js LICENSE espThing.ino phpThing.tgz > SHA256SUMS
npm pack

