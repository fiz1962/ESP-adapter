Adapter for use with devices such as the ESP8266, Arduino, laptops, etc  and the Mozilla-IOT gateway from https://github.com/mozilla-iot.  Based on code from the http-on-off-adapter (https://github.com/mozilla-iot/http-on-off-adapter).

When the adapter pairing is performed ("+" button on main page), this adapter scans a range of IP addresses defined in package.json for ESP8266/nodeMCU/Arduino/laptops/desktops/etc that respond with json data defining an IOT device.  An ESP8266/Arduino example sketch and PHP code is included.  The name, id and description returned in the json data should be unique for each device.

To use:
Put files in the "gateway/src/addons/espThing" folder.  
Edit the range of IP addresses in package.json.  
Power up all the ESP devices.
Start the gateway.
Login to the gateway (ex https://localhost:4443).
Enable the adapter by clicking the "3 bars" in the top/left corner of the web browser.
Click "Settings", then "Addons".
You should see "espThing" listed, click "Enable" if not already.
Click the arrow in the web browser.
Click the "Things" on the web browser".
Click the 3 bars and then "Things".
Click the "+" in the bottom right of the web browser to start pairing.
Save any devices.

