---
title: "VoltScope: Analog Voltage Deviation Visualizer"
short: VoltScope
tagline: An analog circuit that turns a changing voltage into a coloured LED bar — rectify, scale, compare, display.
summary: Built an analog circuit that shows how far a voltage (standing in for a pressure sensor) deviates from its optimum. A full-wave rectifier, an op-amp amplifier and a bank of comparators fed by a resistor ladder light eight LEDs, from blue for small deviations to red for large ones.
period: Spring 2024
course: CSE251 · Electronics Laboratory
categories: [electronics]
technologies: [Full-wave rectifier, Op-amps (LM324), Comparator bank, Resistor ladder, LED display, Oscilloscope]
links:
  - label: Project report (PDF)
    url: reports/voltscope.pdf
    kind: report
cover:
  src: ../../assets/projects/voltscope/cover.jpg
  alt: The VoltScope circuit wired on a lab trainer board, with a column of lit orange, green and blue LEDs.
media:
  - type: video
    src: media/projects/voltscope/oscilloscope-and-leds.mp4
    poster: ../../assets/projects/voltscope/poster-oscilloscope.jpg
    title: VoltScope running — oscilloscope trace and LED bar
    caption: The oscilloscope shows the rectified signal while the LED bar rises and falls with it (8 s, no sound).
    orientation: portrait
  - type: video
    src: media/projects/voltscope/led-bar-and-simulation.mp4
    poster: ../../assets/projects/voltscope/poster-led-bar.jpg
    title: VoltScope LED bar beside the circuit simulation
    caption: The breadboard's eight LEDs light in sequence, next to the simulated comparator circuit (28 s, no sound).
    orientation: portrait
  - type: image
    src: ../../assets/projects/voltscope/bench.jpg
    alt: The VoltScope circuit on a lab trainer board under an oscilloscope showing a rectified waveform, with a column of lit blue, green and orange LEDs.
    caption: The circuit on the lab bench
impact:
  challenge: "Operators need to see at a glance how far a reading has drifted from its target."
  value:
    - kind: business
      text: "Lets an operator read drift at a glance — more lights, larger deviation — with no screen or software."
  sdgs: []
featured: false
order: 9
---

## How it works

1. **Input:** a 1 Hz sine or triangle wave emulates a sensor drifting around its optimum.
2. **Full-wave rectifier:** turns positive and negative excursions into a single deviation
   magnitude.
3. **Amplifier:** scales the signal into the 0–5 V range.
4. **Quantiser and display:** eight op-amp comparators, each with a threshold from a resistor
   ladder, switch eight LEDs — blue, then green and orange, then red — so more lights mean a
   larger deviation.

The circuits follow the reference design in the course handout; the team built, wired and tested
the complete system on the lab trainer.
