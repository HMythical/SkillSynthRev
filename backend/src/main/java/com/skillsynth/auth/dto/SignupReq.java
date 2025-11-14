package com.skillsynth.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupReq(
  @NotBlank @Size(min = 2, max = 80) String displayName,
  @NotBlank @Email String email,
  @NotBlank @Size(min = 6, max = 200) String password
) {}
