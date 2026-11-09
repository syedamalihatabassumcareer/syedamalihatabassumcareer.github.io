---
title: Rakkhosh Must Die
short: Rakkhosh Must Die
tagline: A 3D tower-defence game drawn from OpenGL primitives — seven waves, three weapons, traps, turrets and a boss.
summary: Built a 3D tower-defence game in Python with PyOpenGL and GLUT. The player defends a central rift against seven escalating waves of monsters using three weapons, slowing and spike traps, auto-targeting turrets and timed power-ups, ending in a Master Boss fight.
course: CSE423 · Computer Graphics
scene: arena
categories: [graphics]
technologies: [Python 3, PyOpenGL, GLUT / freeglut, 3D rendering, Collision detection, Game AI (waypoints)]
links:
  - label: Project report (PDF)
    url: reports/rakkhosh-must-die.pdf
    kind: report
impact:
  challenge: "Games demand real-time performance: rendering, collisions and enemy behaviour, every frame."
  value:
    - kind: business
      text: "Real-time 3D rendering, collision detection and waypoint-based enemy AI, built from OpenGL primitives."
  sdgs: []
featured: false
order: 11
---

## Gameplay

Enemies enter from random corners of the arena and follow set paths toward the rift; each one
that arrives costs the core 10 of its 100 HP. The player switches between a pistol, a piercing
crossbow and a two-pellet shotgun, places traps at chokepoints, and picks up timed power-ups
(speed boost, super jump and a 360° "roundhouse" volley). Waves grow from 18 easy enemies to 49
in wave 7, which adds faster, projectile-firing enemies and a 20-HP Master Boss.

## How it is built

- **Rendering:** characters, arena, weapons and effects are composed from spheres, cylinders,
  cubes and polygons in OpenGL; an orthographic pass draws the HUD (health, wave, enemies,
  score, weapon, traps and power-up timers).
- **Simulation:** a state-driven game loop updates movement, gravity, enemies, projectiles,
  collisions, effects and wave progression each frame.
- **Enemy AI:** waypoint paths with "aggro" — enemies may turn on a nearby player before
  heading for the rift. Turrets find and rotate toward nearby targets; traps act by proximity.

Inspired by the tower-defence action game *Orcs Must Die*.
