package com.surgicalcopilot.service;

import com.surgicalcopilot.entity.VitalSign;
import org.springframework.stereotype.Service;

import java.util.Random;

/**
 * Generates SIMULATED vitals data to demo the Remote Patient Monitoring /
 * Wearable Device Integration UI. No real device is connected.
 */
@Service
public class VitalsSimulationService {

    private final Random random = new Random();

    public VitalSign generateForPatient(com.surgicalcopilot.entity.Patient patient) {
        VitalSign v = new VitalSign();
        v.setPatient(patient);
        v.setHeartRateBpm(60 + random.nextInt(40));
        v.setSystolicBp(105 + random.nextInt(30));
        v.setDiastolicBp(65 + random.nextInt(20));
        v.setTemperatureCelsius(round1(36.2 + random.nextDouble() * 1.3));
        v.setOxygenSaturationPct(94 + random.nextInt(6));
        v.setRespiratoryRate(12 + random.nextInt(8));
        v.setDeviceSource("SIMULATED_WEARABLE");
        return v;
    }

    private double round1(double v) {
        return Math.round(v * 10) / 10.0;
    }
}
