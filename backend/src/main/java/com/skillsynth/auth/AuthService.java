package com.skillsynth.auth;

import com.skillsynth.auth.dto.AuthRes;
import com.skillsynth.auth.dto.LoginReq;
import com.skillsynth.auth.dto.SignupReq;
import com.skillsynth.auth.entity.User;
import com.skillsynth.auth.repo.UserRepository;
import com.skillsynth.security.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtService jwt) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwt = jwt;
    }

    // ------------------------------------------------------------
    // SIGNUP
    // ------------------------------------------------------------
    @Transactional
    public AuthRes signup(SignupReq req) {
        if (users.existsByEmail(req.email())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already in use");
        }

        User user = new User();
        user.setEmail(req.email().trim().toLowerCase());

        // Store encoded password
        user.setPasswordHash(passwordEncoder.encode(req.password()));

        // Store display name
        user.setDisplayName(req.displayName().trim());

        users.save(user);

        // Generate auth token
        String token = jwt.issue(user.getId(), user.getEmail(), "USER");

        return new AuthRes(token, toDto(user));
    }

    // ------------------------------------------------------------
    // LOGIN
    // ------------------------------------------------------------
    public AuthRes login(LoginReq req) {
        final String email = req.email().trim().toLowerCase();

        User u = users.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bad credentials")
                );

        // Compare password hash correctly
        if (!passwordEncoder.matches(req.password(), u.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bad credentials");
        }

        String token = jwt.issue(u.getId(), u.getEmail(), "USER");

        return new AuthRes(token, toDto(u));
    }

    // ------------------------------------------------------------
    // CURRENT USER LOOKUP
    // ------------------------------------------------------------
    public AuthRes.UserDto meById(Long userId) {
        User u = users.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found")
                );

        return toDto(u);
    }

    public AuthRes.UserDto meByEmail(String email) {
        User u = users.findByEmail(email.toLowerCase())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found")
                );

        return toDto(u);
    }

    // ------------------------------------------------------------
    // PASSWORD RESET STUBS
    // ------------------------------------------------------------
    @Transactional
    public void forgotPassword(String email) {
        // TODO implement
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        // TODO implement
    }

    // ------------------------------------------------------------
    // DTO CONVERTER
    // ------------------------------------------------------------
    private static AuthRes.UserDto toDto(User u) {
        return new AuthRes.UserDto(
                u.getId(),
                u.getDisplayName(),
                u.getEmail(),
                u.getCreatedAt()
        );
    }
}
