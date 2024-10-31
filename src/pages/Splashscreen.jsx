import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import MindlyLogo from "../assets/App-logo.png";

// Component for the splash screen
const Splashscreen = () => {
  // State for visible dots and loading progress
  const [visibleDots, setVisibleDots] = useState(0);
  const [prerendered, setPrerendered] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // Effect to handle navigation after splash screen and prerendering
  useEffect(() => {
    const prerenderComponents = async () => {
      // Prerender necessary components
      await import("../pages/HomePage");
      await import("../pages/Onboarding/Onboarding");
      setPrerendered(true);
    };

    prerenderComponents();
  }, []);

  // Effect to navigate when components are fully loaded
  useEffect(() => {
    if (prerendered) {
      // Check Firebase authentication state
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          navigate("/home", { replace: true });
        } else {
          // No user is signed in
          navigate("/onboarding", { replace: true });
        }
      });
    }
  }, [prerendered, navigate, auth]);

  // Effect to animate loading dots
  useEffect(() => {
    const dotsAppearEffect = setInterval(() => {
      setVisibleDots((prevDots) => (prevDots === 3 ? 0 : prevDots + 1));
    }, 400);

    return () => clearInterval(dotsAppearEffect);
  }, []);

  // Generate loading dots
  const loadingDots = Array(3)
    .fill(".")
    .map((dot, index) => (
      <span key={index} style={{ opacity: index < visibleDots ? 1 : 0 }}>
        {dot}
      </span>
    ));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="splashscreen"
    >
      <h1>Mindly.</h1>
      <img src={MindlyLogo} alt="Mindly Logo" className="splashscreen-logo" />
      <h4>Loading{loadingDots}</h4>
      <motion.div className="loading-indicator" />
    </motion.div>
  );
};

export default Splashscreen;
