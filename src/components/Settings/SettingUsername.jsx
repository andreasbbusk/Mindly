import { useState, useEffect } from "react";

export default function SettingMenu() {
  const [username, setUsername] = useState(""); // State til at håndtere brugernavn
  const [confirmationMessage, setConfirmationMessage] = useState(""); // State til bekræftelsesbesked

  // Hent username fra "user"-objektet i localStorage ved første indlæsning
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsername(parsedUser.username); // Sæt username i state, hvis det eksisterer
    }
  }, []);

  // Funktion til at opdatere state ved input-ændring
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  // Funktion til at gemme det ændrede brugernavn i "user"-objektet i localStorage
  const handleSaveUsername = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      parsedUser.username = username; // Opdater username i objektet
      localStorage.setItem("user", JSON.stringify(parsedUser)); // Gem objektet tilbage i localStorage
      setConfirmationMessage("Your username has been changed!"); // Sæt bekræftelsesbesked
      setTimeout(() => setConfirmationMessage(""), 3000); // Fjern beskeden efter 3 sekunder
    }
  };

  return (
    <div className="settings-username">
      <h1>Username</h1>
      <p>What name do you want to be displayed?</p>
      <div>
        <div className="settings-change-username">
          <input
            type="text"
            placeholder="Change your username"
            value={username} // Viser det aktuelle username i input-feltet
            onChange={handleUsernameChange} // Håndterer ændringer i input
          />
        </div>
        <button
          type="button"
          className="save-username-button"
          onClick={handleSaveUsername} // Kald handleSaveUsername ved klik
        >
          Save
        </button>
        {confirmationMessage && (
          <p className="confirmation-message">{confirmationMessage}</p> // Viser bekræftelsesbeskeden
        )}
      </div>
    </div>
  );
}
