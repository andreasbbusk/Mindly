import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

import OnBoardingMan from "../../assets/onboarding-thinking.png";
import OnBoardingMan2 from "../../assets/onboarding-man.png";
import MindlyLogo from "../../assets/App-logo.png";

const Onboarding = () => {
  // State to keep track of the current active page and exit animation
  const [activePage, setActivePage] = useState(1);
  const [isExiting, setIsExiting] = useState(false);

  // Function to handle page changes
  const handlePageChange = (pageNumber) => {
    setIsExiting(true);
    setActivePage(pageNumber);
    setIsExiting(false);
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, x: "-100%" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100%" },
  };

  // Transition settings for animations
  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <>
      {/* Main container for onboarding content */}
      <motion.div
        initial="initial"
        animate={isExiting ? "out" : "in"}
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="onboarding-container"
      >
        <AnimatePresence mode="wait">
          {/* First onboarding page */}
          {activePage === 1 && (
            <motion.div
              key="first-page"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="first-page"
            >
              <img
                src={OnBoardingMan}
                alt="Onboarding Man"
                className="onboarding-man"
              />
              <div className="onboarding-text-container">
                <h1>Take a moment to appreciate the little things.</h1>
                <p>
                  <strong>Mindly</strong> helps you focus on gratitude by
                  capturing and reflecting on life&apos;s positive moments.
                </p>
              </div>
            </motion.div>
          )}

          {/* Second onboarding page */}
          {activePage === 2 && (
            <motion.div
              key="second-page"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="onboarding-second-page"
            >
              <div className="onboarding-second-text-container">
                <h1 className="onboarding-second-heading">
                  Litterally <br /> absolutely <br /> anywhere.
                </h1>
                <p className="onboarding-second-description">
                  Write down one thing you&apos;re grateful for <br /> each day -
                  You&apos;ll soon notice more positivity in life.
                </p>
              </div>
              <img
                src={OnBoardingMan2}
                alt="Onboarding Man"
                className="onboarding-second-image"
              />
            </motion.div>
          )}

          {/* Third onboarding page */}
          {activePage === 3 && (
            <motion.div
              key="third-page"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="third-page"
            >
              <div className="third-page-container">
                <div>
                  <h1>Mindly</h1>
                  <p>Your place to be grateful</p>
                </div>
                <div>
                  <img src={MindlyLogo} alt="Mindly Logo" />
                </div>
                  <h4>Welcome to Mindly.</h4>
                <div className="onboarding-cta-container">
                  <NavLink className="cta_red" to="/signup">
                    Get started
                  </NavLink>
                  <p>
                    Already a Mindly? Log in <NavLink className="login_cta" to="/login">Here</NavLink>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation buttons and progress indicators */}
      <div className="onboarding-button-container">
        {/* Previous page button */}
        <button
          className="onboarding-button"
          onClick={() => handlePageChange(activePage - 1)}
          style={{ visibility: activePage === 1 ? "hidden" : "visible" }}
        >
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
        </button>

        {/* Progress indicators */}
        <div className="onboarding-progress-container">
          {[1, 2, 3].map((page) => (
            <motion.div
              key={page}
              className="onboarding-progress-dot"
              initial={false}
              animate={{
                scale: activePage === page ? 1 : 0.8,
                opacity: activePage === page ? 1 : 0.5,
                backgroundColor: activePage === page ? "black" : "transparent",
              }}
              transition={{ duration: 0.3 }}
              onClick={() => handlePageChange(page)}
            />
          ))}
        </div>

        {/* Next page button */}
        <button
          className="onboarding-button"
          onClick={() => handlePageChange(activePage + 1)}
          style={{ visibility: activePage === 3 ? "hidden" : "visible" }}
        >
          <svg
            width="26"
            height="12"
            viewBox="0 0 26 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25.5303 6.53033C25.8232 6.23744 25.8232 5.76256 25.5303 5.46967L20.7574 0.696699C20.4645 0.403806 19.9896 0.403806 19.6967 0.696699C19.4038 0.989593 19.4038 1.46447 19.6967 1.75736L23.9393 6L19.6967 10.2426C19.4038 10.5355 19.4038 11.0104 19.6967 11.3033C19.9896 11.5962 20.4645 11.5962 20.7574 11.3033L25.5303 6.53033ZM0 6.75H25V5.25H0V6.75Z"
              fill="black"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Onboarding;
