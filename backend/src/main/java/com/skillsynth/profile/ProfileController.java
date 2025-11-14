package com.skillsynth.profile;

import com.skillsynth.profile.dto.ProfileUpdate;
import com.skillsynth.profile.dto.SkillUpsertReq;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    private Long uid(Authentication auth) {
        return (Long) auth.getPrincipal();
    }

    @GetMapping
    public ResponseEntity<ProfileUpdate> getProfile(Authentication auth) {
        return ResponseEntity.ok(profileService.getProfile(uid(auth)));
    }

    @PutMapping
    public ResponseEntity<ProfileUpdate> updateProfile(
            Authentication auth,
            @RequestBody ProfileUpdate update
    ) {
        return ResponseEntity.ok(profileService.updateProfile(uid(auth), update));
    }

    // --- Add Skill ---
    @PostMapping("/skills")
    public ResponseEntity<SkillUpsertReq> addSkill(
            Authentication auth,
            @RequestBody SkillUpsertReq req
    ) {
        SkillUpsertReq saved = profileService.addSkill(uid(auth), req);
        return ResponseEntity.ok(saved);
    }

    // --- Delete Skill ---
    @DeleteMapping("/skills/{skillId}")
    public ResponseEntity<Void> deleteSkill(
            Authentication auth,
            @PathVariable Long skillId
    ) {
        profileService.deleteSkill(uid(auth), skillId);
        return ResponseEntity.noContent().build();
    }
}
