// React and routing imports
import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Asset imports
// Streger (Lines)
import VenstreStreg from "../assets/LeftIllustration.png";
import HoejreStreg from "../assets/RightIllustration.png";

// Smileys uden farve (Smileys without color)
import HeltSurUdenFarve from "../assets/HeltSurUdenFarve.png";
import LidtSurUdenFarve from "../assets/LidtSurUdenFarve.png";
import MellemSurUdenFarve from "../assets/MellemSurUdenFarve.png";
import LidtGladUdenFarve from "../assets/LidtGladUdenFarve.png";
import HeltGladUdenFarve from "../assets/HeltGladUdenFarve.png";

// Smileys med farve (Smileys with color)
import HeltSurMedFarve from "../assets/HeltSurMedFarve.png";
import LidtSurMedFarve from "../assets/LidtSurMedFarve.png";
import MellemSurMedFarve from "../assets/MellemSurMedFarve.png";
import LidtGladMedFarve from "../assets/LidtGladMedFarve.png";
import HeltGladMedFarve from "../assets/HeltGladMedFarve.png";

// Other assets
import AddPhoto from "../assets/AddPhoto.png";

// Component imports
import TopNav from "../components/Navigation/TopNav";

// Firebase imports
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push } from "firebase/database";

const MindlyPost = () => {
  // State hooks
  const [selectedMood, setSelectedMood] = useState(null);
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Refs
  const fileInputRef = useRef(null);

  // Hooks
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase();

  // Smileys configuration
  const moodImages = useMemo(() => [
    { name: "HeltSur", withColor: HeltSurMedFarve, withoutColor: HeltSurUdenFarve },
    { name: "LidtSur", withColor: LidtSurMedFarve, withoutColor: LidtSurUdenFarve },
    { name: "MellemSur", withColor: MellemSurMedFarve, withoutColor: MellemSurUdenFarve },
    { name: "LidtGlad", withColor: LidtGladMedFarve, withoutColor: LidtGladUdenFarve },
    { name: "HeltGlad", withColor: HeltGladMedFarve, withoutColor: HeltGladUdenFarve },
  ], []);

  // Functions
  const handleCreateMindly = async () => {
    if (!auth.currentUser) {
      console.error('User not authenticated');
      alert('You must be logged in to create a Mindly.');
      return;
    }

    const newMindly = {
      subject,
      text,
      mood: selectedMood,
      date: new Date().toISOString(),
      image: selectedImage,
      userId: auth.currentUser.uid,
    };

    try {
      const mindlysRef = ref(db, `users/${auth.currentUser.uid}/mindlys`);
      await push(mindlysRef, newMindly);
      navigate("/profile/mindlyspage");
    } catch (error) {
      console.error('Failed to save mindly:', error);
      alert('Failed to save your mindly. Please try again.');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  // JSX
  const renderMoodImages = moodImages.map((mood) => (
    <img
      key={mood.name}
      src={selectedMood === mood.name ? mood.withColor : mood.withoutColor}
      alt={mood.name}
      onClick={() => setSelectedMood(mood.name)}
      loading="lazy"
    />
  ));

  // Component render
  return (
    <div className="mindly-post-container">
      <TopNav />
      <div className="MindlyPost-Overskrift">
        <h1>Feeling Grateful?</h1>
      </div>

      <div className="MindlyPost-streg-box">
        <div className="MindlyPost-Hoejre">
          <img src={HoejreStreg} alt="Right illustration" loading="lazy" />
        </div>

        <div className="MindlyPost-Venstre">
          <img src={VenstreStreg} alt="Left illustration" loading="lazy" />
        </div>
      </div>

      <div className="MindlyPost-UnderOverskrift">
        <p>
          Write down your grateful thoughts and save it to your Mindly&apos;s to keep
        </p>
      </div>

      <div className="MindlyPost-Subject">
        <h3>Subject</h3>
        <input 
          type="text" 
          placeholder="Write a subject line" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="MindlyPost-Text">
        <h3>Text</h3>
        <textarea 
          placeholder="Use this space to write your personal Mindly"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>

      <div className="mindly-post-smiley-box">
        <h3>Select your emotion</h3>
        <div className="MindlyPost-Smiley-Container">
          <div className="MindlyPost-Smiley">
            {renderMoodImages}
          </div>
        </div>
      </div>

      <div className="MindlyPost-AddPhoto">
        <h4>Add photo</h4>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <img
          src={selectedImage || AddPhoto}
          alt={selectedImage ? "Selected photo" : "Add photo"}
          onClick={handleAddPhotoClick}
          loading="lazy"
        />
      </div>

      <div className="MindlyPost-PostKnap">
        <button onClick={handleCreateMindly}>
          <p>Create Mindly</p>
        </button>
      </div>
    </div>
  );
};

export default MindlyPost;
