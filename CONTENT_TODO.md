# Content to-do — career portfolio

Open questions for the owner. Nothing below is shown to visitors; the site simply leaves out
anything that isn't confirmed.

## Needed for the corporate version

### Résumé
- [ ] **Industry résumé (PDF).** The CV download is switched off on this site (`cv: null` in
      `src/data/profile.ts`). Supply a one- or two-page industry résumé, check it contains no
      phone number, home address or referee details, put it in `public/cv/` and set `cv` back
      to its path. Every "Download CV" button then reappears.

### Positioning — Management Trainee (please confirm or reword)
The site is aimed at Management Trainee programmes such as Grameenphone's Next Business Leader
(NBL), which recruits fresh STEM graduates (0–2 years' experience) into Commercial, Technology and
Techno-Commercial tracks and looks for analytical, problem-solving and communication skills, a
growth mindset and leadership potential. The site doesn't name NBL, so it also works for other
programmes.
- [ ] **Hero:** "AI & Technology" with "CSE Graduate · aspiring business leader" underneath;
      page title "AI & Technology Graduate · Aspiring Business Leader".
- [ ] **Availability:** "Open to Management Trainee programmes — technology and
      techno-commercial tracks" (hero badge, About, Contact). Change via `availability` in
      `src/data/profile.ts`.
- [ ] **Profile statement (About):** "I bring AI and technology together with people to deliver
      results", ending "…ready for a fast-track leadership programme."
- [ ] **Leadership in action** (`src/data/leadership.ts`): six qualities, each backed only by
      CV facts. You held no formal leadership title, so the section shows behaviours, not
      positions. Did you lead anything (a sub-team on the rover, a club, an event, a team
      project)? Real leadership roles would make this section much stronger.

### Impact — numbers only you can supply
Project and experience text describes what the work was built to do, not measured results.
If you have real figures, they make the strongest case for recruiters:
- [ ] **Grameenphone NEXTERN:** how many sites, rectifiers or batteries were monitored? Did the
      automated weekly reporting save time or replace a manual process? What happened with the
      AI-assisted site power design tool requirements?
- [ ] **WeHeal:** any usage (registered users, appointments, partners) or recognition? Your
      specific part of the build?
- [ ] **Smoking prediction:** may the site quote the model results from the project report
      (e.g. the best model's accuracy)?
- [ ] **Data Structures TA:** anything beyond "250+ students mentored" (sections, sessions,
      feedback)?
- [ ] **Mars rover team:** which subsystem results can be credited to your work?

### Impact framing — please review
- [ ] **"Why it matters" lines** on each project (`impact` in `src/content/projects/*.md`).
      They were written from the existing project descriptions; correct anything that
      overstates the project.
- [ ] **UN SDG tags:** WeHeal (3, 9), healthcare network (3, 9, 11), smoking prediction (3),
      ArUco service bot (9), health monitor (3). Keep, change or remove.

### Skills
- [ ] **Microsoft Excel** is listed under Professional Skills because of the EXCELERATE National
      Excel Competition (Top 6 Finalist). Keep it?
- [ ] **New skill names** grouped for this site: Network Design, VLSM Subnetting, Routing,
      Autonomous Navigation, Cross-Team Coordination, Requirements Preparation, Automated
      Reporting, Mentoring & Training, Presentations. Each links to the role or project it
      comes from. Remove any you'd rather not claim.

### Links
- [ ] **Code links.** The PathGuard and smoking-prediction repositories are not linked on this
      site. To show code to recruiters, add public repositories under this account and link
      them in each project's `links`.
- [ ] **GitHub profile.** Not listed yet (the account is empty). Add it to `links` in
      `src/data/profile.ts` once it has public repositories.
- [ ] **Long-term email.** The site uses `syeda.maliha.tabassum1@g.bracu.ac.bd`. University
      addresses can expire after graduation — use a personal address instead?

## Still open from earlier
- [ ] **Your role in each project** — add a `## My role` section below the front matter of
      each `src/content/projects/*.md`.
- [ ] **Team members for projects.** Only documented collaborators are credited.
- [ ] **CSE471 Project Demonstration, 1st Runner-Up (Dec 2025):** which project was it? If it
      was WeHeal, it can be shown on that project.
- [ ] **NEXTERN:** use a descriptive title such as "NEXTERN Intern" for visitors who don't
      know the programme?
- [ ] **DRISTEE:** may the site say more about the assistive technology project?
- [ ] **Dates** for projects that have none (Matrimonial Hub, PetSeg, Smart City network,
      ProCV, Rakkhosh Must Die).
- [ ] **Rakkhosh Must Die:** a real screenshot for its gallery.
- [ ] **Certificates and links** for awards (shown only when supplied).
- [ ] **IELTS:** optional link to verify the Test Report Form.

## Decisions made for this site
- **Section order for recruiters:** About → Experience → Projects → Education & Awards →
  Publications → Contact. Experience lists the industry role first, then the engineering team,
  teaching and research roles.
- **Publications kept, but compact** (no filters), near the end: evidence of analytical skill
  and technical writing.
- **Colours:** Grameenphone's brand blues and green, light theme by default. No Grameenphone
  logo or branding is used, so the site doesn't look affiliated with the company.
- **Profiles:** LinkedIn and email only.
