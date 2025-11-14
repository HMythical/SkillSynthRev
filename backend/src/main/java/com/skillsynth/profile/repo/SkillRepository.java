package com.skillsynth.profile.repo;

import com.skillsynth.profile.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
}
