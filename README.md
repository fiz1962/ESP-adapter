Adapter for use with devices such as the ESP8266, Arduino, laptops, etc  and the Mozilla-IOT gateway from https://github.com/mozilla-iot.  Based on code from the http-on-off-adapter (https://github.com/mozilla-iot/http-on-off-adapter).

Example Arduino/esp8266 sketch and example php code is at https://github.com/fiz1962/ESP-adapter.

The WoT API can be found at https://iot.mozilla.org/wot/.

When the adapter pairing is performed ("+" button on main page), this adapter scans a range of IP addresses defined in package.json for ESP8266/nodeMCU/Arduino/laptops/desktops/etc that respond with json data defining an IOT device.  An ESP8266/Arduino example sketch and PHP code is included.

  To use:
  Put files in the "{homedir}/mozilla-iot/addons/ESP-Adapter" folder.  If the gateway overwrites the files, create a folder inside the ESP-Adapter folder called ".git".  This will prevent overwriting the files and also disable the CHECKSUMs during testing.
  Edit the range of IP addresses in package.json.
  Edit the user/password for logging in to the devices.
  Power up all the ESP devices.
  Start the gateway.
  Login to the gateway (ex https://localhost:4443).

  First time ---
    Enable the adapter by clicking the "3 bars" in the top/left corner of the web browser.
    Click "Settings", then "Addons".
    You should see "esp-adapter" listed, click "Enable" if not already enabled.
    Return to the main page.
  
  Click the "+" in the bottom right of the web browser to start pairing.
  Save any devices.

  Devices are not currently saved and automatically restored when the gateway is stopped/started.  The devices need to be paired each time.  This is expected to change in the future.

