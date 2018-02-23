/**
 * esp8266-adapter.js - OnOff adapter implemented as a plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Adapter = require('../adapter');
const Device = require('../device');
const Property = require('../property');
const fetch = require('node-fetch');

class ESP8266Property extends Property {
  constructor(device, name, propertyDescription) {
    super(device, name, propertyDescription);
    this.unit = propertyDescription.unit;
    this.description = propertyDescription.description;
    this.device = device;

    this.setCachedValue(propertyDescription.value);
    this.device.notifyPropertyChanged(this);
    let url = this.device.url;

    // get all values
    fetch(url+"/get")
    .then((resp) => resp.json())
    .then((resp) => {
        let keys = Object.keys(resp);
        let values = Object.values(resp); 
        for (var i=0; i<keys.length; i++) {
          let obj = this.device.findProperty(keys[i]);
          obj.setCachedValue(values[i]);
          this.device.notifyPropertyChanged(obj);
        }
    });
  }

  /**
   * @method setValue
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   */
  setValue(value) {
      
    return new Promise((resolve, reject) => {
      let url=this.device.url;

      // set value but allow override in response.
      this.setCachedValue(value);
      resolve(value);
      this.device.notifyPropertyChanged(this);

      url = this.device.url + "/set?" + this.name + "=" + value;
      fetch(url)
      .then((resp) => resp.json())
      .then((resp) => {
        let keys = Object.keys(resp);
        let values = Object.values(resp); 
        for (var i=0; i<keys.length; i++) {
          let obj = this.device.findProperty(keys[i]);
          obj.setCachedValue(values[i]);
          this.device.notifyPropertyChanged(obj);
        }
      }).catch(e => {
        console.error('Request to:', url, 'failed');
        console.error(e);
        reject(e);
      });
    });
  }
}

class ESP8266Device extends Device {
  constructor(adapter, id, name, type, description, url, properties) {
    super(adapter, id);

    this.url = url;
    this.name = name;
    this.type = type;
    this.description = description;

    // properties are set by a json response from the actual device
    let keys = Object.keys(properties);
    let values = Object.values(properties); 
    for (var i=0; i<keys.length; i++) {
      this.properties.set(keys[i], new ESP8266Property(this, keys[i], values[i]));
    }
  }
}

class ESP8266Adapter extends Adapter {
  constructor(addonManager, packageName, manifest) {
    super(addonManager, 'ESP8266fAdapter', packageName);
    addonManager.addAdapter(this);
    this.manifest = manifest;
  }

  startPairing(timeoutSeconds) {
    console.log(this.name, 'id', this.id, 'pairing started');

    var ipStart = this.manifest.moziot.config.ipStart;
    var ipStartSplit = ipStart.split(".");
    var ipEnd = this.manifest.moziot.config.ipEnd;
    var ipEndSplit = ipEnd.split(".");

    var url="";

    console.log("Pairing "+ipStartSplit[3]+" to "+ipEndSplit[3]);
    for(var i=ipStartSplit[3]; i<=ipEndSplit[3]; i++) {
      url = "http://"+ipStartSplit[0]+"."+ipStartSplit[1]+"."+ipStartSplit[2]+"."+i+"/thing";
      fetch(url)
      .then((resp) => resp.json())
      .then((resp) => {
        let name = resp['name'];
        let id = resp['id'];
        let description = resp['description'];
        let type = resp['type'];

        this.handleDeviceAdded(new ESP8266Device(this, id, name, type, description, url, resp['properties']));
      }).catch(function() {
          console.log("error: No device at "+url);
      });

    }
  }
}

function loadESP8266Adapter(addonManager, manifest, _errorCallback) {
  let adapter = new ESP8266Adapter(addonManager, manifest.name, manifest);
}

module.exports = loadESP8266Adapter;
