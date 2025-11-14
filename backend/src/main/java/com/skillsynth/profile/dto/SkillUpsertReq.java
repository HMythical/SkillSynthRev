package com.skillsynth.profile.dto;

public record SkillUpsertReq(
    Long id,          // null for new skills
    String name,
    String level      // e.g. "learning", "confident", "expert"
) {}
