---
title: "Matrimonial Hub: Data-Driven Matchmaking Platform"
short: Matrimonial Hub
tagline: A matchmaking web app built on a relational database — preference filters, match requests and chat.
summary: Designed a data-driven matchmaking platform using relational database modeling and secure backend abstractions. Implemented dynamic query pipelines and encrypted workflows for scalable, privacy-aware user matching.
course: CSE370
categories: [web]
technologies: [MySQL, Relational database modeling, PHP, JavaScript, HTML/CSS]
links:
  - label: GitHub repository
    url: https://github.com/Reshad-Ul-Karim/Matrimonial-Project-370
    kind: repository
    hostedBy: Reshad Ul Karim (collaborator)
scene: match
media:
  - type: image
    src: ../../assets/projects/matrimonial-hub/home.png
    alt: Matrimonial Hub home page — a banner reading "Your Journey to a Beautiful Marriage Begins Here" over a wedding photo, with search filters.
    caption: Home page with search filters
  - type: image
    src: ../../assets/projects/matrimonial-hub/matches.png
    alt: Two pages side by side — a member's profile, and the matches page with filters (profession, religion, ethnicity and more) beside a list of suggested matches with request buttons.
    caption: Profile and filtered matches
  - type: image
    src: ../../assets/projects/matrimonial-hub/login.png
    alt: The sign-in form shown over a photo of a wedding ceremony.
    caption: Sign-in
credits:
  - Reshad Ul Karim — collaborator; hosts the repository
impact:
  challenge: "Matchmaking depends on personal data that must be filtered accurately and kept private."
  value:
    - kind: business
      text: "A relational data model with dynamic queries that match people on their stated preferences."
    - kind: social
      text: "Privacy-aware by design: encrypted workflows protect users' personal information."
  sdgs: []
featured: false
order: 6
---

## What it does

- **Relational schema** in MySQL for users, profile details, partner preferences, match requests
  and chat messages.
- **Dynamic matching query:** the filters a member chooses (profession, religion, ethnicity, age
  range, height …) are assembled into one SQL query over the user and profile tables, excluding
  the member and anyone they are already matched with.
- **Match requests** move from *Pending* to *Accepted*; accepted matches can **chat** in the app.
- **Admin dashboard** to review registered profiles, change an account's status, or remove a
  profile.
