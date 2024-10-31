import { useState, useEffect } from "react";
import { getAuth, updateEmail } from "firebase/auth";

export default function SettingMenu() {
  const [email, setEmail] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [error, setError] = useState("");
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email);
    }
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await updateEmail(user, email);
        setConfirmationMessage("Your email has been changed!");
        setError("");
        setTimeout(() => setConfirmationMessage(""), 3000);
      } catch (err) {
        console.error("Error updating email:", err);
        setError("Failed to update email. Please try again.");
        setConfirmationMessage("");
      }
    }
  };

  return (
    <div className="settings-email">
      <h1>Email</h1>
      <p>Change email here</p>
      <div>
        <div className="settings-change-mail">
          <input
            type="email"
            placeholder="Change your Email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <button
          type="button"
          className="save-email-button"
          onClick={handleSave}
        >
          Save
        </button>
        {confirmationMessage && (
          <p className="confirmation-message">{confirmationMessage}</p>
        )}
        {error && (
          <p className="error-message">{error}</p>
        )}
      </div>
    </div>
  );
}
