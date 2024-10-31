// Kodet af Andreas

// Import necessary dependencies and components
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import MindlysPage from "./MindlysPage";
import GrowthPage from "./GrowthPage";

import MenuBar from "../../components/Navigation/MenuBar";

// ProfilePage component definition
const ProfilePage = () => {
  // Hooks for navigation and location
  const location = useLocation();
  const navigate = useNavigate();

  // State to manage active tab
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "mindlys");

  // Effect to update active tab based on URL path
  useEffect(() => {
    const path = location.pathname.split('/profile/').pop();
    if (path === "mindlyspage" || path === "profile") {
      setActiveTab("mindlys");
    } else if (path === "growthpage") {
      setActiveTab("personal");
    }
  }, [location]);

  // Function to handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/profile/${tab === "mindlys" ? "mindlyspage" : "growthpage"}`, { replace: true });
  };

  // Function to handle back navigation
  const handleBackClick = () => {
    navigate(-1);
  };

  // Motion animations
  const tabButtonAnimation = {
    whileTap: { scale: 0.95 },
    layout: true
  };

  const underlineAnimation = {
    initial: false,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    }
  };

  return (
    <div className="profile-page-container">
      {/* Navigation Bar */}
      <div className="nav-bar">
        {/* Back button */}
        <div className="nav-bar-back-button" onClick={handleBackClick}>
          <svg
            width="26"
            height="12"
            viewBox="0 0 26 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.469669 5.46967C0.176777 5.76256 0.176777 6.23744 0.469669 6.53033L5.24264 11.3033C5.53553 11.5962 6.01041 11.5962 6.3033 11.3033C6.59619 11.0104 6.59619 10.5355 6.3033 10.2426L2.06066 6L6.3033 1.75736C6.59619 1.46447 6.59619 0.989593 6.3033 0.696699C6.01041 0.403806 5.53553 0.403806 5.24264 0.696699L0.469669 5.46967ZM26 5.25L1 5.25V6.75L26 6.75V5.25Z"
              fill="black"
            />
          </svg>
        </div>

        {/* Tab container */}
        <div className="nav-bar-tab-container">
          <div className="nav-bar-tab">
            {/* My Mindlys Tab */}
            <motion.button
              className={`nav-bar-tab-button ${
                activeTab === "mindlys" ? "active" : ""
              }`}
              onClick={() => handleTabChange("mindlys")}
              {...tabButtonAnimation}
            >
              My Mindlys
              {activeTab === "mindlys" && (
                <motion.div
                  className="underline"
                  {...underlineAnimation}
                />
              )}
            </motion.button>

            {/* Personal Growth Tab */}
            <motion.button
              className={`nav-bar-tab-button ${
                activeTab === "personal" ? "active" : ""
              }`}
              onClick={() => handleTabChange("personal")}
              {...tabButtonAnimation}
            >
              Personal growth
              {activeTab === "personal" && (
                <motion.div
                  className="underline"
                  {...underlineAnimation}
                />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="profile-page-content">
        {/* Mindlys content when active */}
        {activeTab === "mindlys" && (
          <>
            <MindlysPage />
            <div className="profile-page-spacer"></div>
          </>
        )}

        {/* Personal Growth content when active */}
        {activeTab === "personal" && <GrowthPage />}
      </div>

      {/* Bottom navigation menu */}
      <MenuBar />
    </div>
  );
};

export default ProfilePage;
