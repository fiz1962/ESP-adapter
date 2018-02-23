Adapter for use in conjunction with the ESP8266 wifi device and IOT gateway from https://github.com/mozilla-iot.  Original code from the http-on-off-adapter (https://github.com/mozilla-iot/http-on-off-adapter).

This adapter presents a single device with configuration read from the ESP8266 wifi device.

"name" in package.json must match the folder name in gateway/src/addons/{foldername}.  The "version", "description", "id", "type" and "url" in package.json should be edited as desired and the SHA256SUMS updated.  Change "id" to be unique for each device.  "type" must be a valid mozilla-iot type.  Multiple devices can be created by making multiple copies of the code in gateway/src/addons/{multiplefolders}.

The configuration of the device is read on init of the adapter by a json response from the ESP8266 device.  See the iot.ino in the ino folder for an example.
