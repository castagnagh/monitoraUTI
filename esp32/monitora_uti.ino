#include <WiFi.h>
#include <HTTPClient.h>

// ====== CONFIGURAÇÃO ======
const char* WIFI_SSID = "SEU_WIFI";
const char* WIFI_PASSWORD = "SUA_SENHA";

// Use o IP da máquina que está rodando a API.
// Exemplo local: http://192.168.0.10:5000
const char* API_URL = "http://SEU_IP:5000/api/alerts";

// Cada ESP32 deve representar uma cama específica.
const int BED_ID = 1;

// Pino analógico do sensor capacitivo/analógico.
const int SENSOR_PIN = 34;

// Calibração: ajuste conforme o seu sensor.
// Leitura seca e leitura molhada.
const int DRY_VALUE = 3200;
const int WET_VALUE = 1400;

// Limite mínimo de diferença entre leituras para evitar spam.
const int MIN_CHANGE_TO_SEND = 3;

int lastHumiditySent = -1;
unsigned long lastSendMillis = 0;
const unsigned long SEND_INTERVAL_MS = 5000;

int toHumidityPercent(int rawValue) {
  rawValue = constrain(rawValue, WET_VALUE, DRY_VALUE);
  int percent = map(rawValue, DRY_VALUE, WET_VALUE, 0, 100);
  return constrain(percent, 0, 100);
}

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
  }
  Serial.println();
  Serial.println("Wi-Fi conectado");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void sendHumidity(int humidityValue) {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");

  String body = "{";
  body += "\"bedId\":" + String(BED_ID) + ",";
  body += "\"humidityValue\":" + String(humidityValue);
  body += "}";

  int httpCode = http.POST(body);
  Serial.print("HTTP Code: ");
  Serial.println(httpCode);

  if (httpCode > 0) {
    String response = http.getString();
    Serial.println(response);
  }

  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(SENSOR_PIN, INPUT);
  connectWiFi();
}

void loop() {
  int rawValue = analogRead(SENSOR_PIN);
  int humidityPercent = toHumidityPercent(rawValue);

  Serial.print("RAW: ");
  Serial.print(rawValue);
  Serial.print(" | Umidade: ");
  Serial.print(humidityPercent);
  Serial.println("%");

  bool shouldSend = lastHumiditySent < 0 || abs(humidityPercent - lastHumiditySent) >= MIN_CHANGE_TO_SEND;
  bool intervalElapsed = millis() - lastSendMillis >= SEND_INTERVAL_MS;

  if (shouldSend && intervalElapsed) {
    sendHumidity(humidityPercent);
    lastHumiditySent = humidityPercent;
    lastSendMillis = millis();
  }

  delay(1000);
}
