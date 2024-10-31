// Kodet af Oliver
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // If successful, store user data in localStorage
      localStorage.setItem("userId", user.uid);
      localStorage.setItem("username", user.displayName || "");
      
      setError("");
      navigate("/home");
    } catch (error) {
      setError("Error logging in. Please check your credentials and try again.");
      console.error("Error during login: ", error);
    }
  };

  return (
    <div>
      <div className="login-overskrift">
        <h1>Log In</h1>
        <p>
          Not a Mindly yet? Sign up <NavLink to="/Signup">here</NavLink>
        </p>
      </div>

      <div className="login-container">
        {error && <p className="error-message">{error}</p>}
        <div className="login-username">
          <h3>Email</h3>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="login-password">
          <h3>Password</h3>
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="login-button">
        <button onClick={handleLogin}>Log In</button>
      </div>
    </div>
  );
};

export default Login;
