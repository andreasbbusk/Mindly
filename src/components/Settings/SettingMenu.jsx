import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Modal from "react-modal";
import AppOpen from "../../assets/AppOpen.png";
import Person from "../../assets/Profile.png";
import Notifications from "../../assets/Notifications.png";
import Lock from "../../assets/Lock.png";
import Arrow from "../../assets/ArrowRight.png";

export default function SettingMenu() {
  const [username, setUsername] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || "");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="settings-front">
      <h1>Settings</h1>
      <div className="setting-img">
        <img src={AppOpen} alt="Mindly" />
      </div>
      <h2>{username || "User"}</h2>
      <div className="menu-items">
        <NavLink to="/personal" className="menu-personal">
          <img src={Person} alt="Personal" className="icon" />
          <span className="text">Personal Information</span>
          <img src={Arrow} alt="Arrow" className="arrow" />
        </NavLink>

        <NavLink to="/notifications" className="menu-notifications">
          <img src={Notifications} alt="Notifications" className="icon" />
          <span className="text">Notifications</span>
          <img src={Arrow} alt="Arrow" className="arrow" />
        </NavLink>

        <NavLink to="/privacy" className="menu-privacy">
          <img src={Lock} alt="Privacy" className="icon" />
          <span className="text">Privacy & Safety</span>
          <img src={Arrow} alt="Arrow" className="arrow" />
        </NavLink>
      </div>
      <div>
        <button className="cta_red cta_signout" type="button" onClick={openModal}>
          Logout
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="settings-modal"
        overlayClassName="settings-overlay"
      >
        <div className="settings-modal-content">
          <h2>Logout</h2>
          <p>Are you sure you want to logout?</p>
          <div className="settings-modal-buttons">
            <button className="cta_red cancel-button" onClick={closeModal}>Cancel</button>
            <button className="cta_red" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
