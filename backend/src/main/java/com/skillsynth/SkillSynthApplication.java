package com.skillsynth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.skillsynth")
public class SkillSynthApplication {
  public static void main(String[] args) {
    SpringApplication.run(SkillSynthApplication.class, args);
  }
}
