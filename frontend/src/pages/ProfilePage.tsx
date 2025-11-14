import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { useAuth } from "../state/AuthContext";

/* TRACK OPTIONS */
type TrackOption =
  | "frontend"
  | "backend"
  | "fullstack"
  | "mobile"
  | "ai-ml"
  | "data"
  | "cloud"
  | "devops"
  | "systems"
  | "embedded"
  | "gamedev"
  | "security"
  | "research"
  | "uiux"
  | "project"
  | "product"
  | "infra"
  | "sre"
  | "robotics"
  | "vr-ar"
  | "quant";

/* AVAILABILITY OPTIONS */
type AvailabilityOption =
  | "1hr"
  | "1-2hr"
  | "2-4hr"
  | "4-6hr"
  | "weekends"
  | "variable"
  | "none";

type SkillDto = {
  id?: number;
  name: string;
  level: string;
};

type ProfileDto = {
  id?: number;
  displayName?: string | null;
  bio?: string | null;
  track?: string | null;
  availability?: string | null;
  skills?: SkillDto[];
};

function ProfilePage() {
  const { user, token, logout, authedJsonFetch, refreshMe } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const [track, setTrack] = useState<TrackOption>("fullstack");
  const [availability, setAvailability] =
    useState<AvailabilityOption>("1-2hr");

  const [skills, setSkills] = useState<SkillDto[]>([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("learning");

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteCode, setDeleteCode] = useState("");
  const [serverDeleteCode] = useState(() =>
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const handle =
    displayName ||
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : "guest");

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toISOString().slice(0, 10)
    : "—";

  // ===============================
  // LOAD PROFILE + GEO LOCATION
  // ===============================
  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        // Load profile
        const profile = await authedJsonFetch<ProfileDto>("/profile", {
          method: "GET",
        });

        if (profile.displayName) setDisplayName(profile.displayName);
        if (profile.bio) setBio(profile.bio);
        if (profile.track) setTrack(profile.track as TrackOption);
        if (profile.availability)
          setAvailability(profile.availability as AvailabilityOption);
        if (profile.skills) setSkills(profile.skills);

        // GEO UPDATE
        try {
          const geoRes = await fetch("https://ipapi.co/json/");
          const geo = await geoRes.json();
          const formatted = `${geo.city}, ${geo.region}, ${geo.country_name}`;

          await authedJsonFetch("/auth/geo", {
            method: "PUT",
            body: JSON.stringify({ geo: formatted }),
          });

          await refreshMe();
        } catch (err) {
          console.error("Geo update failed", err);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    })();
  }, [token]);

  // ===============================
  // SAVE PROFILE
  // ===============================
  const onProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        displayName,
        bio,
        track,
        availability,
      };

      const updated = await authedJsonFetch<ProfileDto>("/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      await refreshMe();
      if (updated.skills) setSkills(updated.skills);
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  };

  // ===============================
  // ADD SKILL
  // ===============================
const onAddSkill = async () => {
  if (!newSkillName.trim()) return;

  try {
    const req = {
      name: newSkillName.trim(),
      level: newSkillLevel,
    };

    const created = await authedJsonFetch<SkillDto>("/profile/skills", {
      method: "POST",
      body: req,
    });

    // Fix: create a temporary unique ID if backend returned null
    const fixed = {
      ...created,
      id: created.id ?? Date.now(), // fallback unique ID
    };

    setSkills(prev => [...prev, created]);

    setNewSkillName("");
    setNewSkillLevel("learning");
  } catch (err) {
    console.error("Failed to add skill", err);
  }
};

  // ===============================
  // DELETE SKILL
  // ===============================
  const onDeleteSkill = async (id: number) => {
    try {
      await authedJsonFetch(`/profile/skills/${id}`, {
        method: "DELETE",
      });

      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete skill", err);
    }
  };

  // ===============================
  // DELETE ACCOUNT
  // ===============================
  const onConfirmDelete = async () => {
    if (deleteCode !== serverDeleteCode) {
      alert("Incorrect confirmation code.");
      return;
    }

    try {
      await authedJsonFetch("/profile/delete-account", {
        method: "DELETE",
      });
      logout();
      navigate("/");
    } catch (err) {
      console.error("Account delete failed", err);
    }
  };

  // ===============================
  // AVATAR
  // ===============================
  const onClickUpdateAvatar = () => {
    avatarInputRef.current?.click();
  };

  const onAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className={`ProfilePage ${deleteModal ? "Blurred" : ""}`}>

      {/* DELETE ACCOUNT MODAL */}
      {deleteModal && (
        <div className="DeleteOverlay">
          <div className="DeleteModal">
            <h2 className="DeleteModalTitle">DELETE ACCOUNT</h2>

            <p className="DeleteModalText">
              This action is permanent.<br />
              Type the following code to continue:
            </p>

            <div className="DeleteCodeBox">
              {serverDeleteCode}
            </div>

            <input
              className="DeleteModalInput"
              placeholder="Enter code"
              value={deleteCode}
              onChange={(e) =>
                setDeleteCode(e.target.value.toUpperCase())
              }
            />

            <div className="DeleteActions">
              <button className="DeleteConfirmBtn" onClick={onConfirmDelete}>
                Delete Permanently
              </button>

              <button
                className="DeleteCancelBtn"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <section className="ConsoleHeader ProfileHeaderStrip">
        <div className="ConsoleHeader-left">
          <h2 className="ConsoleTitle">PROFILE</h2>
          <div className="ConsoleSub">
            <span className="ConsoleSubLabel">handle</span>
            <span className="ConsoleSubValue ConsoleGlare">{handle}</span>
          </div>
        </div>

        <div className="ConsoleHeader-right">
          <span className="ConsolePill ConsolePill-stable">
            STATUS: {user ? "ONLINE" : "SIGNED OUT"}
          </span>
          <span className="ConsolePill ConsolePill-rev">REV 0.3.0</span>
        </div>
      </section>

      {/* GRID */}
      <section className="ProfileGrid">

        {/* LEFT PANEL */}
        <div className="ProfileCard IdentityCard">

          <div className="ProfileAvatarBlock">
            <div className="AvatarOuter">
              <div className="AvatarCircle">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <>
                    <div className="AvatarHead" />
                    <div className="AvatarBody" />
                  </>
                )}
              </div>
            </div>

            <div className="HandleBlock">
              <div className="HandleName">{handle}</div>
              <div className="HandleTag">SOSE / MEMBER</div>
            </div>
          </div>

          <input
            type="file"
            ref={avatarInputRef}
            accept="image/png,image/jpeg"
            style={{ display: "none" }}
            onChange={onAvatarChange}
          />

          <div className="IDMeta">
            <div className="IDRow">
              <div className="IDLabel">Email</div>
              <div className="IDValue">{user?.email}</div>
            </div>

            <div className="IDRow">
              <div className="IDLabel">Member Since</div>
              <div className="IDValue">{memberSince}</div>
            </div>

            <div className="IDRow">
              <div className="IDLabel">Geo Location</div>
              <div className="IDValue">{user?.geo ?? "—"}</div>
            </div>
          </div>

          <div className="IDActions">
            <button
              className="CardAction WideAction"
              onClick={onClickUpdateAvatar}
            >
              Update Avatar
            </button>

            <button
              className="DeleteAccountBtn"
              onClick={() => setDeleteModal(true)}
            >
              Delete Account
            </button>

            <button
              className="CardAction WideAction"
              onClick={() => {
                logout();
                navigate("/auth");
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="ProfileRightCol">

          {/* ABOUT YOU */}
          <div className="ProfileCard EditBlock">
            <div className="CardHeader">
              <div>
                <div className="CardTitle">About You</div>
                <div className="CardMeta">basic profile</div>
              </div>
              <div className="CardHeaderBar" />
            </div>

            <form className="FormGrid" onSubmit={onProfileSubmit}>
              <div className="FormField">
                <label className="FormLabel">Display Name</label>
                <input
                  className="FormInput"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="FormField">
                <label className="FormLabel">Bio / Focus</label>
                <textarea
                  className="FormTextarea"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="FormFieldInline">
                <div className="FormField Half">
                  <label className="FormLabel">Track</label>
                  <select
  className="FormSelect"
  value={track}
  onChange={(e) => setTrack(e.target.value as TrackOption)}
>
  <optgroup label="Software Engineering">
    <option value="frontend">Frontend</option>
    <option value="backend">Backend</option>
    <option value="fullstack">Fullstack</option>
    <option value="mobile">Mobile (iOS/Android)</option>
    <option value="systems">Systems / Low-level</option>
    <option value="embedded">Embedded</option>
    <option value="infra">Infrastructure</option>
    <option value="sre">SRE (Site Reliability Engineering)</option>
  </optgroup>

  <optgroup label="Emerging Tech">
    <option value="ai-ml">AI / ML</option>
    <option value="data">Data Science</option>
    <option value="robotics">Robotics</option>
    <option value="vr-ar">VR / AR</option>
    <option value="quant">Quant / High-performance</option>
  </optgroup>

  <optgroup label="Creative + Product">
    <option value="uiux">UI/UX Design</option>
    <option value="product">Product</option>
    <option value="project">Project</option>
    <option value="gamedev">Game Development</option>
  </optgroup>

  <optgroup label="Security & Research">
    <option value="security">Cybersecurity</option>
    <option value="research">Research</option>
  </optgroup>
</select>

                </div>

                <div className="FormField Half">
                  <label className="FormLabel">Availability</label>
                  <select
                    className="FormSelect"
                    value={availability}
                    onChange={(e) =>
                      setAvailability(
                        e.target.value as AvailabilityOption
                      )
                    }
                  >
                    <option value="1hr">~1 hr/day</option>
                    <option value="1-2hr">1–2 hrs/day</option>
                    <option value="2-4hr">2–4 hrs/day</option>
                    <option value="4-6hr">4–6 hrs/day</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="variable">Varies Weekly</option>
                    <option value="none">Not Available</option>
                  </select>
                </div>
              </div>

              <button className="CardAction" type="submit">
                Save Profile →
              </button>
            </form>
          </div>

          {/* SKILLS */}
          <div className="ProfileCard EditBlock">
            <div className="CardHeader">
              <div>
                <div className="CardTitle">Skills</div>
                <div className="CardMeta">public tags</div>
              </div>
              <div className="CardHeaderBar" />
            </div>

            <div className="SkillAddRow">
              <input
                className="FormInput"
                placeholder="ex: React, Python, Networking, etc."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
              />

              <select
                className="FormSelect"
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
              >
                <option value="learning">Learning</option>
                <option value="competent">Competent</option>
                <option value="proficient">Proficient</option>
                <option value="expert">Expert</option>
              </select>

              <button
                className="AddSkillBtn"
                type="button"
                onClick={onAddSkill}
              >
                Add +
              </button>
            </div>

            {/* prettier skill UI */}
<div className="SkillMatrix">
  {skills.map((skill) => (
    <div key={skill.id} className="SkillCard">
      <div className="SkillCardTop">
        <span className="SkillCardName">{skill.name}</span>
        <button
          className="SkillCardDelete"
          onClick={() => onDeleteSkill(skill.id!)}
        >
          ✕
        </button>
      </div>

      <div className={`SkillBadge ${skill.level}`}>
        {skill.level}
      </div>
    </div>
  ))}
</div>


          </div>

        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
