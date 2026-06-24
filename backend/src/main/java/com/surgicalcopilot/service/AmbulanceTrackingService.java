package com.surgicalcopilot.service;

import com.surgicalcopilot.entity.AmbulanceTracking;
import org.springframework.stereotype.Service;

import java.util.Random;

/**
 * Simulates ambulance movement toward its destination for demo purposes.
 * No real GPS/telematics integration.
 */
@Service
public class AmbulanceTrackingService {

    private final Random random = new Random();

    public void advance(AmbulanceTracking ambulance) {
        if (ambulance.getDestinationLat() == null || ambulance.getDestinationLng() == null
                || ambulance.getCurrentLat() == null || ambulance.getCurrentLng() == null) {
            return;
        }

        double latDiff = ambulance.getDestinationLat() - ambulance.getCurrentLat();
        double lngDiff = ambulance.getDestinationLng() - ambulance.getCurrentLng();

        double step = 0.15 + random.nextDouble() * 0.15; // move 15-30% closer each call
        ambulance.setCurrentLat(ambulance.getCurrentLat() + latDiff * step);
        ambulance.setCurrentLng(ambulance.getCurrentLng() + lngDiff * step);

        if (ambulance.getEtaMinutes() != null && ambulance.getEtaMinutes() > 0) {
            ambulance.setEtaMinutes(Math.max(0, ambulance.getEtaMinutes() - 1 - random.nextInt(2)));
        }

        double distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        if (distance < 0.01 || (ambulance.getEtaMinutes() != null && ambulance.getEtaMinutes() <= 0)) {
            ambulance.setStatus("ARRIVED");
            ambulance.setCurrentLat(ambulance.getDestinationLat());
            ambulance.setCurrentLng(ambulance.getDestinationLng());
        } else if ("DISPATCHED".equals(ambulance.getStatus())) {
            ambulance.setStatus("EN_ROUTE");
        }
    }
}
