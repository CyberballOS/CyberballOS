import { HashRouter, Routes, Route} from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import WelcomePage from "./pages/LandingPage";
import HelpPage from "./pages/HelpPage";
import LoadPresetPage from "./pages/LoadPresetPage";
import GamePage from "./pages/GamePage";
import TutorialPage from "./pages/TutorialPage";
import './App.css'

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/presets" element={<LoadPresetPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/tutorial" element={<TutorialPage />} />
            </Routes>
        </HashRouter>
    );
}