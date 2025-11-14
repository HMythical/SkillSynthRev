package com.skillsynth.auth;

import com.skillsynth.auth.dto.AuthRes;
import com.skillsynth.auth.dto.LoginReq;
import com.skillsynth.auth.dto.SignupReq;
import com.skillsynth.auth.entity.User;
import com.skillsynth.auth.repo.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepo;

    public AuthController(AuthService authService, UserRepository userRepo) {
        this.authService = authService;
        this.userRepo = userRepo;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthRes> signup(@RequestBody SignupReq req) {
        return ResponseEntity.ok(authService.signup(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthRes> login(@RequestBody LoginReq req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthRes.UserDto> me(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();  // from JwtAuthFilter
        return ResponseEntity.ok(authService.meById(userId));
    }

    // -----------------------------------------------------
    // UPDATE GEO LOCATION
    // -----------------------------------------------------
    @PutMapping("/geo")
    public void updateGeo(
            @RequestBody Map<String, String> body,
            Authentication auth
    ) {
        Long userId = (Long) auth.getPrincipal(); // extract ID from JWT
        String geo = body.get("geo");

        if (geo == null || geo.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing geo");
        }

        User u = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        u.setGeo(geo);
        userRepo.save(u);
    }
}
