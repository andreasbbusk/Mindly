import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Main Pages
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import MindlyPost from "./pages/MindlyPost";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Error from "./pages/Error";

// Profile Page Components
import MindlysPage from "./pages/ProfilePage/MindlysPage";
import GrowthPage from "./pages/ProfilePage/GrowthPage";
import MindlyEdit from "./components/ProfilePage/MindlyEdit";
import MindlyFullView from "./components/ProfilePage/MindlyFullView";
import MoodVisualization from "./components/ProfilePage/MoodVisualization";

// Onboarding and Splash Screen
import Onboarding from "./pages/Onboarding/Onboarding";
import Splashscreen from "./pages/Splashscreen"

// Settings Pages
import SettingsFrontScreen from "./pages/Settings/SettingsFrontScreen";
import SettingsPersonal from "./pages/Settings/SettingsPersonal";
import SettingsName from "./pages/Settings/SettingsName";
import SettingsLanguage from "./pages/Settings/SettingsLanguage";
import SettingsNotifications from "./pages/Settings/SettingsNotifications";
import SettingsPrivacy from "./pages/Settings/SettingsPrivacy";
import SettingsDelete from "./pages/Settings/SettingsDelete";
import SettingsConfirm from "./pages/Settings/SettingsConfirm";
import SettingUsername from "./pages/Settings/SettingsUsername";
import SettingPassword from "./pages/Settings/SettingsPassword";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApp = async () => {
      // Simulate loading time (remove this in production)
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsLoading(false);
    };

    loadApp();
  }, []);

  if (isLoading) {
    return <Splashscreen />;
  }

  return (
    <>
      <Routes>
        {/* Redirect root to HomePage */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Onboarding and Authentication */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<SignUp />} />

        {/* Main App Routes */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />}>
          <Route index element={<MindlysPage />} />
          <Route path="mindlyspage" element={<MindlysPage />} />
          <Route path="growthpage" element={<GrowthPage />}>
            <Route path="mood" element={<MoodVisualization />} />
          </Route>
        </Route>
        <Route path="/create-mindly" element={<MindlyPost />} />
        <Route path="/mindly/:id/edit" element={<MindlyEdit />} />
        <Route path="/mindly/:id/full-view" element={<MindlyFullView />} />

        {/* Settings Routes */}
        <Route path="/settings" element={<SettingsFrontScreen />} />
        <Route path="/personal" element={<SettingsPersonal />} />
        <Route path="/name" element={<SettingsName />} />
        <Route path="/language" element={<SettingsLanguage />} />
        <Route path="/notifications" element={<SettingsNotifications />} />
        <Route path="/privacy" element={<SettingsPrivacy />} />
        <Route path="/delete" element={<SettingsDelete />} />
        <Route path="/confirm-delete" element={<SettingsConfirm />} />
        <Route path="/Username" element={<SettingUsername />} />
        <Route path="/Password" element={<SettingPassword />} />

        {/* Error Route */}
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </>
  );
}

export default App;
