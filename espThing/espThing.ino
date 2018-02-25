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
  server.on("/thing", []() {
    if(!server.authenticate(thingUser, thingPwd))
      return server.requestAuthentication();
      
    String configThing = "{\
   \"name\": \"ESP8266\",\
   \"type\": \"thing\",\
   \"id\": \"ESP8266-01\",\
   \"description\": \"myESP8266\",\   
   \"properties\": {\
     \"Clock\": {\
       \"type\":  \"number\",\
       \"unit\":  \"Ticks\",\
       \"description\":  \"The millisec clock count\",\
       \"value\":  \"0\"\
    },\
     \"led\": {\
       \"type\":  \"boolean\",\
       \"description\":  \"The onboard LED\",\
       \"value\":  \"false\"\
    }\
  }\
}";
    server.send(200, "text/json", configThing);
  });
 
  // respond to setting LED on/off
  // attempts to set clock simply return current clock value
  server.on("/thing/set", []() {      //Define the handling function for the config response
    Serial.println("set thing");
    if(!server.authenticate(thingUser, thingPwd))
      return server.requestAuthentication();
   
    char respondThing[1024];
    sprintf(respondThing, "{}");

    if(server.arg("led")!= "") {
      if(server.arg("led")=="true" ) {
          digitalWrite(LED_BUILTIN, HIGH);
      } else {
          digitalWrite(LED_BUILTIN, LOW);
      }
      unsigned long currentMillis = millis();
      sprintf(respondThing, "{\"Clock\": %d}", currentMillis);
    }

    if(server.arg("Clock")!= "") {
      unsigned long currentMillis = millis();
      sprintf(respondThing, "{\"Clock\": %d}", currentMillis);
    }
    Serial.printf("Sending %s\n", respondThing);
    server.send(200, "text/json", respondThing); 
  });
 
  server.begin();                                       //Start the server
  Serial.println("Server listening");
 
}
 
void loop() {
 
  server.handleClient();         //Handling of incoming requests
 
}
