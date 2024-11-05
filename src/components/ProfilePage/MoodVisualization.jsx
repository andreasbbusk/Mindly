import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { motion } from "framer-motion";

const MoodVisualization = () => {
  const [weeklyMoods, setWeeklyMoods] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const auth = getAuth();
  const db = getDatabase();

  const moodColors = {
    HeltSur: "#EB5C2F", // Red
    LidtSur: "#FBB040", // Orange-Red
    MellemSur: "#FFF456", // Orange
    LidtGlad: "#92C263", // Light Green
    HeltGlad: "#49AD4C", // Dark Green
  };

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    const mindlysRef = ref(db, `users/${auth.currentUser.uid}/mindlys`);

    const handleSnapshot = (snapshot) => {
      if (!snapshot.exists()) return;

      // Get current date and current week number
      const today = new Date();
      const currentWeekNum = getWeekNumber(today);
      setCurrentWeek(currentWeekNum);

      // Convert mindly entries to array
      const mindlyEntries = Object.entries(snapshot.val())
        .map(([id, mindly]) => ({
          ...mindly,
          id,
          date: new Date(mindly.date),
          mood: mindly.mood,
        }))
        .sort((a, b) => a.date - b.date);

      // Initialize weeks array with the current week and 6 previous weeks
      const weeksArray = Array.from({ length: 7 }, (_, i) => {
        const weekNum = currentWeekNum - (6 - i); // Changed to start from earliest week
        return {
          weekNum,
          moods: [],
          dominantMood: null,
          fillPercentage: 0,
        };
      });

      // Create a map for easier access
      const weeksMap = weeksArray.reduce((acc, week) => {
        acc[week.weekNum] = week;
        return acc;
      }, {});

      // Group mindlys by week
      mindlyEntries.forEach((mindly) => {
        const weekNum = getWeekNumber(mindly.date);
        if (weeksMap[weekNum]) {
          weeksMap[weekNum].moods.push(mindly.mood);
        }
      });

      // Process each week's data
      const processedWeeks = weeksArray.map((week) => {
        const moods = weeksMap[week.weekNum].moods;

        // Calculate dominant mood
        const moodFrequency = moods.reduce((acc, mood) => {
          acc[mood] = (acc[mood] || 0) + 1;
          return acc;
        }, {});

        const dominantMood =
          Object.entries(moodFrequency).sort(([, a], [, b]) => b - a)[0]?.[0] ||
          null;

        return {
          weekNum: week.weekNum,
          moods,
          dominantMood,
          fillPercentage: (moods.length / 7) * 100,
        };
      });

      // Sort weeks in ascending order
      const sortedWeeks = processedWeeks.sort((a, b) => a.weekNum - b.weekNum);
      setWeeklyMoods(sortedWeeks);
    };

    const unsubscribe = onValue(mindlysRef, handleSnapshot);
    return () => unsubscribe();
  }, [auth.currentUser, db]);

  return (
    <>
      <h3>Mood history</h3>
      <div className="mood-visualization">
        <div className="mood-bars">
          {weeklyMoods.map((week) => (
            <div key={week.weekNum} className="mood-bar-container">
              <div className="mood-bar">
                {week.moods.length > 0 ? (
                  <motion.div
                    className="mood-segment"
                    initial={{ height: 0 }}
                    animate={{
                      height: `${week.fillPercentage}%`,
                      opacity: 1,
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                      backgroundColor: week.dominantMood
                        ? moodColors[week.dominantMood]
                        : "#f5f5f5",
                    }}
                  />
                ) : (
                  <div className="empty-bar" />
                )}
              </div>
              <span className="week-label">
                {week.weekNum === currentWeek
                  ? "week " + currentWeek
                  : `week ${week.weekNum}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MoodVisualization;
