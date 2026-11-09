---
title: "PathGuard: Discrete Logic-Driven Obstacle Avoider"
short: PathGuard
tagline: Autonomous navigation without a microcontroller — decisions made in discrete logic.
summary: Built a microcontroller-free autonomous navigation system using discrete logic circuits and sensor-driven control to study low-level robotic decision-making.
start: 2025-02
end: 2025-05
course: CSE350
scene: robot
categories: [robotics, embedded]
technologies: [Discrete logic circuits, Sensor-driven control, RTL NOT gates (NPN transistors), L298N dual H-bridge, IR sensors, TinkerCAD]
links:
  - label: Project report (PDF)
    url: reports/pathguard.pdf
    kind: report
media:
  - type: image
    src: ../../assets/projects/pathguard/robot.jpg
    alt: The PathGuard robot car from above — a clear chassis with two IR sensors at the front, a breadboard of transistor gates, a battery pack and a red L298N motor driver.
    caption: The finished robot
credits:
  - Mohsina Binte Harun, Nahin Warida and Sadia Binte Kamal — co-authors of the project report
impact:
  challenge: "Can a vehicle avoid obstacles with no microcontroller at all?"
  value:
    - kind: business
      text: "Makes real-time navigation decisions in discrete logic, with no processor or software."
  sdgs: []
featured: false
order: 8
---

## How it works

Two IR sensors at the front-left and front-right give a HIGH/LOW signal. Each signal and its
inverse (from a single-transistor RTL NOT gate) drive the inputs of an L298N dual H-bridge,
crossed so that an obstacle on one side drives the opposite motor. A four-row truth table gives
the behaviour (forward, turn right, turn left or reverse) with no microcontroller and no code.

## What we learned

Thin obstacles such as chair legs could slip past the narrow IR beams, and battery discharge
shifted the sensors' calibration. The report proposes ultrasonic sensors, voltage regulation and
hardware PWM speed control as next steps toward an indoor assistive robot.
