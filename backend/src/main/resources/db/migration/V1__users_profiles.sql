CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    display_name VARCHAR(100),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    display_name VARCHAR(255),
    bio TEXT,
    track VARCHAR(255),
    availability VARCHAR(255),
    CONSTRAINT fk_profiles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);

CREATE TABLE profiles_skills (
    profile_id BIGINT NOT NULL,
    skills VARCHAR(255),
    CONSTRAINT fk_profile_skills
        FOREIGN KEY (profile_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE
);

CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50),

    CONSTRAINT fk_skills_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
