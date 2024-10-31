import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import myImage from "../assets/HomeScreen.png";
import MindlyCard from "../components/ProfilePage/MindlyCard";
import MenuBar from "../components/Navigation/MenuBar";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  query,
  limitToLast,
  onValue,
} from "firebase/database";

const Home = () => {
  const quotes = [
    "Even the smallest step forward is still a step in the right direction.",
    "Believe you can and you're halfway there.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "The journey of a thousand miles begins with one step.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "Don't watch the clock; do what it does. Keep going.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Dream big and dare to fail.",
    "Opportunities don't happen, you create them.",
    "Your time is limited, so don't waste it living someone else's life.",
  ];

  const [quote, setQuote] = useState("");
  const [username, setUsername] = useState("");
  const [latestMindly, setLatestMindly] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();

    // Get daily quote based on the current date
    const today = new Date();
    const dayOfYear = Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const quoteIndex = dayOfYear % quotes.length;
    setQuote(quotes[quoteIndex]);

    if (!user) {
      return; // Early return if no user
    }

    setUsername(user.displayName || "");

    // Get latest mindly
    const mindlysRef = ref(db, `users/${user.uid}/mindlys`);
    const latestMindlyQuery = query(mindlysRef, limitToLast(1));

    const unsubscribe = onValue(latestMindlyQuery, (snapshot) => {
      if (!snapshot.exists()) {
        setLatestMindly(null);
        return;
      }

      const data = snapshot.val();
      const mindlyKey = Object.keys(data)[0];
      const mindlyData = data[mindlyKey];

      // Add console.log to verify the mindly object
      console.log("Processed mindly:", {
        id: mindlyKey,
        subject: mindlyData.subject,
        text: mindlyData.text,
        mood: mindlyData.mood,
        date: mindlyData.date,
        image: mindlyData.image,
      });

      setLatestMindly({
        id: mindlyKey,
        subject: mindlyData.subject || "Untitled",
        text: mindlyData.text || "",
        mood: mindlyData.mood || "",
        date: mindlyData.date || new Date().toISOString(),
        image: mindlyData.image || "",
      });
    });

    return () => unsubscribe();
  }, []);

  const handleAddMindly = () => {
    navigate("/create-mindly");
  };

  const handleMoodCardClick = () => {
    navigate("/profile/growthpage");
  };

  const handleErrorClick = () => {
    navigate("/error");
  };


  return (
    <>
      <div className="home-page-container">
        <div className="home-container">
          <h1>Hi, {username}</h1>
          <img
            src={myImage}
            alt="A descriptive text about the image"
            className="home-image"
          />
          <h2>Quote of the Day</h2>
          <p>{quote}</p>
          <a className="cta_red" onClick={handleAddMindly}>
            Add Today's Mindly
          </a>
        </div>
        <div className="homepage-box">
          <div className="personal-growth-section">
            <h3>Personal Growth</h3>
            <div className="personal-growth-container">
              <div className="growth-cards-scroll">
                {/* Mood Card */}
                <div className="growth-card" onClick={handleMoodCardClick}>
                  <h4>Mood journey</h4>
                  <p className="mood-subtitle">Bar chart</p>
                  <div className="mood-bars">
                    {[3, 4, 5, 7, 8, 6, 4, 3].map((height, index) => (
                      <div
                        key={index}
                        className="mood-bar-home"
                        style={{ height: `${height * 20}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Guides Card */}
                <div className="growth-card" onClick={handleErrorClick}>
                  <h4>Guides</h4>
                  <div className="guides-progress">12/21</div>
                  <div className="guides-grid">
                    {[
                      1,0,1,0,1,
                      1,0,1,0,1,
                      1,0,0,1,0,
                      0,1,0,0,0,
                      1
                    ].map((completed, i) => (
                      <div
                        key={i}
                        className={`guide-square ${completed ? "completed" : ""}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Achievements Card */}
                <div className="growth-card" onClick={handleErrorClick}>
                  <h4>Achievements</h4>
                  <p className="achievements-label">Badges achieved</p>
                  <div className="achievements-progress">
                    <svg className="progress-ring" width="150" height="150">
                      <circle
                        stroke="#F7756B"
                        opacity="0.2"
                        strokeWidth="8"
                        fill="transparent"
                        r="60"
                        cx="75"
                        cy="75"
                      />
                      <circle
                        className="progress-ring-circle"
                        stroke="#F7756B"
                        strokeWidth="8"
                        fill="transparent"
                        r="60"
                        cx="75"
                        cy="75"
                      />
                    </svg>
                    <div className="achievements-count">3/8</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="latest-mindly-section">
            <h3>Latest Mindly</h3>
            {latestMindly ? (
              <MindlyCard
                selectedEntry={{
                  id: latestMindly.id,
                  subject: latestMindly.subject,
                  text: latestMindly.text,
                  mood: latestMindly.mood,
                  date: latestMindly.date,
                  image: latestMindly.image,
                }}
                onUpdate={() => {}}
              />
            ) : (
              <p>No mindlys yet.</p>
            )}
            <NavLink to="/profile/mindlyspage" className="cta_red">
              See All Mindlys
            </NavLink>
          </div>
        </div>
        <MenuBar />
      </div>
    </>
  );
};

export default Home;
