# Module Status Reference

Full list of all 53 modules in the ecosystem catalog (matches the data seeded
into `module_catalog` on first run). **LIVE DEMO** = real working feature in
this codebase. **SIMULATED** = UX mockup with synthetic example data only.

This table is also visible interactively in the app itself, via the
dashboard and the `LIVE DEMO` / `SIMULATED` badge on every module page.

**Total: 53 modules — 35 LIVE DEMO, 18 SIMULATED.**

> Note: "LIVE DEMO" means the feature's *software* (UI, API, data flow,
> logic) genuinely works and is backed by real code. For modules with
> medical/clinical-sounding output (predictions, risk scores, diagnoses,
> annotations), that specific output is still a labeled **simulated**
> heuristic — not a trained, validated clinical model. See each module's
> in-app banner for the exact distinction.

## Core Surgical Intelligence

| Module | Status | Notes |
|---|---|---|
| Patient Management System | 🟢 LIVE DEMO | Full CRUD, real MySQL-backed records |
| Digital Twin Patient Engine | 🟣 SIMULATED | — |
| Surgery Success Prediction | 🟢 LIVE DEMO | Heuristic + randomized, clearly labeled simulated |
| Blood Loss Prediction | 🟢 LIVE DEMO | Heuristic + randomized, clearly labeled simulated |
| Smart Instrument Recommendation | 🟣 SIMULATED | — |
| Voice-Controlled Surgical Assistant | 🟢 LIVE DEMO | Real browser speech-recognition mapped to app navigation commands |
| Real-Time Emergency Detection | 🟢 LIVE DEMO | Real threshold-based alerting over simulated vitals |
| Surgical Checklist Automation | 🟢 LIVE DEMO | Real WHO-style checklist state, persisted |
| Surgery Planning Assistant | 🟣 SIMULATED | — |
| AI Surgical Decision Support | 🟢 LIVE DEMO | Real rule engine over real surgery data (simulated recommendation content) |

## Medical Imaging & Visualization

| Module | Status | Notes |
|---|---|---|
| Medical Image Analysis (MRI/CT/X-Ray) | 🟢 LIVE DEMO | Real upload/storage; overlay boxes are synthetic |
| Tumor Detection | 🟣 SIMULATED | — |
| Fracture Detection | 🟣 SIMULATED | — |
| Organ Abnormality Detection | 🟣 SIMULATED | — |
| 3D Human Organ Visualization | 🟢 LIVE DEMO | Real interactive Three.js viewer (simplified, non-anatomical geometry) |
| Blood Vessel Mapping | 🟣 SIMULATED | — |
| AR Surgery Guidance | 🟢 LIVE DEMO | Real webcam feed + canvas overlay (overlay graphic is simulated, not real AR/tracking) |
| Surgical Navigation System | 🟣 SIMULATED | — |
| Digital Anatomy Explorer | 🟢 LIVE DEMO | Real searchable reference browser |
| Real-Time Imaging Dashboard | 🟣 SIMULATED | — |

## AI & Knowledge Systems

| Module | Status | Notes |
|---|---|---|
| AI Medical Chatbot | 🟢 LIVE DEMO | Rule-based by default; real Claude/OpenAI integration available |
| AI Medical Knowledge Engine | 🟢 LIVE DEMO | Real searchable reference dataset (shares page with Research Hub) |
| Medical Research Hub | 🟢 LIVE DEMO | Real search/filter over a real stored dataset |
| Clinical Guideline Recommendation | 🟣 SIMULATED | — |
| Similar Case Recommendation | 🟢 LIVE DEMO | Real similarity-ranking over real stored surgery records |
| AI Drug Interaction Checker | 🟢 LIVE DEMO | Real lookup against small illustrative dataset |
| Treatment Recommendation Engine | 🟣 SIMULATED | — |
| AI Diagnosis Assistant | 🟢 LIVE DEMO | Real rule-based differential generator (simulated medical content) |
| Medical Term Simplifier | 🟢 LIVE DEMO | Real deterministic glossary-based rewriting |
| Report Explanation Engine | 🟢 LIVE DEMO | Real text rewriting reusing Term Simplifier, plus guided questions |

## Communication & Language

| Module | Status | Notes |
|---|---|---|
| Multi-Language Translation Engine | 🟢 LIVE DEMO | Mock by default; external provider hook available |
| Voice-to-Voice Translation | 🟢 LIVE DEMO | Real mic → translate → speech pipeline (browser APIs + translation engine) |
| Speech-to-Text Conversion | 🟢 LIVE DEMO | Real transcription via the browser's native Web Speech API |
| Text-to-Speech Conversion | 🟢 LIVE DEMO | Real narration via the browser's native Speech Synthesis API |
| Real-Time Chat Translation | 🟢 LIVE DEMO | Live chat thread using the translation engine |
| Global Emergency Translator | 🟣 SIMULATED | — |
| Multilingual AI Medical Chatbot | 🟢 LIVE DEMO | Real chatbot + real translation engine combined |
| Real-Time Surgery Team Translator | 🟢 LIVE DEMO | Simulated team roster, but real translation per message |

## Global Collaboration

| Module | Status | Notes |
|---|---|---|
| Multi-Hospital Collaboration | 🟢 LIVE DEMO | Real shared post/discussion feed, stored in MySQL |
| Worldwide Expert Consultation | 🟢 LIVE DEMO | Real doctor directory + consult-request flow |
| Live Remote Surgery Support | 🟣 SIMULATED | No real video/streaming infrastructure |
| Global Surgical Assistant Network | 🟣 SIMULATED | — |
| International Case Sharing | 🟢 LIVE DEMO | Real anonymized case-sharing feed, stored in MySQL |
| Global Surgical Knowledge Network | 🟣 SIMULATED | — |

## Patient Monitoring & Recovery

| Module | Status | Notes |
|---|---|---|
| Wearable Device Integration | 🟢 LIVE DEMO | Simulated pairing/sync, real data persisted |
| Remote Patient Monitoring | 🟢 LIVE DEMO | Live simulated vitals stream + charts |
| Post-Surgery Recovery Predictor | 🟣 SIMULATED | — |
| Recovery Progress Tracker | 🟢 LIVE DEMO | Real check-in CRUD + charting |
| Readmission Risk Predictor | 🟣 SIMULATED | Risk level computed via simple heuristic in Recovery Tracker |
| Infection Risk Predictor | 🟣 SIMULATED | Risk level computed via simple heuristic in Recovery Tracker |

## Smart Hospital & Emergency Services

| Module | Status | Notes |
|---|---|---|
| AI Surgery Scheduling System | 🟢 LIVE DEMO | Real conflict-checking scheduler |
| Global Location & Hospital Mapping | 🟢 LIVE DEMO | Real hospital data, built-in map projection |
| Ambulance Tracking System | 🟢 LIVE DEMO | Real data, simulated live movement |

---

**Total: 53 modules — 35 LIVE DEMO, 18 SIMULATED.**

Remaining 18 simulated mockups (by design — would need real hardware/video
infrastructure, a licensed dataset, or a validated clinical model to be
genuinely "live"): Digital Twin Patient Engine, Smart Instrument
Recommendation, Surgery Planning Assistant, Tumor Detection, Fracture
Detection, Organ Abnormality Detection, Blood Vessel Mapping, Surgical
Navigation System, Real-Time Imaging Dashboard, Clinical Guideline
Recommendation, Treatment Recommendation Engine, Global Emergency
Translator, Live Remote Surgery Support, Global Surgical Assistant Network,
Global Surgical Knowledge Network, Post-Surgery Recovery Predictor,
Readmission Risk Predictor, Infection Risk Predictor.
