export default function SettingMenu() {
  return (
    <div className="settings-front">
      <h1>Notifications</h1>
      <div className="name-card">
        <div className="left-section">
          <span className="label-notifications">Daily notifications</span>
          <span className="name">
            When enabled, you will get a daily reminder to write your Mindly.
          </span>
        </div>
        <div className="toogle">
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
