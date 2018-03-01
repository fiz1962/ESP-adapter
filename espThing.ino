#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
 
ESP8266WebServer server(80);

char* ssid    = "ssid";
char* wifiPwd = "passCode";

String jwt = "Insert JWT string here";
char* thingUser = "myUser";
char* thingPwd  = "myPwd";

void setup() {
 
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  
  Serial.begin(115200);
  WiFi.begin(ssid, wifiPwd);  //Connect to the WiFi network
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for connection
    delay(500);
    Serial.println("Waiting to connect…");
  }
 
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());  //Print the local IP
 
 //Define the handling function for the config response
  server.on("/things/esp", []() {
    if(!server.authenticate(thingUser, thingPwd))
      return server.requestAuthentication();
   Serial.println("Getting thing");   
    String configThing = "[\
 {\
   \"name\": \"ESP8266\",\
   \"type\": \"thing\",\
   \"description\": \"myESP8266\",\   
   \"properties\": {\
     \"clock\": {\
       \"type\":  \"number\",\
       \"unit\":  \"Ticks\",\
       \"description\":  \"The millisec clock count\",\
       \"href\":\"/properties/clock\"\
    },\
     \"led\": {\
       \"type\":  \"boolean\",\
       \"description\":  \"The onboard LED\",\
       \"href\":\"/properties/led\"\
    }\
  }\
 }\
]";
    server.send(200, "text/json", configThing);
  });
 
  // respond to led property
  server.on("/things/esp/properties/led", []() {
    Serial.println("led thing property");
    if(!server.authenticate(thingUser, thingPwd))
      return server.requestAuthentication();
   
   char respondThing[1024];
   int nIndex = -1;
   
   for (int i = 0; i < server.args(); i++)
     if( server.argName(i) =="led" )
       nIndex = i;

    if( nIndex > -1 ) {
      if( server.arg("led")=="true" )
        digitalWrite(LED_BUILTIN, HIGH);
      else
        digitalWrite(LED_BUILTIN, LOW);
    }

    if( digitalRead(LED_BUILTIN)==HIGH )
      sprintf(respondThing, "{\"led\":true}");
    else
      sprintf(respondThing, "{\"led\":false}");
      
    server.send(200, "text/json", respondThing); 
  });
 
  // respond to clock property
  server.on("/things/esp/properties/clock", []() {
    Serial.println("led thing property");
    if(!server.authenticate(thingUser, thingPwd))
      return server.requestAuthentication();
   
    char respondThing[1024];
    // clock can only be read, not set       
    sprintf(respondThing, "{\"clock\":\"%d\"}", millis());
    server.send(200, "text/json", respondThing); 
  });
 
  server.begin();                                       //Start the server
  Serial.println("Server listening");
 
}
 
void loop() {
 
  server.handleClient();         //Handling of incoming requests
 
}
