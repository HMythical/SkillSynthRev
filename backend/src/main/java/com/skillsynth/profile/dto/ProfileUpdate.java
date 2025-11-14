package com.skillsynth.profile.dto;

import java.util.List;

public record ProfileUpdate(
    Long id,
    String displayName,          // updates User.displayName
    String bio,
    String track,
    String availability,
    List<SkillUpsertReq> skills  // optional; can be null
) {}
