import { useState, useEffect } from "react";

export default function SettingMenu() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Funktion til at bekræfte det nuværende password
  const handleConfirmPassword = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.password === currentPassword) {
        setIsPasswordConfirmed(true);
        setErrorMessage("");
      } else {
        setErrorMessage("Incorrect password. Please try again.");
      }
    }
  };

  // Funktion til at gemme det nye password
  const handleSaveNewPassword = () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      parsedUser.password = newPassword;
      localStorage.setItem("user", JSON.stringify(parsedUser));
      setSuccessMessage("Your password has been changed successfully!");
      setErrorMessage("");

      // Nulstil til indtast nuværende password-sektionen efter ændring
      setIsPasswordConfirmed(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // Fjern besked efter 3 sekunder
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);

      // Ryd timeout hvis komponenten afmonteres eller beskeder ændres
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  return (
    <div>
      {!isPasswordConfirmed ? (
        <div>
          <div className="settings-password">
            <h1>Password</h1>
            <p>
              In order to change your password, please enter your current
              password.
            </p>
          </div>

          <div className="settings-change-password">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="save-email-button"
            onClick={handleConfirmPassword}
          >
            Next
          </button>

          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      ) : (
        <div>
          <div className="settings-password">
            <h1>Change Password</h1>
            <p>Enter and confirm your new password.</p>
          </div>

          <div className="settings-change-password">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="save-email-button"
            onClick={handleSaveNewPassword}
          >
            Save
          </button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      )}
    </div>
  );
}
