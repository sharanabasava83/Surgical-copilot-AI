# Setup Guide — Run in VS Code

This guide assumes a fresh machine with **none** of the prerequisites
installed. Skip any step you've already done.

---

## 1. Install prerequisites

### Java 17+ (JDK)

- **Windows/Mac/Linux:** download from
  [Eclipse Temurin](https://adoptium.net/) (recommended) or
  [Oracle JDK](https://www.oracle.com/java/technologies/downloads/).
- Verify:
  ```bash
  java -version
  ```
  Should print `17` or higher.

### Maven

- Download from [maven.apache.org](https://maven.apache.org/download.cgi),
  or install via a package manager:
  ```bash
  # macOS
  brew install maven

  # Windows (with Chocolatey)
  choco install maven

  # Ubuntu/Debian
  sudo apt install maven
  ```
- Verify:
  ```bash
  mvn -version
  ```

### MySQL

- Download [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
  (pick the installer for your OS), or:
  ```bash
  # macOS
  brew install mysql
  brew services start mysql

  # Windows (with Chocolatey)
  choco install mysql

  # Ubuntu/Debian
  sudo apt install mysql-server
  sudo systemctl start mysql
  ```
- During install, set a root password and remember it.
- Create the database:
  ```bash
  mysql -u root -p
  ```
  Then in the MySQL prompt:
  ```sql
  CREATE DATABASE surgical_copilot;
  EXIT;
  ```

**Don't want to install MySQL right now?** Skip this step entirely — see
"Run without MySQL" near the bottom of this guide.

### Node.js (for the frontend)

- Download the LTS version from [nodejs.org](https://nodejs.org/) (v18+).
- Verify:
  ```bash
  node -version
  npm -version
  ```

### VS Code extensions

Open VS Code → Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`) and install:

- **Extension Pack for Java** (Microsoft) — for the Spring Boot backend
- **Spring Boot Extension Pack** (VMware) — optional, adds run/debug helpers
- **ESLint** (optional) — for the React frontend

---

## 2. Open the project

1. Unzip the project.
2. In VS Code: `File → Open Folder…` → select the unzipped root folder
   (the one containing `backend/` and `frontend/`).

---

## 3. Configure the database connection

Open `backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

Replace `your_mysql_password` with the password you set during MySQL
install. The database itself (`surgical_copilot`) will be created
automatically on first run if it doesn't already exist
(`createDatabaseIfNotExist=true` is already set in the URL).

---

## 4. Run the backend

Open a terminal in VS Code (`` Ctrl+` ``) and run:

```bash
cd backend
mvn spring-boot:run
```

First run downloads dependencies — this can take a few minutes. You should
eventually see:

```
============================================================
 Global AI Surgical Copilot Ecosystem - Backend running
 API base: http://localhost:8080/api
 DEMO MODE: outputs are simulated, not clinically validated
============================================================
```

The app auto-creates all tables (`spring.jpa.hibernate.ddl-auto=update`) and
seeds sample patients, doctors, hospitals, surgeries, and ambulances plus
the full 53-module catalog on first run.

**Test it:** open http://localhost:8080/api/modules in a browser — you
should see a JSON array of 53 modules.

---

## 5. Run the frontend

Open a **second terminal** in VS Code (click the `+` in the terminal panel)
and run:

```bash
cd frontend
npm install
npm run dev
```

You should see:

```
  VITE ready
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser. You should see the sidebar
with all 53 modules grouped into 8 categories, and a dashboard of module
cards.

**Browser permissions:** a few modules (Speech-to-Text, Voice-to-Voice
Translation, Voice-Controlled Surgical Assistant, AR Surgery Guidance) ask
for microphone or camera access — your browser will prompt for this the
first time you use them. These run entirely in your browser using native
Web Speech/Media APIs; no audio or video is sent to the backend.

---

## Run without MySQL (zero-setup local dev)

If you don't want to install MySQL right now, run the backend with the
built-in embedded-database profile instead — no extra install needed:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=devlocal
```

This uses an embedded H2 database file stored in `backend/data/`, in MySQL
compatibility mode. Everything else (frontend, API endpoints, sample data)
works identically. Switch to the real `mysql` config later by simply
dropping the `-Dspring-boot.run.profiles=devlocal` flag.

---

## Troubleshooting

**`mvn` not found**
Maven isn't on your PATH. Re-check the install step, or use your IDE's
bundled Maven: in VS Code with the Java extension pack, you can right-click
`SurgicalCopilotApplication.java` → "Run Java" instead of using the terminal.

**Backend fails to connect to MySQL**
- Confirm MySQL is running: `mysql -u root -p` should connect.
- Double-check the username/password in `application.properties`.
- Confirm the port in the JDBC URL (`3306`) matches your MySQL install.

**Frontend shows "Backend not reachable"**
- Confirm the backend terminal shows it's running on port 8080.
- Check `frontend/src/services/api.js` — `baseURL` should be
  `http://localhost:8080/api`.
- Browser console (F12) will show the exact network error.

**Port already in use**
- Backend: change `server.port` in `application.properties`.
- Frontend: change `server.port` in `vite.config.js`, and update
  `app.cors.allowed-origins` in `application.properties` to match.

**CORS errors in browser console**
Confirm `app.cors.allowed-origins` in `application.properties` matches the
exact URL the frontend is running on (including port).

---

## Project structure reference

```
backend/
  pom.xml                          Maven build file
  src/main/resources/
    application.properties         Main config (MySQL, ports, API keys)
    application-devlocal.properties  Zero-setup embedded-DB profile
  src/main/java/com/surgicalcopilot/
    entity/        13 JPA entities
    repository/    Spring Data JPA repositories
    service/       Business logic
    controller/    REST endpoints (/api/...)
    config/        CORS + startup data seeder

frontend/
  package.json
  vite.config.js
  src/
    main.jsx, App.jsx
    pages/          One file per module page
    components/     Sidebar, layout, badges
    context/        Module catalog state
    services/api.js Backend API client
    styles/global.css
```
