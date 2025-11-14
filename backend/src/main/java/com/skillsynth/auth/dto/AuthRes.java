package com.skillsynth.auth.dto;

import java.time.Instant;

public record AuthRes(String token, UserDto user) {
  public static record UserDto(Long id, String displayName, String email, Instant createdAt) {}
}
