package com.skillsynth.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;

/**
 * Issues and verifies HMAC256 JWTs using Auth0 java-jwt.
 * Exposes helpers used by JwtAuthFilter and AuthService.
 */
@Service
public class JwtService {

  private final Algorithm algorithm;
  private final long expiresMinutes;

  public JwtService(
      @Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.expiresMinutes:120}") long expiresMinutes
  ) {
    // secret must be sufficiently long for HMAC256
    this.algorithm = Algorithm.HMAC256(secret);
    this.expiresMinutes = expiresMinutes;
  }

  /** Mint a token with subject=email and some helpful claims. */
  public String issue(Long userId, String email, String role) {
    Instant now = Instant.now();
    return JWT.create()
        .withSubject(email)                          // Authentication.getName() -> email
        .withClaim("uid", userId)
        .withClaim("role", role)
        .withIssuedAt(Date.from(now))
        .withExpiresAt(Date.from(now.plusSeconds(expiresMinutes * 60)))
        .sign(algorithm);
  }

  /** Verify signature/exp and return the decoded JWT. Throws if invalid/expired. */
  public DecodedJWT verify(String token) {
    return JWT.require(algorithm).build().verify(token);
  }

  /** Convenience helpers (they call verify(token) under the hood). */
  public String parseEmail(String token) {
    return verify(token).getSubject();
  }

  public String parseRole(String token) {
    return verify(token).getClaim("role").asString();
  }

  public Long parseUserId(String token) {
    return verify(token).getClaim("uid").asLong();
  }
}
