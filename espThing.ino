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
      
    String configThing = "{\
   \"name\": \"ESP8266\",\
   \"type\": \"thing\",\
   \"id\": \"ESP8266-01\",\
   \"description\": \"myESP8266\",\   
   \"properties\": {\
     \"clock\": {\
       \"type\":  \"number\",\
       \"unit\":  \"Ticks\",\
       \"description\":  \"The millisec clock count\",\
       \"href\":\"/properties/clock\",\
    },\
     \"led\": {\
       \"type\":  \"boolean\",\
       \"description\":  \"The onboard LED\",\
       \"href\":\"/properties/led\",\
    }\
  }\
}";
    server.send(200, "text/json", configThing);
  });
 
  // respond to reading current led property
  server.on("/things/esp/properties/led", HTTP_GET, []() {
    Serial.println("led thing property");
    if(!server.authenticate(thingUser, thingPwd))
      return server.requestAuthentication();
   
   char respondThing[1024];
   sprintf(respondThing, "{\"led\":\"%s\"}", digitalRead(LED_BUILTIN));

    server.send(200, "text/json", respondThing); 
  });
 
  // respond to setting led property
  server.on("/things/esp/properties/led", HTTP_PUT, []() {
    Serial.println("led thing property");
    if(!server.authenticate(thingUser, thingPwd))
      return server.requestAuthentication();
   
    char* respondThing = "";

      
    server.send(200, "text/json", respondThing); 
  });

  server.begin();                                       //Start the server
  Serial.println("Server listening");
 
}
 
void loop() {
 
  server.handleClient();         //Handling of incoming requests
 
}
