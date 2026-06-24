package com.surgicalcopilot.config;

import com.surgicalcopilot.entity.*;
import com.surgicalcopilot.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds the database with:
 *  1. The full catalog of all 53 ecosystem modules (drives the dashboard).
 *  2. A small set of sample patients/doctors/hospitals so LIVE_DEMO
 *     modules have something to show immediately after first run.
 *
 * Runs only when tables are empty, so it's safe to restart the app.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final ModuleCatalogRepository moduleCatalogRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final SurgeryRepository surgeryRepository;
    private final AmbulanceTrackingRepository ambulanceTrackingRepository;
    private final KnowledgeArticleRepository knowledgeArticleRepository;
    private final CollaborationPostRepository collaborationPostRepository;
    private final ConsultRequestRepository consultRequestRepository;

    public DataSeeder(ModuleCatalogRepository moduleCatalogRepository,
                       PatientRepository patientRepository,
                       DoctorRepository doctorRepository,
                       HospitalRepository hospitalRepository,
                       SurgeryRepository surgeryRepository,
                       AmbulanceTrackingRepository ambulanceTrackingRepository,
                       KnowledgeArticleRepository knowledgeArticleRepository,
                       CollaborationPostRepository collaborationPostRepository,
                       ConsultRequestRepository consultRequestRepository) {
        this.moduleCatalogRepository = moduleCatalogRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.hospitalRepository = hospitalRepository;
        this.surgeryRepository = surgeryRepository;
        this.ambulanceTrackingRepository = ambulanceTrackingRepository;
        this.knowledgeArticleRepository = knowledgeArticleRepository;
        this.collaborationPostRepository = collaborationPostRepository;
        this.consultRequestRepository = consultRequestRepository;
    }

    @Override
    public void run(String... args) {
        if (moduleCatalogRepository.count() == 0) {
            seedModuleCatalog();
        }
        if (patientRepository.count() == 0) {
            seedSampleData();
        }
        if (knowledgeArticleRepository.count() == 0) {
            seedKnowledgeArticles();
        }
        if (collaborationPostRepository.count() == 0) {
            seedCollaborationPosts();
        }
    }

    private ModuleCatalog mod(String key, String name, String category, String desc,
                               String status, String risk, String icon, int order) {
        ModuleCatalog m = new ModuleCatalog();
        m.setModuleKey(key);
        m.setName(name);
        m.setCategory(category);
        m.setDescription(desc);
        m.setImplementationStatus(status);
        m.setRiskCategory(risk);
        m.setIcon(icon);
        m.setDisplayOrder(order);
        return m;
    }

    private void seedModuleCatalog() {
        String LIVE = "LIVE_DEMO";
        String SIM = "SIMULATED";
        String CLINICAL = "CLINICAL_SIMULATED";
        String NONCLINICAL = "NON_CLINICAL";

        List<ModuleCatalog> modules = List.of(
            // ===== Core Surgical Intelligence =====
            mod("patient-management", "Patient Management System", "Core Surgical Intelligence",
                "Register, search, and manage patient records.", LIVE, NONCLINICAL, "users", 1),
            mod("digital-twin", "Digital Twin Patient Engine", "Core Surgical Intelligence",
                "Simulated virtual model of a patient's physiology for planning.", SIM, CLINICAL, "scan", 2),
            mod("success-prediction", "Surgery Success Prediction", "Core Surgical Intelligence",
                "Simulated estimate of procedure success likelihood.", LIVE, CLINICAL, "trending-up", 3),
            mod("blood-loss-prediction", "Blood Loss Prediction", "Core Surgical Intelligence",
                "Simulated estimate of expected intra-operative blood loss.", LIVE, CLINICAL, "droplet", 4),
            mod("instrument-recommendation", "Smart Instrument Recommendation", "Core Surgical Intelligence",
                "Simulated suggested instrument tray for a procedure type.", SIM, CLINICAL, "scissors", 5),
            mod("voice-assistant", "Voice-Controlled Surgical Assistant", "Core Surgical Intelligence",
                "Browser speech-recognition demo for hands-free command input.", LIVE, CLINICAL, "mic", 6),
            mod("emergency-detection", "Real-Time Emergency Detection", "Core Surgical Intelligence",
                "Real threshold-based alerts evaluated against simulated live vitals.", LIVE, CLINICAL, "alert-triangle", 7),
            mod("checklist-automation", "Surgical Checklist Automation", "Core Surgical Intelligence",
                "Digitized, trackable pre/post-op checklist (WHO-style).", LIVE, NONCLINICAL, "check-square", 8),
            mod("surgery-planning", "Surgery Planning Assistant", "Core Surgical Intelligence",
                "Simulated step-by-step procedure plan generator.", SIM, CLINICAL, "clipboard", 9),
            mod("decision-support", "AI Surgical Decision Support", "Core Surgical Intelligence",
                "Real rule-engine recommendation feed (simulated recommendation content).", LIVE, CLINICAL, "compass", 10),

            // ===== Medical Imaging & Visualization =====
            mod("image-analysis", "Medical Image Analysis (MRI/CT/X-Ray)", "Medical Imaging & Visualization",
                "Upload scans and view simulated AI overlay annotations.", LIVE, CLINICAL, "image", 11),
            mod("tumor-detection", "Tumor Detection", "Medical Imaging & Visualization",
                "Simulated highlighted regions of interest on scans.", SIM, CLINICAL, "target", 12),
            mod("fracture-detection", "Fracture Detection", "Medical Imaging & Visualization",
                "Simulated fracture localization on X-ray images.", SIM, CLINICAL, "bone", 13),
            mod("organ-abnormality", "Organ Abnormality Detection", "Medical Imaging & Visualization",
                "Simulated flagging of abnormal organ regions.", SIM, CLINICAL, "heart-pulse", 14),
            mod("organ-3d", "3D Human Organ Visualization", "Medical Imaging & Visualization",
                "Real interactive 3D anatomy viewer (rotate/zoom).", LIVE, NONCLINICAL, "box", 15),
            mod("vessel-mapping", "Blood Vessel Mapping", "Medical Imaging & Visualization",
                "Simulated vascular structure overlay.", SIM, CLINICAL, "git-branch", 16),
            mod("ar-guidance", "AR Surgery Guidance", "Medical Imaging & Visualization",
                "Real webcam overlay demo (not true depth-tracked AR).", LIVE, CLINICAL, "glasses", 17),
            mod("surgical-navigation", "Surgical Navigation System", "Medical Imaging & Visualization",
                "Simulated real-time instrument tracking display.", SIM, CLINICAL, "navigation", 18),
            mod("anatomy-explorer", "Digital Anatomy Explorer", "Medical Imaging & Visualization",
                "Real browsable, searchable anatomy reference.", LIVE, NONCLINICAL, "layers", 19),
            mod("imaging-dashboard", "Real-Time Imaging Dashboard", "Medical Imaging & Visualization",
                "Aggregated live view of imaging studies in progress.", SIM, CLINICAL, "monitor", 20),

            // ===== AI & Knowledge Systems =====
            mod("medical-chatbot", "AI Medical Chatbot", "AI & Knowledge Systems",
                "General-purpose medical Q&A assistant (general info only).", LIVE, CLINICAL, "message-circle", 21),
            mod("knowledge-engine", "AI Medical Knowledge Engine", "AI & Knowledge Systems",
                "Real searchable reference knowledge base.", LIVE, NONCLINICAL, "book-open", 22),
            mod("research-hub", "Medical Research Hub", "AI & Knowledge Systems",
                "Real curated, searchable research article browser.", LIVE, NONCLINICAL, "book", 23),
            mod("guideline-recommendation", "Clinical Guideline Recommendation", "AI & Knowledge Systems",
                "Simulated guideline matching for a given case.", SIM, CLINICAL, "list-checks", 24),
            mod("similar-case", "Similar Case Recommendation", "AI & Knowledge Systems",
                "Real similarity search against stored case data (small demo dataset).", LIVE, CLINICAL, "copy", 25),
            mod("drug-interaction", "AI Drug Interaction Checker", "AI & Knowledge Systems",
                "Simulated interaction lookup between sample drug names.", LIVE, CLINICAL, "pill", 26),
            mod("treatment-recommendation", "Treatment Recommendation Engine", "AI & Knowledge Systems",
                "Simulated treatment-pathway suggestions.", SIM, CLINICAL, "git-merge", 27),
            mod("diagnosis-assistant", "AI Diagnosis Assistant", "AI & Knowledge Systems",
                "Real rule-based differential generator (simulated medical content).", LIVE, CLINICAL, "stethoscope", 28),
            mod("term-simplifier", "Medical Term Simplifier", "AI & Knowledge Systems",
                "Rewrites clinical text into plain language.", LIVE, NONCLINICAL, "type", 29),
            mod("report-explanation", "Report Explanation Engine", "AI & Knowledge Systems",
                "Real plain-language report rewriting plus guided questions.", LIVE, CLINICAL, "file-text", 30),

            // ===== Communication & Language =====
            mod("translation-engine", "Multi-Language Translation Engine", "Communication & Language",
                "Text translation across supported languages.", LIVE, NONCLINICAL, "languages", 31),
            mod("voice-translation", "Voice-to-Voice Translation", "Communication & Language",
                "Real mic-to-speech-to-translation-to-speech pipeline (browser APIs).", LIVE, NONCLINICAL, "headphones", 32),
            mod("speech-to-text", "Speech-to-Text Conversion", "Communication & Language",
                "Real transcription using the browser's native speech recognition.", LIVE, NONCLINICAL, "mic-2", 33),
            mod("text-to-speech", "Text-to-Speech Conversion", "Communication & Language",
                "Real narration using the browser's native speech synthesis.", LIVE, NONCLINICAL, "volume-2", 34),
            mod("chat-translation", "Real-Time Chat Translation", "Communication & Language",
                "Live translated chat thread demo.", LIVE, NONCLINICAL, "messages-square", 35),
            mod("emergency-translator", "Global Emergency Translator", "Communication & Language",
                "Phrasebook-style emergency translation demo.", SIM, NONCLINICAL, "siren", 36),
            mod("multilingual-chatbot", "Multilingual AI Medical Chatbot", "Communication & Language",
                "Real chatbot wired to the translation engine with a language switcher.", LIVE, CLINICAL, "globe", 37),
            mod("team-translator", "Real-Time Surgery Team Translator", "Communication & Language",
                "Real simulated multi-party chat room using the translation engine.", LIVE, NONCLINICAL, "users-round", 38),

            // ===== Global Collaboration =====
            mod("hospital-collaboration", "Multi-Hospital Collaboration", "Global Collaboration",
                "Real shared case/discussion feed stored across hospitals.", LIVE, NONCLINICAL, "building-2", 39),
            mod("expert-consultation", "Worldwide Expert Consultation", "Global Collaboration",
                "Real expert-matching directory and consult-request flow.", LIVE, NONCLINICAL, "user-check", 40),
            mod("remote-surgery-support", "Live Remote Surgery Support", "Global Collaboration",
                "Simulated remote mentoring session UI - no real video/streaming infrastructure.", SIM, CLINICAL, "video", 41),
            mod("assistant-network", "Global Surgical Assistant Network", "Global Collaboration",
                "Simulated directory of connected assistant nodes.", SIM, NONCLINICAL, "network", 42),
            mod("case-sharing", "International Case Sharing", "Global Collaboration",
                "Real anonymized case-sharing feed, stored in the database.", LIVE, NONCLINICAL, "share-2", 43),
            mod("knowledge-network", "Global Surgical Knowledge Network", "Global Collaboration",
                "Simulated cross-institution knowledge graph view.", SIM, NONCLINICAL, "share", 44),

            // ===== Patient Monitoring & Recovery =====
            mod("wearable-integration", "Wearable Device Integration", "Patient Monitoring & Recovery",
                "Simulated wearable data feed (no real device pairing).", LIVE, CLINICAL, "watch", 45),
            mod("remote-monitoring", "Remote Patient Monitoring", "Patient Monitoring & Recovery",
                "Live simulated vitals stream and charting.", LIVE, CLINICAL, "activity", 46),
            mod("recovery-predictor", "Post-Surgery Recovery Predictor", "Patient Monitoring & Recovery",
                "Simulated recovery-timeline estimate.", SIM, CLINICAL, "calendar-clock", 47),
            mod("recovery-tracker", "Recovery Progress Tracker", "Patient Monitoring & Recovery",
                "Logs and charts real recovery check-in data.", LIVE, NONCLINICAL, "line-chart", 48),
            mod("readmission-risk", "Readmission Risk Predictor", "Patient Monitoring & Recovery",
                "Simulated risk scoring for readmission.", SIM, CLINICAL, "rotate-ccw", 49),
            mod("infection-risk", "Infection Risk Predictor", "Patient Monitoring & Recovery",
                "Simulated post-op infection risk scoring.", SIM, CLINICAL, "shield-alert", 50),

            // ===== Smart Hospital & Emergency Services =====
            mod("surgery-scheduling", "AI Surgery Scheduling System", "Smart Hospital & Emergency Services",
                "Real scheduling and conflict-checking for the OR calendar.", LIVE, NONCLINICAL, "calendar", 51),
            mod("hospital-mapping", "Global Location & Hospital Mapping", "Smart Hospital & Emergency Services",
                "Map view of hospital locations and capacity.", LIVE, NONCLINICAL, "map-pin", 52),
            mod("ambulance-tracking", "Ambulance Tracking System", "Smart Hospital & Emergency Services",
                "Live simulated ambulance location and ETA tracking.", LIVE, NONCLINICAL, "truck", 53)
        );

        moduleCatalogRepository.saveAll(modules);
    }

    private void seedSampleData() {
        Patient p1 = new Patient();
        p1.setFullName("Ananya Rao");
        p1.setGender("Female");
        p1.setDateOfBirth(LocalDate.of(1989, 4, 12));
        p1.setBloodGroup("O+");
        p1.setEmail("ananya.rao@example.com");
        p1.setPhone("+91-90000-00001");
        p1.setAddress("Bengaluru, Karnataka, India");
        p1.setPreferredLanguage("en");
        p1.setMedicalHistory("Hypertension, managed with medication.");
        p1.setAllergies("Penicillin");
        patientRepository.save(p1);

        Patient p2 = new Patient();
        p2.setFullName("Marcus Webb");
        p2.setGender("Male");
        p2.setDateOfBirth(LocalDate.of(1975, 11, 2));
        p2.setBloodGroup("A-");
        p2.setEmail("marcus.webb@example.com");
        p2.setPhone("+1-415-555-0199");
        p2.setAddress("San Francisco, CA, USA");
        p2.setPreferredLanguage("en");
        p2.setMedicalHistory("Type 2 diabetes.");
        p2.setAllergies("None known");
        patientRepository.save(p2);

        Patient p3 = new Patient();
        p3.setFullName("Lucia Fernández");
        p3.setGender("Female");
        p3.setDateOfBirth(LocalDate.of(1995, 7, 30));
        p3.setBloodGroup("B+");
        p3.setEmail("lucia.fernandez@example.com");
        p3.setPhone("+34-600-000-000");
        p3.setAddress("Madrid, Spain");
        p3.setPreferredLanguage("es");
        p3.setMedicalHistory("No significant history.");
        p3.setAllergies("Latex");
        patientRepository.save(p3);

        Doctor d1 = new Doctor();
        d1.setFullName("Dr. Priya Nair");
        d1.setSpecialization("Cardiothoracic Surgery");
        d1.setHospitalName("Bengaluru City General Hospital");
        d1.setEmail("priya.nair@hospital.example");
        d1.setPhone("+91-90000-11111");
        d1.setCountry("India");
        d1.setYearsExperience(14);
        doctorRepository.save(d1);

        Doctor d2 = new Doctor();
        d2.setFullName("Dr. James Okafor");
        d2.setSpecialization("Orthopedic Surgery");
        d2.setHospitalName("St. Helena Medical Center");
        d2.setEmail("james.okafor@hospital.example");
        d2.setPhone("+1-415-555-0222");
        d2.setCountry("USA");
        d2.setYearsExperience(9);
        doctorRepository.save(d2);

        Hospital h1 = new Hospital();
        h1.setName("Bengaluru City General Hospital");
        h1.setCity("Bengaluru");
        h1.setCountry("India");
        h1.setLatitude(12.9716);
        h1.setLongitude(77.5946);
        h1.setType("GENERAL");
        h1.setBedsAvailable(42);
        h1.setIcuBedsAvailable(6);
        h1.setEmergencyCapacity("NORMAL");
        hospitalRepository.save(h1);

        Hospital h2 = new Hospital();
        h2.setName("St. Helena Medical Center");
        h2.setCity("San Francisco");
        h2.setCountry("USA");
        h2.setLatitude(37.7749);
        h2.setLongitude(-122.4194);
        h2.setType("TRAUMA_CENTER");
        h2.setBedsAvailable(18);
        h2.setIcuBedsAvailable(3);
        h2.setEmergencyCapacity("BUSY");
        hospitalRepository.save(h2);

        Hospital h3 = new Hospital();
        h3.setName("Hospital Universitario La Paz");
        h3.setCity("Madrid");
        h3.setCountry("Spain");
        h3.setLatitude(40.4793);
        h3.setLongitude(-3.6883);
        h3.setType("GENERAL");
        h3.setBedsAvailable(60);
        h3.setIcuBedsAvailable(10);
        h3.setEmergencyCapacity("NORMAL");
        hospitalRepository.save(h3);

        Surgery s1 = new Surgery();
        s1.setPatient(p1);
        s1.setLeadSurgeon(d1);
        s1.setProcedureName("Coronary Bypass Graft");
        s1.setProcedureType("CARDIAC");
        s1.setStatus("SCHEDULED");
        s1.setScheduledStart(LocalDateTime.now().plusDays(3).withHour(9).withMinute(0));
        s1.setScheduledEnd(LocalDateTime.now().plusDays(3).withHour(13).withMinute(0));
        s1.setOperatingRoom("OR-3");
        s1.setPredictedSuccessRate(92.4);
        s1.setPredictedBloodLossMl(350.0);
        s1.setPredictedDurationMinutes(240);
        surgeryRepository.save(s1);

        Surgery s2 = new Surgery();
        s2.setPatient(p2);
        s2.setLeadSurgeon(d2);
        s2.setProcedureName("Total Knee Replacement");
        s2.setProcedureType("ORTHOPEDIC");
        s2.setStatus("SCHEDULED");
        s2.setScheduledStart(LocalDateTime.now().plusDays(1).withHour(11).withMinute(0));
        s2.setScheduledEnd(LocalDateTime.now().plusDays(1).withHour(13).withMinute(30));
        s2.setOperatingRoom("OR-1");
        s2.setPredictedSuccessRate(95.1);
        s2.setPredictedBloodLossMl(180.0);
        s2.setPredictedDurationMinutes(150);
        surgeryRepository.save(s2);

        AmbulanceTracking a1 = new AmbulanceTracking();
        a1.setVehicleCode("AMB-BLR-01");
        a1.setDriverName("Suresh Kumar");
        a1.setStatus("EN_ROUTE");
        a1.setCurrentLat(12.9352);
        a1.setCurrentLng(77.6146);
        a1.setDestinationHospital("Bengaluru City General Hospital");
        a1.setDestinationLat(12.9716);
        a1.setDestinationLng(77.5946);
        a1.setEtaMinutes(8);
        ambulanceTrackingRepository.save(a1);

        AmbulanceTracking a2 = new AmbulanceTracking();
        a2.setVehicleCode("AMB-SF-04");
        a2.setDriverName("Diego Alvarez");
        a2.setStatus("DISPATCHED");
        a2.setCurrentLat(37.7849);
        a2.setCurrentLng(-122.4094);
        a2.setDestinationHospital("St. Helena Medical Center");
        a2.setDestinationLat(37.7749);
        a2.setDestinationLng(-122.4194);
        a2.setEtaMinutes(14);
        ambulanceTrackingRepository.save(a2);
    }

    private void seedKnowledgeArticles() {
        record ArticleSeed(String title, String category, String authors, String journal,
                            LocalDate date, String summary, String tags) {}

        List<ArticleSeed> seeds = List.of(
                new ArticleSeed(
                        "Enhanced Recovery Protocols After Cardiac Surgery",
                        "CARDIOLOGY", "R. Patel, S. Chen", "Journal of Cardiothoracic Research",
                        LocalDate.of(2025, 3, 14),
                        "Reviews enhanced-recovery-after-surgery (ERAS) protocols and their association with shorter hospital stays following cardiac procedures.",
                        "cardiac,recovery,ERAS"),
                new ArticleSeed(
                        "Minimally Invasive Approaches in Orthopedic Joint Replacement",
                        "ORTHOPEDICS", "M. Okafor, L. Schmidt", "International Orthopedic Review",
                        LocalDate.of(2025, 6, 2),
                        "Compares outcomes of minimally invasive versus traditional approaches for knee and hip replacement surgery.",
                        "orthopedics,joint replacement,minimally invasive"),
                new ArticleSeed(
                        "Antibiotic Stewardship in Post-Surgical Infection Prevention",
                        "GENERAL_SURGERY", "A. Fernandez, T. Nakamura", "Surgical Infection Quarterly",
                        LocalDate.of(2024, 11, 20),
                        "Examines antibiotic stewardship programs and their impact on post-operative infection rates across general surgery departments.",
                        "infection,antibiotics,post-operative"),
                new ArticleSeed(
                        "Telemedicine Adoption in Pre-Operative Consultations",
                        "GENERAL_SURGERY", "K. Rao, J. Williams", "Digital Health & Surgery",
                        LocalDate.of(2025, 1, 9),
                        "Surveys the adoption of telemedicine for pre-operative consultations and patient satisfaction outcomes.",
                        "telemedicine,pre-operative,digital health"),
                new ArticleSeed(
                        "Risk Stratification Models for Surgical Readmission",
                        "GENERAL_SURGERY", "P. Nair, D. Okonkwo", "Journal of Patient Safety",
                        LocalDate.of(2024, 9, 5),
                        "Reviews statistical risk-stratification approaches used to predict 30-day readmission after major surgery.",
                        "readmission,risk,patient safety"),
                new ArticleSeed(
                        "Advances in Neuro-Navigation for Tumor Resection",
                        "NEUROSURGERY", "S. Müller, V. Singh", "Neurosurgical Frontiers",
                        LocalDate.of(2025, 4, 28),
                        "Discusses image-guided neuro-navigation systems and their role in improving precision during tumor resection.",
                        "neurosurgery,navigation,tumor")
        );

        for (ArticleSeed s : seeds) {
            KnowledgeArticle article = new KnowledgeArticle();
            article.setTitle(s.title());
            article.setCategory(s.category());
            article.setAuthors(s.authors());
            article.setSourceJournal(s.journal());
            article.setPublishedDate(s.date());
            article.setSummary(s.summary());
            article.setTags(s.tags());
            knowledgeArticleRepository.save(article);
        }
    }

    private void seedCollaborationPosts() {
        CollaborationPost p1 = new CollaborationPost();
        p1.setAuthorName("Dr. Priya Nair");
        p1.setHospitalName("Bengaluru City General Hospital");
        p1.setCountry("India");
        p1.setPostType("CASE_SHARE");
        p1.setTitle("Unusual presentation in post-cardiac-surgery recovery");
        p1.setBody("Sharing an anonymized case of delayed but complete recovery following a complex cardiac procedure - interested in how other centers approach extended monitoring in similar cases.");
        collaborationPostRepository.save(p1);

        CollaborationPost p2 = new CollaborationPost();
        p2.setAuthorName("Dr. James Okafor");
        p2.setHospitalName("St. Helena Medical Center");
        p2.setCountry("USA");
        p2.setPostType("DISCUSSION");
        p2.setTitle("Protocol comparison for knee replacement rehab timelines");
        p2.setBody("Opening a discussion on rehab timeline variation we've observed across different orthopedic protocols - curious what other hospitals are seeing.");
        collaborationPostRepository.save(p2);

        CollaborationPost p3 = new CollaborationPost();
        p3.setAuthorName("Dr. Lucia Fernández");
        p3.setHospitalName("Hospital Universitario La Paz");
        p3.setCountry("Spain");
        p3.setPostType("CASE_SHARE");
        p3.setTitle("International case-sharing: laparoscopic technique adaptation");
        p3.setBody("Sharing an anonymized summary of how we adapted a laparoscopic technique for a patient with prior abdominal surgery history.");
        collaborationPostRepository.save(p3);
    }
}

