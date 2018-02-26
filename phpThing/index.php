<?php
  header('Content-Type: application/json');
  header('Authorization:Bearer: {insert jwt string}');
  header('Accept: application/json');

print '{' .
'  "name": "EspThingPHP",' .
'  "description": "my PHP ESP Thing",' .
'  "type": "thing",' .
'  "properties": {' .
'    "temperature": {' .
'      "type": "number",' .
'      "unit": "celsius",' .
'      "description": "An ambient temperature sensor",' .
'      "href": "/properties/temperature.php",' .
'    },' .
'    "humidity": {' .
'      "type": "number",' .
'      "unit": "percent",' .
'      "href": "/properties/humidity.php",' .
'    },' .
'    "led": {' .
'      "type": "boolean",' .
'      "description": "A red LED",' .
'      "href": "/properties/led.php",' .
'    }' .
'  }' .
'}';

?>
