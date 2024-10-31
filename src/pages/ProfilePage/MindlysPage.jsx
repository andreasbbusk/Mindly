import { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByChild,
} from "firebase/database";
import { getAuth } from "firebase/auth";

import MindlyCard from "../../components/ProfilePage/MindlyCard";
import DayCards from "../../components/ProfilePage/DayCards";
import Calendar from "../../components/ProfilePage/CalendarOpen";
import CalendarIcon from "../../assets/calendar_mindlys.png";
import LineIcon from "../../assets/LeftIllustration.webp";

const MindlysPage = () => {
  // State variables
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [hasMindlys, setHasMindlys] = useState(false);
  const [entries, setEntries] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  // Helper functions
  const getWeekStartDate = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const getWeekEndDate = (date) => {
    const startDate = getWeekStartDate(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return endDate;
  };

  const getCurrentWeek = () => {
    const today = new Date();
    return {
      start: getWeekStartDate(today),
      end: getWeekEndDate(today),
    };
  };

  // Event handlers
  const openModal = () => {
    setModalIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalIsOpen(false);
    document.body.style.overflow = "unset";
  };

  const handleWeekSelect = (week) => {
    setSelectedWeek(week);
  };

  const handleCardClick = useCallback(
    (entry) => {
      navigate(`/mindly/${entry.id}/full-view`);
    },
    [navigate]
  );

  // Effects
  useEffect(() => {
    Modal.setAppElement("#root");

    const today = new Date();
    setSelectedWeek({
      start: getWeekStartDate(new Date(today)), // Create new Date instance
      end: getWeekEndDate(new Date(today)), // Create new Date instance
    });

    if (auth.currentUser) {
      const db = getDatabase();
      const userMindlysRef = ref(db, `users/${auth.currentUser.uid}/mindlys`);
      const mindlysQuery = query(userMindlysRef, orderByChild("date"));

      const unsubscribe = onValue(mindlysQuery, (snapshot) => {
        if (snapshot.exists()) {
          const mindlysData = snapshot.val();
          const mindlysArray = Object.entries(mindlysData).map(
            ([id, data]) => ({
              id,
              ...data,
              date: new Date(data.date).getTime(), // Ensure date is converted to timestamp
            })
          );
          console.log("Fetched mindlys:", mindlysArray); // Add debugging log
          setHasMindlys(true);
          setEntries(mindlysArray);
        } else {
          setHasMindlys(false);
          setEntries([]);
        }
      });

      return () => unsubscribe();
    }
  }, [auth.currentUser]);

  // Filter entries based on selected week
  const filteredEntries = entries.filter((entry) => {
    if (!selectedWeek) return false;

    const entryDate = new Date(entry.date);
    const startDate = new Date(selectedWeek.start);
    const endDate = new Date(selectedWeek.end);

    // Set hours to 0 for consistent date comparison
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    entryDate.setHours(0, 0, 0, 0);

    return entryDate >= startDate && entryDate <= endDate;
  });

  return (
    <>
      <section className="mindlys-content">
        <div>
          <div className="mindlys-header">
            <h2>Hey, {auth.currentUser?.displayName || ""} </h2>
            <p>Here you can keep track with your Mindly&apos;s.</p>
            <img src={LineIcon} alt="Line" />
          </div>

          <div className="mindlys-container">
            <div className="mindlys-header">
              <h4>Your Mindly&apos;s:</h4>
            </div>

            {/* Calendar Section */}
            <div className="mindlys-calendar">
              <div>
                <img
                  className="mindlys-calendar-icon"
                  src={CalendarIcon}
                  alt="Calendar"
                  onClick={openModal}
                />
              </div>
              <div className="mindlys-calendar-date">
                <p>
                  {selectedWeek?.start.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <svg
                  width="18"
                  height="12"
                  viewBox="0 0 26 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.5303 6.53033C25.8232 6.23744 25.8232 5.76256 25.5303 5.46967L20.7574 0.696699C20.4645 0.403806 19.9896 0.403806 19.6967 0.696699C19.4038 0.989593 19.4038 1.46447 19.6967 1.75736L23.9393 6L19.6967 10.2426C19.4038 10.5355 19.4038 11.0104 19.6967 11.3033C19.9896 11.5962 20.4645 11.5962 20.7574 11.3033L25.5303 6.53033ZM0 6.75H25V5.25H0V6.75Z"
                    fill="black"
                  />
                </svg>
                <p>
                  {selectedWeek?.end.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <DayCards
              entries={filteredEntries}
              onCardClick={handleCardClick}
              selectedWeek={selectedWeek}
              onWeekChange={handleWeekSelect}
            />

            {/* No Mindlys Message */}
            {!hasMindlys && (
              <div className="no-mindlys-message">
                <h3>You haven&apos;t added any Mindlys yet!</h3>
                <p>Start by creating your first Mindly.</p>
                <NavLink className="cta_red" to="/create-mindly">
                  Create Mindly
                </NavLink>
              </div>
            )}

            {/* Mindly Cards */}
            {hasMindlys && filteredEntries.length === 0 && (
              <div className="mindly-placeholder">
                <p>No Mindlys for this week.</p>
                <button
                  className="cta_red current-week-button"
                  onClick={() => handleWeekSelect(getCurrentWeek())}
                >
                  Go to Current Week
                </button>
              </div>
            )}
            {filteredEntries.map((entry) => (
              <MindlyCard
                key={entry.id}
                selectedEntry={entry}
                onUpdate={() => {}} // Remove the handleCardClick here
              />
            ))}
          </div>
        </div>
      </section>
      {/* Calendar Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Calendar Modal"
      >
        <Calendar onClose={closeModal} onWeekSelect={handleWeekSelect} />
      </Modal>
    </>
  );
};

export default MindlysPage;
