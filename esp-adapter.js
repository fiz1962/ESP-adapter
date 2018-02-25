/**
 * esp-adapter.js - Web server adapter implemented as a plugin.
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

class ESPProperty extends Property {
  constructor(device, name, propertyDescription) {
    super(device, name, propertyDescription);
    this.unit = propertyDescription.unit;
    this.description = propertyDescription.description;
    this.device = device;

    this.setCachedValue(propertyDescription.value);
    this.device.notifyPropertyChanged(this);
    let url = this.device.url;

    // get all values
    fetch(url+"/set")
    .then(function(response) {
       urlThing = response.url;
       if (!response.ok) {
         throw Error(response.statusText);
       }
       return response;
     })
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
        console.error('config:', url, 'failed');
        console.error(e);
        reject(e);
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
console.log('set->'+url);
      fetch(url)
      .then(function(response) {
         if (!response.ok) {
           throw Error(response.statusText);
         }
         return response;
       })
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
        console.error('set: Request to:', url, 'failed');
        console.error(e);
        reject(e);
      });
    });
  }
}

class ESPDevice extends Device {
  constructor(adapter, id, name, type, description, url, properties) {
    super(adapter, id);

    this.url = url;
    this.name = name;
    this.type = type;
    this.description = description;

    console.log("Adding device at "+url);
    // properties are set by a json response from the actual device
    let keys = Object.keys(properties);
    let values = Object.values(properties); 
    for (var i=0; i<keys.length; i++) {
      this.properties.set(keys[i], new ESPProperty(this, keys[i], values[i]));
    }
  }
}

class ESPAdapter extends Adapter {
  constructor(addonManager, packageName, manifest) {
    super(addonManager, 'ESPAdapter', packageName);
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
    var urlThing;
    var thingUser = this.manifest.moziot.config.thingUser;
    var thingPwd = this.manifest.moziot.config.thingPwd;

    console.log("Pairing "+ipStartSplit[3]+" to "+ipEndSplit[3]);
    for(var i=ipStartSplit[3]; i<=ipEndSplit[3]; i++) {
      if( thingUser ) {
        url = "http://"+thingUser+":"+thingPwd+"@"+ipStartSplit[0]+"."+ipStartSplit[1]+"."+ipStartSplit[2]+"."+i+"/thing";
      }
      else {
        url = "http://"+ipStartSplit[0]+"."+ipStartSplit[1]+"."+ipStartSplit[2]+"."+i+"/thing";
      }

      console.log("Trying "+url);
      fetch(url)
      .then(function(response) {
         urlThing = response.url;
         if (!response.ok) {
           throw Error(response.statusText);
         }
         return response;
       })
      .then((resp) => resp.json())
      .then((resp) => {
        let name = resp['name'];
        let id = resp['id'];
        let description = resp['description'];
        let type = resp['type'];
        let devurl = resp
        this.handleDeviceAdded(new ESPDevice(this, id, name, type, description, urlThing, resp['properties']));
      }).catch(e => {
        console.error('pair:', url, 'failed');
        console.error(e);
        reject(e);
      });

    }
  }
}

function loadESPAdapter(addonManager, manifest, _errorCallback) {
  let adapter = new ESPAdapter(addonManager, manifest.name, manifest);
}

module.exports = loadESPAdapter;
