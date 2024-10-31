import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAuth } from "firebase/auth";
import ArrowSettings from "../../assets/ArrowSettings.png";

export default function SettingMenu() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setEmail(user.email);
      // Get username from displayName if set, otherwise use email
      setUsername(user.displayName || user.email.split('@')[0]);
    }
  }, []);

  return (
    <div className="settings-front">
      <h1>Personal information</h1>

      <NavLink to="/Name" className="name-card">
        <div className="left-section">
          <span className="label">Email</span>
          <span className="name">{email || "Not set"}</span>
        </div>
        <div className="right-section">
          <img src={ArrowSettings} alt="Arrow" className="arrow-personal" />
        </div>
      </NavLink>

      <NavLink to="/Username" className="name-card">
        <div className="left-section">
          <span className="label">Username</span>
          <span className="name">{username}</span>
        </div>
        <div className="right-section">
          <img src={ArrowSettings} alt="Arrow" className="arrow-personal" />
        </div>
      </NavLink>

      <NavLink to="/Password" className="name-card">
        <div className="left-section">
          <span className="label">Password</span>
          <span className="name">Change your password</span>
        </div>
        <div className="right-section">
          <img src={ArrowSettings} alt="Arrow" className="arrow-personal" />
        </div>
      </NavLink>

      <NavLink to="/Language" className="name-card">
        <div className="left-section">
          <span className="label">Language</span>
          <span className="name">Change language</span>
        </div>
        <div className="right-section">
          <img src={ArrowSettings} alt="Arrow" className="arrow-personal" />
        </div>
      </NavLink>

      <div className="delete-text">
        <NavLink to="/delete" className="cta_settings">
          Delete Profile
        </NavLink>
        <p>
          All your personal information will be deleted and cannot be recovered
        </p>
      </div>
    </div>
  );
}
