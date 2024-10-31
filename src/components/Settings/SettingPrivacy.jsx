import { NavLink } from "react-router-dom";
import ArrowSettings from "../../assets/ArrowSettings.png";

export default function SettingMenu() {
  return (
    <div className="settings-front">
      <h1>Privacy & Safety</h1>
      <NavLink to="/Error" className="name-card">
        <div className="left-section">
          <span className="label-privacy">
            How to report safety concerns to us{" "}
          </span>
        </div>
        <div className="right-section">
          <img src={ArrowSettings} alt="Arrow" className="arrow-personal" />
        </div>
      </NavLink>

      <NavLink to="/Error" className="name-card">
        <div className="left-section">
          <span className="label-privacy">
            Frequently asked privacy questions
          </span>
        </div>
        <div className="right-section">
          <img src={ArrowSettings} alt="Arrow" className="arrow-personal" />
        </div>
      </NavLink>
      <p className="additional-text">Additional</p>
      <NavLink to="/Error" className="name-card">
        <div className="left-section">
          <span className="label">Privacy Center</span>
          <span className="name">Your privacy on Mindly, explained</span>
        </div>
        <div className="right-section">
          <img src={ArrowSettings} alt="Arrow" className="arrow-personal" />
        </div>
      </NavLink>
    </div>
  );
}
