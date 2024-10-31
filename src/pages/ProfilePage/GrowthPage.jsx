// Kodet af Andreas

import { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { motion, animate, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MoodVisualization from "../../components/ProfilePage/MoodVisualization";
import AchievementBadge1 from "../../assets/Trophee1.png";
import AchievementBadge2 from "../../assets/Trophee2.png";
import AchievementBadge3 from "../../assets/Troophee3.png";
import AchievementBadge4 from "../../assets/Trophee4.png";

const GrowthPage = () => {
  const navigate = useNavigate();
  
  // State
  const [daysCompleted, setDaysCompleted] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  const totalDays = 365;
  const innerCircumference = 2 * Math.PI * 78;

  // Refs for scroll animations
  const progressRef = useRef(null);
  const statsRef = useRef(null);
  const achievementsRef = useRef(null);
  const moodRef = useRef(null);

  // Scroll animation triggers
  const progressInView = useInView(progressRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });
  const achievementsInView = useInView(achievementsRef, { once: true, amount: 0.2 });
  const moodInView = useInView(moodRef, { once: true, amount: 0.1 });

  // Calculate circle progress
  const innerStrokeDashoffset = innerCircumference - 
    (((daysCompleted / totalDays) * 100) / 100) * innerCircumference;

  // Handler
  const handleAddMindly = () => navigate("/create-mindly");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getDatabase();
    const entriesRef = ref(db, `users/${user.uid}/mindlys`);

    const handleSnapshot = (snapshot) => {
      if (!snapshot.exists()) return;

      const currentYear = new Date().getFullYear();
      const thisYearEntries = Object.entries(snapshot.val())
        .map(([id, entry]) => ({ id, ...entry }))
        .filter((entry) => new Date(entry.date).getFullYear() === currentYear);

      const entryCount = thisYearEntries.length;
      setDaysCompleted(entryCount);

      if (progressInView) {
        animate(displayCount, entryCount, {
          duration: 1.5,
          onUpdate: (latest) => setDisplayCount(Math.floor(latest)),
        });
      }
    };

    const unsubscribe = onValue(entriesRef, handleSnapshot);
    return () => unsubscribe();
  }, [progressInView]);

  return (
    <section className="growth-page">
      <div className="growth-container">
        <div className="progress-circle-container" ref={progressRef}>
          <svg className="progress-circle" viewBox="0 0 200 192">
            <circle
              cx="96"
              cy="96"
              r="88"
              className="progress-circle-bg"
              fill="none"
              stroke="black"
              strokeWidth="3"
            />
            <circle
              cx="96"
              cy="96"
              r="70"
              className="progress-circle-bg"
              fill="none"
              stroke="black"
              strokeWidth="3"
            />
            <motion.circle
              cx="97"
              cy="96"
              r="78"
              className="progress-circle-inner"
              fill="none"
              stroke="black"
              strokeWidth="15"
              strokeDasharray={innerCircumference}
              initial={{ strokeDashoffset: innerCircumference }}
              animate={{ 
                strokeDashoffset: progressInView ? innerStrokeDashoffset : innerCircumference 
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
          <div className="progress-text">
            <span className="progress-fraction">
              {displayCount}/{totalDays}
            </span>
          </div>
        </div>

        <motion.div
          ref={statsRef}
          className="stats-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: statsInView ? 0 : 20, 
            opacity: statsInView ? 1 : 0 
          }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="stats-title">Mindly&apos;s this year</h2>
          <p className="stats-subtitle">
            {daysCompleted === 0 ? "Needs a little work..." : "Keep up the good work!"}
          </p>
        </motion.div>

        <button className="add-entry-button" onClick={handleAddMindly}>
          Add today&apos;s Mindly
        </button>
      </div>

      <motion.div
        ref={achievementsRef}
        className="achievements-container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: achievementsInView ? 0 : 20, 
          opacity: achievementsInView ? 1 : 0 
        }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="achievements-title">Your Achievements</h2>
        <div className="achievements-grid">
          <div className="achievement-badge">
            <img src={AchievementBadge1} alt="7-day streak" className="achievement-icon" />
            <div>
              <p className="badge-title">7-day streak</p>
              <p className="badge-status">Completed</p>
            </div>
          </div>
          <div className="achievement-badge">
            <img src={AchievementBadge2} alt="11-day reflection" className="achievement-icon" />
            <div>
              <p className="badge-title">11-day thank you reflection</p>
              <p className="badge-status">Completed</p>
            </div>
          </div>
          <div className="achievement-badge">
            <img src={AchievementBadge3} alt="21-day focus" className="achievement-icon" />
            <div>
              <p className="badge-title">21-day mental awareness focus</p>
              <p className="badge-status">Completed</p>
            </div>
          </div>
          <div className="achievement-badge">
            <img src={AchievementBadge4} alt="25-day growth" className="achievement-icon" />
            <div>
              <p className="badge-title">25-day personal growth</p>
              <p className="badge-status">Completed</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        ref={moodRef}
        className="stats-container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: moodInView ? 0 : 20, 
          opacity: moodInView ? 1 : 0 
        }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <MoodVisualization />
      </motion.div>

      <p className="mood-scale-text">
        The data is based on your mood ratings through your added Mindly&apos;s for you to see your personal growth
      </p>
    </section>
  );
};

export default GrowthPage;
