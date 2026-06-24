package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.Report;
import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.PatientRepository;
import com.surgicalcopilot.repository.ReportRepository;
import com.surgicalcopilot.service.ImageAnalysisService;
import com.surgicalcopilot.service.MedicalTermSimplifierService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private static final String UPLOAD_DIR = "uploads/reports";

    private final ReportRepository reportRepository;
    private final PatientRepository patientRepository;
    private final ImageAnalysisService imageAnalysisService;
    private final MedicalTermSimplifierService simplifierService;

    public ReportController(ReportRepository reportRepository,
                             PatientRepository patientRepository,
                             ImageAnalysisService imageAnalysisService,
                             MedicalTermSimplifierService simplifierService) {
        this.reportRepository = reportRepository;
        this.patientRepository = patientRepository;
        this.imageAnalysisService = imageAnalysisService;
        this.simplifierService = simplifierService;
    }

    @GetMapping("/patient/{patientId}")
    public List<Report> getByPatient(@PathVariable Long patientId) {
        return reportRepository.findByPatientId(patientId);
    }

    @PostMapping("/upload")
    public Report upload(@RequestParam("patientId") Long patientId,
                          @RequestParam("reportType") String reportType,
                          @RequestParam("file") MultipartFile file,
                          @RequestParam(value = "findingsSummary", required = false) String findingsSummary) throws IOException {

        var patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id " + patientId));

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String safeName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path destination = uploadPath.resolve(safeName);
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        Report report = new Report();
        report.setPatient(patient);
        report.setReportType(reportType);
        report.setFileName(file.getOriginalFilename());
        report.setFilePath(destination.toString());
        report.setFindingsSummary(findingsSummary);
        report.setSimplifiedExplanation(simplifierService.simplify(findingsSummary));
        report.setAiFindingsJson(imageAnalysisService.generateSimulatedFindingsJson(reportType));
        report.setAiAnalysisStatus("SIMULATED_COMPLETE");

        return reportRepository.save(report);
    }

    @GetMapping("/{id}")
    public Report getOne(@PathVariable Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id " + id));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        reportRepository.delete(getOne(id));
    }
}
