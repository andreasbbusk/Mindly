import { NavLink } from "react-router-dom";
import Error404 from "../assets/Error404.png";

export default function SettingMenu() {
  return (
    <div className="settings-front-error">
      <div className="setting-img">
        <img src={Error404} alt="Mindly" />
      </div>
      <p className="error-not-found">PAGE NOT FOUND</p>
      <p className="error-text">
        The page you are looking for was moved, removed, renamed or might never
        existed.
      </p>
      <p className="error-panic"> No need to panic!</p>
      <div className="error-navigate">
        <div>
          <NavLink className="cta_red cta_error" to="/home" type="button">
            Go home
          </NavLink>
        </div>
        <p>or</p>
        <div>
          <NavLink className="cta_red cta_error" to="/Edit" type="button">
            Add Mindly
          </NavLink>
        </div>
      </div>
    </div>
  );
}
