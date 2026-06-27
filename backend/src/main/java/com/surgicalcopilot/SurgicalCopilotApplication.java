package com.surgicalcopilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class SurgicalCopilotApplication {

    public static void main(String[] args) {
        SpringApplication.run(SurgicalCopilotApplication.class, args);
        System.out.println(
            "\n============================================================\n" +
            " Global AI Surgical Copilot Ecosystem - Backend running\n" +
            " API base: https://surgical-copilot-ai-3.onrender.com/api\n" +
            " DEMO MODE: outputs are simulated, not clinically validated\n" +
            "============================================================\n");
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOriginPatterns("*")
                    .allowedMethods("*")
                    .allowedHeaders("*");
            }
        };
    }
}
