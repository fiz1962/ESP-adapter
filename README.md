Adapter for use in conjunction with the ESP8266 web server.  Original code from the http-on-off-adapter (https://github.com/mozilla-iot/http-on-off-adapter).

This adapter presents a single device with configuration read from a ESP8266 wifi device.

Multiple instances can be created by moving esp8266-adapter to the gateway/src/addons folder and editing the corresponding path in package.json and index.json.  Additional copies can be created by adding folders in gateway/src/addons and copying index.js, package.json SHA256SUMS and LICENSE to the new folder.  The "name" in package.json must match the folder name.  The "version", "description", "id", "type" and "url" should be edited as desired and the SHA256SUMS updated.

The configuration of the device is read on init by a json response to the ESP8266 device.  See the iot.ino in the ino folder for an example.
