// Kodet af Oliver
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword || !username) {
      setError("Please fill in all fields.");
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      alert("Passwords do not match.");
      return;
    }

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name to be the username
      await updateProfile(user, { displayName: username });

      setError("");
      navigate("/Login");
    } catch (error) {
      const errorMessage = "Error creating account. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
      console.error("Error creating account: ", error);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-overskrift">
        <h1>Sign Up</h1>
        <p>
          You&apos;re now one step closer <br /> to becoming a Mindly
        </p>
      </div>

      <div className="signup-container">
        {error && <p className="error-message">{error}</p>}
        <div className="signup-call-you">
          <h3>What should we call you?</h3>
          <input
            type="text"
            placeholder="Enter your username (min. 3 characters)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={10}
          />
        </div>
        <div className="signup-email">
          <h3>Email</h3>
          <input
            type="text"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="signup-password">
          <h3>Password</h3>
          <input
            type="password"
            placeholder="Enter your Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="signup-confirm-password">
          <h3>Confirm Password</h3>
          <input
            type="password"
            placeholder="Confirm your Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="signup-button">
        <button onClick={handleSubmit}>
          <p>Sign Up</p>
        </button>
      </div>

      <div className="signup-already-acc">
        <p>
          Already have an account? Log in <NavLink to="/Login">here</NavLink>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
