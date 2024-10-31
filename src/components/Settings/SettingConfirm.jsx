import { NavLink } from "react-router-dom";
import DeleteApp from "../../assets/DeleteApp.png";

export default function SettingMenu() {
  return (
    <div className="settings-front confirm-delete">
      <h1>Your profile is now deleted</h1>
      <p className="confirm-delete-text">
        If you reconsider, remember that Mindly is always here for you!
      </p>

      <div>
        <NavLink
          className="cta_red cta_confirm_delete"
          to="/home"
          type="button"
        >
          Close app
        </NavLink>
      </div>
      <div className="confirm-img">
        <img src={DeleteApp} alt="Mindly" />
      </div>
      <p className="confirm-text">
        How was your stay? Please let us know what you liked and disliked by
        leaving a review in your app store.
      </p>
      <p className="confirm-thank">Thank you </p>
      <p>From the whole team at Mindly</p>
    </div>
  );
}
