import "./GroupsPage.css";

function GroupsPage() {
  // TODO: wire this up to backend later.
  // Example shape:
  // const { myGroups, invites, openGroups } = useGroupsData();

  return (
    <div className="GroupsPage">
      {/* PAGE HEADER STRIP */}
      <section className="ConsoleHeader GroupsHeaderStrip">
        <div className="ConsoleHeader-left">
          <h2 className="ConsoleTitle">GROUPS</h2>

          <div className="ConsoleSub">
            <span className="ConsoleSubLabel">your groups</span>
            {/* TODO: replace with myGroups.length */}
            <span className="ConsoleSubValue ConsoleGlare">--</span>

            <span className="ConsoleDivider">/</span>

            <span className="ConsoleSubLabel">invites</span>
            {/* TODO: replace with invites.length, and maybe status */}
            <span className="ConsoleSubValue">-- pending</span>
          </div>
        </div>

        <div className="ConsoleHeader-right">
          {/* TODO: ACCESS level could come from user role (member / admin / officer) */}
          <span className="ConsolePill ConsolePill-stable">
            ACCESS: MEMBER
          </span>

          <span className="ConsolePill ConsolePill-rev">REV 0.2.0</span>
        </div>
      </section>

      {/* ACTION BAR: CREATE / JOIN */}
      <section className="GroupsActionsBar">
        <div className="GroupsIntroText">
          <div className="IntroTitle">Find your squad</div>
          <div className="IntroBody">
            Team up for CTFs, ship features, or just learn together.
          </div>
        </div>

        <div className="GroupsActionButtons">
          {/* TODO: hook these buttons to modals or routes */}
          <button className="GroupsMainBtn">
            <span className="GroupsMainBtnMain">+ Create Group</span>
            <span className="GroupsMainBtnSub">start a new unit</span>
          </button>

          <button className="GroupsGhostBtn">
            <span className="GroupsGhostBtnMain">Browse Open Groups</span>
            <span className="GroupsGhostBtnSub">see who needs help</span>
          </button>
        </div>
      </section>

      {/* GRID OF GROUP CARDS */}
      <section className="GroupsGrid">
        {/*
          TODO: Map over real groups here.
          Example:

          {openGroups.map(group => (
            <div key={group.id} className="GroupCard">
              <div className="GroupCardHeader">
                <div className="GroupTopline">
                  <div className="GroupTitle">{group.name}</div>
                  <div className="GroupBadges">
                    {group.tags.map(tag => (
                      <span
                        key={tag.label}
                        className={`GroupStatusTag ${tag.colorClass}`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="GroupMetaRow">
                  <div className="GroupMetaItem">
                    <span className="MetaLabel">Focus</span>
                    <span className="MetaValue">{group.focus}</span>
                  </div>

                  <div className="GroupMetaItem">
                    <span className="MetaLabel">Members</span>
                    <span className="MetaValue">{group.memberCount} active</span>
                  </div>
                </div>

                <div className="GroupHeaderBar" />
              </div>

              <div className="GroupBody">
                <p className="GroupDesc">{group.description}</p>

                <ul className="GroupNeedsList">
                  {group.needs.map(need => (
                    <li key={need.role}>
                      <span className="NeedRole">{need.role}</span>
                      <span className={`NeedStatus ${need.statusColor}`}>
                        {need.statusText}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="GroupFooterRow">
                <button className="CardAction SmallAction">
                  View Group →
                </button>

                {group.joinable ? (
                  <button className="CardAction GhostAction">
                    Request Invite
                  </button>
                ) : (
                  <button className="CardAction GhostAction">
                    Offer Help
                  </button>
                )}
              </div>
            </div>
          ))}
        */}

        {/* Empty/default state when no groups are loaded yet */}
        <div className="GroupCard">
          <div className="GroupCardHeader">
            <div className="GroupTopline">
              <div className="GroupTitle">No groups loaded</div>
              <div className="GroupBadges">
                <span className="GroupStatusTag Blue">standby</span>
              </div>
            </div>

            <div className="GroupMetaRow">
              <div className="GroupMetaItem">
                <span className="MetaLabel">Focus</span>
                <span className="MetaValue">--</span>
              </div>

              <div className="GroupMetaItem">
                <span className="MetaLabel">Members</span>
                <span className="MetaValue">--</span>
              </div>
            </div>

            <div className="GroupHeaderBar" />
          </div>

          <div className="GroupBody">
            <p className="GroupDesc">
              Your groups / invites / open teams from backend will render here.
              Hook this page up to your API and populate cards for each group.
            </p>

            <ul className="GroupNeedsList">
              <li>
                <span className="NeedRole">role</span>
                <span className="NeedStatus Green">status</span>
              </li>
            </ul>
          </div>

          <div className="GroupFooterRow">
            <button className="CardAction SmallAction" disabled>
              View Group →
            </button>
            <button className="CardAction GhostAction" disabled>
              Request Invite
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GroupsPage;
