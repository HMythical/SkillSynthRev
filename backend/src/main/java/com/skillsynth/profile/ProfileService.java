package com.skillsynth.profile;

import com.skillsynth.auth.entity.User;
import com.skillsynth.auth.repo.UserRepository;
import com.skillsynth.profile.dto.ProfileUpdate;
import com.skillsynth.profile.dto.SkillUpsertReq;
import com.skillsynth.profile.entity.Profile;
import com.skillsynth.profile.entity.Skill;
import com.skillsynth.profile.repo.ProfileRepository;
import com.skillsynth.profile.repo.SkillRepository;

import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProfileService {

    private final UserRepository userRepo;
    private final ProfileRepository profileRepo;
    private final SkillRepository skillRepo;

    public ProfileService(
            UserRepository userRepo,
            ProfileRepository profileRepo,
            SkillRepository skillRepo
    ) {
        this.userRepo = userRepo;
        this.profileRepo = profileRepo;
        this.skillRepo = skillRepo;
    }

    // --------------------------------------------------------
    // HELPERS
    // --------------------------------------------------------

    private User getUserOrThrow(Long userId) {
        return userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Profile getOrCreateProfile(Long userId) {
        return profileRepo.findByUserId(userId)
                .orElseGet(() -> {
                    Profile p = new Profile();
                    p.setUserId(userId);
                    p.setDisplayName(userRepo.findById(userId).map(User::getDisplayName).orElse(""));
                    p.setBio(null);
                    p.setTrack(null);
                    p.setAvailability(null);
                    p.setSkills(new ArrayList<>());
                    return profileRepo.save(p);
                });
    }

    // --------------------------------------------------------
    // GET PROFILE
    // --------------------------------------------------------

    @Transactional
    public ProfileUpdate getProfile(Long userId) {
        User user = getUserOrThrow(userId);
        Profile profile = getOrCreateProfile(userId);

        List<SkillUpsertReq> skillsDto = profile.getSkills().stream()
                .map(sk -> new SkillUpsertReq(sk.getId(), sk.getName(), sk.getLevel()))
                .toList();

        return new ProfileUpdate(
                profile.getId(),
                user.getDisplayName(),
                profile.getBio(),
                profile.getTrack(),
                profile.getAvailability(),
                skillsDto
        );
    }

    // --------------------------------------------------------
    // UPDATE PROFILE
    // --------------------------------------------------------

    @Transactional
    public ProfileUpdate updateProfile(Long userId, ProfileUpdate update) {
        User user = getUserOrThrow(userId);
        Profile profile = getOrCreateProfile(userId);

        // update displayName stored on the User
        if (update.displayName() != null && !update.displayName().isBlank()) {
            String clean = update.displayName().trim();
            user.setDisplayName(clean);
            profile.setDisplayName(clean);
        }

        profile.setBio(update.bio());
        profile.setTrack(update.track());
        profile.setAvailability(update.availability());

        // replace entire skill list
        profile.getSkills().clear();

        if (update.skills() != null) {
            for (SkillUpsertReq req : update.skills()) {
                if (req.name() == null || req.name().isBlank()) continue;

                Skill s = new Skill();
                s.setName(req.name().trim());
                s.setLevel((req.level() == null || req.level().isBlank()) ? "learning" : req.level());
                s.setProfile(profile);
                profile.getSkills().add(s);
            }
        }

        profileRepo.save(profile);
        userRepo.save(user);

        // return updated DTO
        List<SkillUpsertReq> skillsDto = profile.getSkills().stream()
                .map(s -> new SkillUpsertReq(s.getId(), s.getName(), s.getLevel()))
                .toList();

        return new ProfileUpdate(
                profile.getId(),
                user.getDisplayName(),
                profile.getBio(),
                profile.getTrack(),
                profile.getAvailability(),
                skillsDto
        );
    }

    // --------------------------------------------------------
    // CREATE A SINGLE SKILL  (THIS IS WHAT YOU WERE MISSING)
    // --------------------------------------------------------

    @Transactional
    public SkillUpsertReq addSkill(Long userId, SkillUpsertReq req) {
        if (req.name() == null || req.name().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Skill name required");
        }

        Profile profile = getOrCreateProfile(userId);

        Skill s = new Skill();
        s.setName(req.name().trim());
        s.setLevel((req.level() == null || req.level().isBlank()) ? "learning" : req.level().trim());
        s.setProfile(profile);

        Skill saved = skillRepo.saveAndFlush(s);

        profile.getSkills().add(saved);
        profileRepo.save(profile);

        return new SkillUpsertReq(saved.getId(), saved.getName(), saved.getLevel());
    }

    // --------------------------------------------------------
    // DELETE SKILL
    // --------------------------------------------------------

    @Transactional
    public void deleteSkill(Long userId, Long skillId) {
        Profile profile = profileRepo.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        Skill s = profile.getSkills().stream()
                .filter(sk -> sk.getId().equals(skillId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found"));

        profile.getSkills().remove(s);
        profileRepo.save(profile); // orphanRemoval handles the DB delete
    }
}
