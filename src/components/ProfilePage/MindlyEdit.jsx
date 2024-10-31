// Imports
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, update, remove } from "firebase/database";

// Component imports
import TopNav from "../Navigation/TopNav";

// Asset imports
import HeltSurMedFarve from "../../assets/HeltSurMedFarve.png";
import LidtSurMedFarve from "../../assets/LidtSurMedFarve.png";
import MellemSurMedFarve from "../../assets/MellemSurMedFarve.png";
import LidtGladMedFarve from "../../assets/LidtGladMedFarve.png";
import HeltGladMedFarve from "../../assets/HeltGladMedFarve.png";
import HeltSurUdenFarve from "../../assets/HeltSurUdenFarve.png";
import LidtSurUdenFarve from "../../assets/LidtSurUdenFarve.png";
import MellemSurUdenFarve from "../../assets/MellemSurUdenFarve.png";
import LidtGladUdenFarve from "../../assets/LidtGladUdenFarve.png";
import HeltGladUdenFarve from "../../assets/HeltGladUdenFarve.png";
import AddPhoto from "../../assets/AddPhoto.png";

// Mood images configuration
const moodImages = [
  { name: "HeltSur", withColor: HeltSurMedFarve, withoutColor: HeltSurUdenFarve },
  { name: "LidtSur", withColor: LidtSurMedFarve, withoutColor: LidtSurUdenFarve },
  { name: "MellemSur", withColor: MellemSurMedFarve, withoutColor: MellemSurUdenFarve },
  { name: "LidtGlad", withColor: LidtGladMedFarve, withoutColor: LidtGladUdenFarve },
  { name: "HeltGlad", withColor: HeltGladMedFarve, withoutColor: HeltGladUdenFarve },
];

const MindlyEdit = () => {
  // Hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase();

  // State
  const [mindly, setMindly] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedText, setEditedText] = useState("");
  const [editedMood, setEditedMood] = useState("");
  const [editedImage, setEditedImage] = useState(null);
  const [userId, setUserId] = useState(null);

  // Effects
  useEffect(() => {
    const fetchUserId = async () => {
      if (auth.currentUser) {
        setUserId(auth.currentUser.uid);
      }
    };

    fetchUserId();
  }, [auth.currentUser]);

  useEffect(() => {
    const fetchMindly = async () => {
      if (!userId) return;
      const mindlyRef = ref(db, `users/${userId}/mindlys/${id}`);
      try {
        const snapshot = await get(mindlyRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setMindly(data);
          setEditedSubject(data.subject);
          setEditedText(data.text);
          setEditedMood(data.mood);
          setEditedImage(data.image);
          setIsOpen(true);
        } else {
          console.log("Nothing found!");
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error fetching mindly:", error);
      }
    };

    if (userId) {
      fetchMindly();
    }
  }, [id, navigate, userId, db]);

  // Handlers
  const handleSave = async () => {
    if (!userId) return;
    const updatedMindly = {
      ...mindly,
      subject: editedSubject,
      text: editedText,
      mood: editedMood,
    };
    
    if (editedImage) {
      updatedMindly.image = editedImage;
    }
    
    const mindlyRef = ref(db, `users/${userId}/mindlys/${id}`);
    
    try {
      await update(mindlyRef, updatedMindly);
      setMindly(updatedMindly);
      navigate(-1);
    } catch (error) {
      console.error("Error updating mindly:", error);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;
    const mindlyRef = ref(db, `users/${userId}/mindlys/${id}`);
    
    try {
      await remove(mindlyRef);
      navigate(-1);
    } catch (error) {
      console.error("Error deleting mindly:", error);
    }
  };

   // Handlers
   const handleRemoveImage = () => {
    setEditedImage(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Early return if mindly is not loaded
  if (!mindly) {
    return null; // Or a loading indicator
  }

  // Render
  return (
    <>
      <TopNav />
      {isOpen && (
        <motion.div
          className="mindly-full-view-edit"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ duration: 0.3 }}
        >
          <div className="mindly-full-view-content">
            {/* Subject input */}
            <div className="MindlyPost-Subject">
              <h3>Subject</h3>
              <input 
                type="text" 
                placeholder="Write a subject line" 
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
              />
            </div>

            {/* Text input */}
            <div className="MindlyPost-Text">
              <h3>Text</h3>
              <textarea 
                placeholder="Use this space to write your personal Mindly"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              ></textarea>
            </div>

            {/* Mood selection */}
            <div className="mindly-post-smiley-box">
              <h3>Select your emotion</h3>
              <div className="MindlyPost-Smiley-Container">
                <div className="MindlyPost-Smiley">
                  {moodImages.map((mood) => (
                    <img
                      key={mood.name}
                      src={editedMood === mood.name ? mood.withColor : mood.withoutColor}
                      alt={mood.name}
                      onClick={() => setEditedMood(mood.name)}
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Photo upload */}
            <div className="MindlyPost-AddPhoto">
              <h4>Add photo</h4>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              
              <div className="image-upload-container">
                <label htmlFor="image-upload">
                  <img
                    src={editedImage || AddPhoto}
                    alt={editedImage ? "Selected photo" : "Add photo"}
                    loading="lazy"
                  />
                </label>
                {editedImage && (
                  <span
                    className="change-image-text"
                    onClick={handleRemoveImage}
                  >
                    Delete image
                  </span>
                )}
              </div>
            </div>

            {/* Save and Delete buttons */}
            <div className="MindlyPost-ButtonContainer">
              <button className="MindlyPost-SaveButton" onClick={handleSave}>
                Save Changes
              </button>
              <button className="MindlyPost-DeleteButton" onClick={handleDelete}>
                Delete Mindly
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default MindlyEdit;
