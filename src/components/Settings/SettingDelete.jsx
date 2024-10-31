import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useState } from "react";
import { getDatabase, ref, remove } from "firebase/database";

export default function SettingDelete() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (user) {
      try {
        // Prompt for re-authentication
        const password = prompt("Please enter your password to confirm deletion:");
        if (!password) {
          throw new Error("Password is required for deletion");
        }

        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);

        // Delete all user data from Realtime Database
        const rtdb = getDatabase();
        const rtdbUserRef = ref(rtdb, `users/${user.uid}`);
        await remove(rtdbUserRef);

        // Delete user from Firebase Authentication
        await deleteUser(user);

        // Redirect to onboarding page after successful deletion
        navigate("/onboarding");
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <div className="settings-front settings-delete">
      <h1>Delete profile</h1>
      <div className="delete-text">
        <p className="delete-sad">We are sad to see you leave. </p>
        <p>
          Your Mindly&apos;s will be deleted and you will NOT be able to recover your
          Mindly&apos;s again.
        </p>
        <p className="delete-sure"> Are you sure you want to delete Mindly?</p>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="delete-navigate">
        <NavLink className="cta_red" to="/settings">
          Cancel
        </NavLink>
        <button
          className="cta_red cta_delete"
          onClick={handleDelete}
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
