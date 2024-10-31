// Import necessary assets
import EditIcon from "../../assets/editicon.png";
import HeltSurMedFarve from "../../assets/HeltSurMedFarve.png";
import LidtSurMedFarve from "../../assets/LidtSurMedFarve.png";
import MellemSurMedFarve from "../../assets/MellemSurMedFarve.png";
import LidtGladMedFarve from "../../assets/LidtGladMedFarve.png";
import HeltGladMedFarve from "../../assets/HeltGladMedFarve.png";

// Import required dependencies
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, get } from "firebase/database";

// Define mood icons mapping
const moodIcons = {
  HeltSur: HeltSurMedFarve,
  LidtSur: LidtSurMedFarve,
  MellemSur: MellemSurMedFarve,
  LidtGlad: LidtGladMedFarve,
  HeltGlad: HeltGladMedFarve,
};

const MindlyCard = ({ selectedEntry, onUpdate }) => {
  // Hooks
  const navigate = useNavigate();
  const [entry, setEntry] = useState(selectedEntry);
  const [userId, setUserId] = useState(null);
  const auth = getAuth();
  const db = getDatabase();

  // Fetch user ID
  useEffect(() => {
    const fetchUserId = async () => {
      if (auth.currentUser) {
        const userRef = ref(db, `users/${auth.currentUser.uid}`);
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) { 
            setUserId(auth.currentUser.uid);
          }
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      }
    };

    fetchUserId();
  }, [auth.currentUser, db]);

  // Listen for changes in the selected entry
  useEffect(() => {
    if (selectedEntry && auth.currentUser && userId) {
      const mindlyRef = ref(db, `users/${userId}/mindlys/${selectedEntry.id}`);
      
      const unsubscribe = onValue(mindlyRef, (snapshot) => {
        const data = snapshot.val();
        if (data && JSON.stringify(data) !== JSON.stringify(selectedEntry)) {
          setEntry({ ...data, id: selectedEntry.id });
          onUpdate?.({ ...data, id: selectedEntry.id });
        } else {
          setEntry(selectedEntry);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedEntry, onUpdate, auth.currentUser, db, userId]);

  // Helper functions
  const getMoodIcon = (mood) => moodIcons[mood] || null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}`;
  };

  const truncate = (text, max) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  // Event handlers
  const handleCardClick = () => {
    if (entry && entry.id) {
      navigate(`/mindly/${entry.id}/full-view`);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (entry && entry.id) {
      navigate(`/mindly/${entry.id}/edit`);
    }
  };

  if (!entry) return null;

  return (
    <motion.div
      className="mindly-card"
      layoutId={`mindly-${entry.id}`}
      whileTap={{ scale: 0.95 }}
      onClick={handleCardClick}
    >
      <motion.div className="mindly-card-date" layoutId={`date-${entry.id}`}>
        <motion.h4>
          <strong>{formatDate(entry.date)}</strong>
        </motion.h4>
      </motion.div>
      <motion.div
        className="mindly-card-content"
        layoutId={`content-${entry.id}`}
      >
        <motion.h4 layoutId={`subject-${entry.id}`}>
          {truncate(entry.subject, 20)}
        </motion.h4>
        <motion.p layoutId={`text-${entry.id}`}>
          {truncate(entry.text, 70)}
        </motion.p>
        <motion.div
          className="mindly-card-mood-container"
          layoutId={`mood-${entry.id}`}
        >
          <motion.p>
            <strong>Mood:</strong>
          </motion.p>
          <motion.img
            className="mindly-card-mood"
            src={getMoodIcon(entry.mood)}
            alt={entry.mood}
            layoutId={`mood-icon-${entry.id}`}
          />
        </motion.div>
      </motion.div>
      <motion.div
        className="mindly-edit-button"
        layoutId={`edit-${entry.id}`}
        onClick={handleEditClick}
      >
        <motion.img src={EditIcon} alt="Edit" />
      </motion.div>
    </motion.div>
  );
};

export default MindlyCard;
