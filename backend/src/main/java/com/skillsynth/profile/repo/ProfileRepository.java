package com.skillsynth.profile.repo;

import com.skillsynth.profile.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByUserId(Long userId);

    // 🔥 Add this so deleteByUserId() exists
    void deleteByUserId(Long userId);
}
