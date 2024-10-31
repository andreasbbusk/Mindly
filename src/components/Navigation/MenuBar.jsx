// Kodet af Andreas

// Import necessary dependencies
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

// Import icon images
import HomeIcon from "../../assets/HomeIcon.png";
import CalendarICon from "../../assets/CalendarIcon.png";
import ProfileICon from "../../assets/ProfileIcon.png";
import SettingsIcon from "../../assets/SettingsIcon.png";

const MenuBar = () => {
  const [isAddMindlyActive, setIsAddMindlyActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const tapAnimation = useMemo(() => ({
    scale: 0.95,
    transition: { duration: 0.1 },
  }), []);

  const underlineAnimation = useMemo(() => ({
    initial: { width: 0, opacity: 0 },
    animate: { width: "100%", opacity: 1 },
    transition: { duration: 0.3 },
  }), []);

  const handleNavigation = (path, activeTab) => {
    navigate(path, { state: { activeTab } });
    if (path === "/create-mindly") {
      setIsAddMindlyActive(prev => !prev);
    }
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const renderNavLink = (path, icon, alt, activeTab) => (
    <motion.div
      className={location.pathname === path ? "navlink active" : "navlink"}
      onClick={() => handleNavigation(path, activeTab)}
    >
      <motion.img
        className="menu_icons"
        src={icon}
        alt={alt}
        whileTap={tapAnimation}
      />
      {location.pathname === path && (
        <motion.div
          className="underline active-underline"
          initial="initial"
          animate="animate"
          variants={underlineAnimation}
        />
      )}
    </motion.div>
  );

  return (
    <motion.div
      className="menu_icons_container"
      initial={{ opacity: 1, y: 0 }}
      animate={{
        display: isAddMindlyActive ? "none" : "flex",
        y: isAddMindlyActive ? 100 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      {renderNavLink("/home", HomeIcon, "Home")}
      {renderNavLink("/profile/mindlyspage", CalendarICon, "Mindle overview", "mindlys")}
      
      <motion.div
        className={location.pathname === "/create-mindly" ? "navlink active" : "navlink"}
        onClick={() => handleNavigation("/create-mindly")}
      >
        <motion.svg
          width="38"
          height="38"
          viewBox="0 0 35 35"
          xmlns="http://www.w3.org/2000/svg"
          whileTap={tapAnimation}
        >
          <defs>
            <linearGradient
              id="linear-gradient"
              x1="5.47"
              y1="26.65"
              x2="32.53"
              y2="6.07"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#fbc673" />
              <stop offset=".95" stopColor="#f3746c" />
            </linearGradient>
          </defs>
          <circle
            cx="17.5"
            cy="17.5"
            r="17"
            fill="url(#linear-gradient)"
            stroke="black"
          />
          <g>
            <rect
              x="15.92"
              y="4.63"
              width="3.16"
              height="25.75"
              rx="1.58"
              ry="1.58"
              fill="white"
              stroke="black"
            />
            <rect
              x="4.63"
              y="15.92"
              width="25.75"
              height="3.16"
              rx="1.58"
              ry="1.58"
              fill="white"
              stroke="black"
            />
          </g>
        </motion.svg>
        {location.pathname === "/create-mindly" && (
          <motion.div
            className="underline active-underline"
            initial="initial"
            animate="animate"
            variants={underlineAnimation}
          />
        )}
      </motion.div>

      {renderNavLink("/profile/growthpage", ProfileICon, "Profile", "personal")}
      {renderNavLink("/settings", SettingsIcon, "Settings")}
    </motion.div>
  );
};

export default MenuBar;
