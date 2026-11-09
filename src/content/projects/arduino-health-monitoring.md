---
title: Arduino-Based Multi-Sensor Health Monitoring and Fall Detection
short: Health monitor
tagline: Wearable health monitoring and fall detection with GSM/GPS alerting.
summary: Developed an embedded framework integrating biomedical sensors with sensor fusion and microcontroller coordination. Implemented communication and alert pipelines using GSM/GPS and I2C for wearable health monitoring.
start: 2025-06
end: 2025-09
course: CSE360 · Computer Interfacing
scene: wearable
categories: [embedded, health-tech]
technologies: [Arduino, Biomedical sensors, Sensor fusion, GSM/GPS, I2C]
links:
  - label: Project report
    url: https://drive.google.com/file/d/1VyaKxI_CALEiDj4Gb2GYFHJ_mi-Kc8SN/view
    kind: report
media:
  - type: image
    src: ../../assets/projects/arduino-health-monitoring/prototype.jpg
    alt: The wearable prototype strapped to a forearm — sensor boards, a GPS module and wiring on a red base.
    caption: The wearable prototype
credits:
  - Reshad Ul Karim, Sammam Mahdi and Abrar Samin — team members (CSE360 Group 6)
relatedResearch: [vision-fall-detection-review]
impact:
  challenge: "After a fall, getting help quickly matters — especially for someone who is alone."
  value:
    - kind: social
      text: "Wearable monitoring that detects falls and raises a GSM alert with the wearer's GPS location."
    - kind: business
      text: "Combines several biomedical sensors through sensor fusion on a single microcontroller platform."
  sdgs: [3]
featured: false
order: 5
---

## How it works

An Arduino Nano (master) reads body temperature (LM35), heart rate and SpO₂ (MAX30102), skin
conductance as a stress signal (GSR) and motion (MPU6050). It applies thresholds to detect
anomalies and falls, sounds a buzzer, and sends an SMS with the readings and GPS location
through a SIM800L GSM module and a NEO-6M GPS. An Arduino Uno (slave, over I²C) drives the OLED
display; splitting the work this way solved the Nano's memory limits.

## Reported results

From the team's laboratory and limited real-world tests:

- 45 of 50 simulated falls detected (90%); rapid sitting, jumping and bending caused some false
  positives.
- SMS alerts with readings and GPS coordinates sent within 5–7 seconds of a trigger; outdoor GPS
  fix in 35–60 seconds, accurate to 3–5 m (indoor fixes were inconsistent).
- SpO₂ within ±2% of a commercial fingertip oximeter; heart rate within ±3 bpm.

## My role

GSM and GPS module setup and integration, the power distribution design of the circuit, and the
final hardware build: component soldering and verifying the sensor data.
