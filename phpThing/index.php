<?php
  header('Content-Type: application/json');
  header('Authorization:Bearer: {insert jwt string}');
  header('Accept: application/json');

print '{' .
'  "name": "EspThingPHP",' .
'  "id": "EspThing-03",' .
'  "description": "my PHP ESP Thing",' .
'  "type": "thing",' .
'  "properties": {' .
'    "temperature": {' .
'      "type": "number",' .
'      "unit": "celsius",' .
'      "description": "An ambient temperature sensor",' .
'      "href": "http://localhost/thing1/thing/temperature.php",' .
'      "value": "99.8"' .
'    },' .
'    "humidity": {' .
'      "type": "number",' .
'      "unit": "percent",' .
'      "href": "http://localhost/thing1/thing/humidity.php",' .
'      "value": "50.9"' .
'    },' .
'    "led": {' .
'      "type": "boolean",' .
'      "description": "A red LED",' .
'      "href": "http://localhost/thing1/thing/led.php",' .
'      "value": "true"' .
'    }' .
'  }' .
'}';

?>
