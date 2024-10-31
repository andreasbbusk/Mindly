import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";

import HeltSurMedFarve from "../../assets/HeltSurMedFarve.png";
import LidtSurMedFarve from "../../assets/LidtSurMedFarve.png";
import MellemSurMedFarve from "../../assets/MellemSurMedFarve.png";
import LidtGladMedFarve from "../../assets/LidtGladMedFarve.png";
import HeltGladMedFarve from "../../assets/HeltGladMedFarve.png";
import EditIcon from "../../assets/editicon.png";
import FallbackImage from "../../assets/FallBackImage.png";
import VenstreStreg from "../../assets/LeftIllustration.png";
import HoejreStreg from "../../assets/RightIllustration.png";

// Component imports
import TopNav from "../../components/Navigation/TopNav";

const MindlyFullView = () => {
  const [mindly, setMindly] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const moodImages = useMemo(
    () => ({
      HeltSur: HeltSurMedFarve,
      LidtSur: LidtSurMedFarve,
      MellemSur: MellemSurMedFarve,
      LidtGlad: LidtGladMedFarve,
      HeltGlad: HeltGladMedFarve,
    }),
    [] 
  );

  useEffect(() => {
    const fetchMindly = async () => {
      if (!auth.currentUser) {
        console.error("User not authenticated");
        navigate("/login");
        return;
      }

      const db = getDatabase();
      const mindlyRef = ref(db, `users/${auth.currentUser.uid}/mindlys/${id}`);

      try {
        const snapshot = await get(mindlyRef);
        if (snapshot.exists()) {
          setMindly({ id, ...snapshot.val() });
        } else {
          console.error("Mindly not found");
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error fetching mindly:", error);
        navigate("/profile");
      }
    };

    fetchMindly();
  }, [id, navigate, auth]);

  if (!mindly) return null;

  return (
    <AnimatePresence>
      <TopNav />

      <div className="MindlyPost-streg-box">
        <div className="MindlyFull-Hoejre">
          <img src={HoejreStreg} alt="Right illustration" loading="lazy" />
        </div>

        <div className="MindlyFull-Venstre">
          <img src={VenstreStreg} alt="Left illustration" loading="lazy" />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mindly-full-view"
      >
        <motion.div
          className="mindly-full-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {/* Overskrift */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {mindly.subject}
          </motion.h2>

           {/* Image with fallback */}
           <motion.img
            src={mindly.image || FallbackImage} // Use fallback image if mindly.image is null
            alt="Mindly image"
            className="mindly-image"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          />

          <div className="mindly-dato-tekst-edit-container">
            {/* Dato */}
            <motion.p
              className="mindly-date"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {new Date(mindly.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </motion.p>

            {/* Tekst på mindly */}
            <motion.p
              className="mindly-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {mindly.text}

              {/* Smileys */}
              <motion.div
                className="mindly-mood"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="mood-container">
                  {mindly.mood && moodImages[mindly.mood] && (
                    <>
                      <span className="mood-label">Mood:</span>{" "}
                      {/* Add the label here */}
                      <img
                        src={moodImages[mindly.mood]}
                        alt={`Mood: ${mindly.mood}`}
                        className="mood-image"
                        loading="lazy"
                      />
                    </>
                  )}
                </div>
              </motion.div>
            </motion.p>

            <div className="mindly-edit-blyant">
              <NavLink to={`/mindly/${id}/edit`}>
                <img src={EditIcon} alt="Edit icon" />
              </NavLink>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MindlyFullView;