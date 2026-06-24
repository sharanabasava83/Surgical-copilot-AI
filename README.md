# Global AI Surgical Copilot Ecosystem

A full-stack software architecture demo for a 53-module AI-assisted surgical
platform — built to show how such a system could be structured end-to-end:
patient management, medical imaging, AI knowledge tools, multilingual
communication, global collaboration, patient monitoring, and smart hospital
operations.

**Stack:** Spring Boot (Java, JPA/Hibernate, MySQL) backend · React (Vite) frontend.

---

## ⚠️ Important disclaimer

**This is a portfolio / software-architecture project. It is NOT a certified
medical device and must never be used for real clinical, diagnostic, or
treatment decisions.**

Of the 53 modules in the catalog:

- **35 modules are fully functional "live demo" features** — real CRUD,
  real scheduling logic, real file uploads, a real rule-based glossary, a
  real sample drug-interaction dataset, real browser speech recognition/
  synthesis, a real interactive 3D viewer, real webcam overlay, real
  similarity search over stored data, and more. These are genuinely working
  software, but their *clinical* outputs (success-rate predictions, blood-loss
  estimates, risk scores, image annotations, differential diagnoses) are clearly
  labeled **SIMULATED** because they come from simple heuristics or randomized
  demo logic, not trained/validated clinical models.
- **18 modules are simulated UX mockups** — they show how the feature would
  fit into the ecosystem, with synthetic example data, but don't run real
  logic (typically because they'd require real hardware/video infrastructure,
  a licensed dataset, or a validated clinical model to be genuinely "live").

Every page in the app carries a `LIVE DEMO` / `SIMULATED` badge and a banner
explaining exactly what is and isn't real. See [`docs/MODULE_STATUS.md`](docs/MODULE_STATUS.md)
for the full breakdown.

If you want to build any clinical module into something real, it would need:
a trained model validated on real outcome data, regulatory clearance
appropriate to its risk category (e.g. FDA/CE/CDSCO), integration with real
hospital systems, and clinical oversight — none of which is in scope here.

---

## Architecture

```
surgical-copilot/
├── backend/                  Spring Boot REST API (Java 17, Maven)
│   └── src/main/java/com/surgicalcopilot/
│       ├── entity/            JPA entities (13 tables)
│       ├── repository/        Spring Data repositories
│       ├── service/           Business logic (incl. simulated-prediction services)
│       ├── controller/        REST controllers
│       ├── config/            CORS config + DB seeder
│       └── dto/                Request/response payloads
├── frontend/                  React + Vite SPA
│   └── src/
│       ├── pages/              One page per "live demo" module + generic mock page
│       ├── components/         Sidebar, layout, status badges, banners
│       ├── context/            Module catalog context (drives the 53-module nav)
│       └── services/api.js     Axios client for the backend
└── docs/                      Setup guide, module status table
```

### Why this stack

- **Spring Boot + JPA/Hibernate + MySQL** — a realistic enterprise healthcare
  stack, with a normalized schema (patients, doctors, surgeries, appointments,
  reports, chatbot history, translations, ambulance tracking, recovery
  records, vitals, hospitals, checklist items, module catalog).
- **React (Vite)** — fast dev server, simple build, calls the backend over
  REST with `axios`.

---

## Quick start

Full step-by-step setup (Java, Maven, MySQL, Node) is in
[`docs/SETUP_GUIDE.md`](docs/SETUP_GUIDE.md). Short version, once prerequisites
are installed:

```bash
# 1. Create the database
mysql -u root -p -e "CREATE DATABASE surgical_copilot;"

# 2. Configure credentials
#    Edit backend/src/main/resources/application.properties
#    (spring.datasource.username / password)

# 3. Run the backend (from backend/)
mvn spring-boot:run

# 4. Run the frontend (from frontend/, in a second terminal)
npm install
npm run dev
```

Then open **http://localhost:5173**. The backend runs on **http://localhost:8080**.

No MySQL yet? Run the backend with the zero-setup embedded-DB profile instead:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=devlocal
```

---

## Connecting real APIs (optional)

Two modules have placeholder hooks for real external providers — wired but
inactive by default so the app works with zero API keys:

- **AI Medical Chatbot** — supports both **Anthropic Claude** and **OpenAI**
  out of the box. In `backend/src/main/resources/application.properties`:
  ```properties
  app.integrations.chatbot.provider=anthropic
  app.integrations.chatbot.api-key=sk-ant-your-real-key-here
  ```
  or
  ```properties
  app.integrations.chatbot.provider=openai
  app.integrations.chatbot.api-key=sk-your-real-key-here
  ```
  Leave `api-url` and `model` blank to use sensible defaults
  (`claude-sonnet-4-6` / `gpt-4o-mini`), or set them to override. Restart
  the backend after changing this file. If the call fails for any reason
  (bad key, network issue), the chatbot automatically falls back to its
  built-in rule-based responder rather than erroring out.
- **Translation Engine** — set `app.integrations.translation.provider` /
  `api-key` / `api-url` (e.g. for LibreTranslate) instead of the mock
  `[LANG] text` placeholder.

**Never commit real API keys.** `application.properties` is tracked in this
repo with placeholder values — keep your real keys local, or move them to
environment variables / a `.env`-style override before pushing.

---

## License & use

This project is shared for educational and portfolio purposes. See the
disclaimer above — do not present any part of this system as a validated
medical product without the appropriate clinical validation and regulatory
clearance.
