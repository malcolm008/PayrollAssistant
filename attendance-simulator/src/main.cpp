#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 5
#define RST_PIN 22
#define GREEN_LED 13
#define RED_LED 26
#define BUZZER 14

const char* ssid =  "Wokwi-GUEST";
const char* password = "";

const char* serverUrl = "https://your-server.com/attendance"; 
const char* deviceId = "wokwi-reader-1";

MFRC522 rfid(SS_PIN, RST_PIN);

void feedback(bool ok) {
    int led = ok ? GREEN_LED : RED_LED;
    digitalWrite(led, HIGH);
    tone(BUZZER, ok ? 1000 : 2000: 3000, ok ? 200 : 1000);
    delay(1000);
    digitalWrite(led, LOW);
}

void connectWiFi() {
    Serial.print("Connecting to Wokwi-GUEST");
    WiFi.begin(ssid, password, 6);
    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
        delay(500);
        Serial.print(".");
    }
    Serial.println(WiFi.status() == WL_CONNECTED ? "\nWiFi connected!" : "\nWiFi FAILED");
}

void setup() {
    Serial.beign(115200);
    pinMode(GREEN_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);
    pinMode(BUZZER, OUTPUT);

    SPI.begin(18, 19, 23, 5);
    rfid.PCD_Init();
    rfid.PCD_DumpVersionToSerial();

    connectWiFi();
    Serial.println("Attendance system ready.");
}

void loop() {
    if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

    String uid = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
        if (rfid.uid.uidByte[i] < 0x10) uid += "0";
        uid += String(rfid.uid.uidByte[i], HEX);
    }

    uid.toUpperCase();
    Serial.println("Card UID: " + uid);

    if ( WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi down, reconnecting...");
        connectWiFi();
    }

    if (WiFi.status() == WL_CONNECTED) {
        WiFiClientSecure client;
        client.setInsecure();
        HTTPClient http;
        http.begin(client, serverUrl);
        http.addHeader("Context-Type", "application/json");
        http.addHeader("ngrok-skip-browser-warning", "true");

        String payload = "{\"card_uid\":\"" + uid + "\",\"device_id\":\"" + deviceId + "\"}";
        int code = http.POST(payload);

        if (code >= 200 && code < 300) {
            Serial.println("Attendace recorded! HTTP " + String(code));
            feedback(true);
        } else {
            Serial.println("Failed HTTP " + String(code) + " -> " + http.getString());
            feedback(false);
        }
        http.end();
    } else {
        feedback(false);
    }

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
    delay(2000);
}