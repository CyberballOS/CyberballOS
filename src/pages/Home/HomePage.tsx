import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { defaultSettings } from "../../types/Settings";
import type { Settings } from "../../types/Settings";
import "../pageSpecificCSS/homePage.css";
import PlayerTab from "./PlayerTab";
import CpuTab from "./CpuTab";
import GameplayTab from "./GameplayTab";
import ButtonTab from "./ButtonTab";
import playerImg from "../../assets/player.png";

type TabName = "player" | "cpus" | "gameplay" | "buttons";

export default function HomePage() {
    const location = useLocation();
    const [settings, setSettings] = useState<Settings>(
        (location.state as any)?.settings ?? defaultSettings
    );

    const [previewSettings, setPreviewSettings] = useState<Settings>(
        (location.state as any)?.settings ?? defaultSettings
    );
    const [activeTab, setActiveTab] = useState<TabName>("player");
    const [previewKey, setPreviewKey] = useState(0);

    useEffect(() => {
        const incomingPreset = (location.state as any)?.settings;
        if (incomingPreset) {
            setSettings(incomingPreset);
            setPreviewSettings(incomingPreset);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    function buildGameUrl() {
        const encoded = btoa(JSON.stringify(previewSettings));
        return window.location.origin + "#game?settings=" + encoded;
    }

    function refreshPreview() {
        setPreviewSettings(settings);
        setPreviewKey(previewKey + 1);
    }

    function handleSettingsChange(updated: Settings) {
        setSettings(updated);
    }

    function goToNextTab() {
        if (activeTab === "player") setActiveTab("cpus");
        else if (activeTab === "cpus") setActiveTab("gameplay");
        else if (activeTab === "gameplay") setActiveTab("buttons");
        /*The following two lines in goToNextTab() and goToPreviousTab() make the preview update automatically when switching tabs in home page
        setPreviewSettings(settings);  
        setPreviewKey(prev => prev + 1);
        */
    }

    function goToPreviousTab() {
        if (activeTab === "buttons") setActiveTab("gameplay");
        else if (activeTab === "gameplay") setActiveTab("cpus");
        else if (activeTab === "cpus") setActiveTab("player");
        //setPreviewSettings(settings); 
        //setPreviewKey(prev => prev + 1);
    }

    function buildLiveGameUrl() {
        const encoded = btoa(JSON.stringify(settings));
        return window.location.origin + "#game?settings=" + encoded;
    }

    return (
        <div className="landing-page">
            <img src={playerImg} alt="Banner" className="welcome-image1" />
            <h1 className="configHeader">CyberballOS Configuration Builder</h1>
            <div className="content">
                <iframe
                    key={previewKey}
                    src={buildGameUrl()}
                    id="gamePreview"
                    className="preview-frame"
                />
                <div className="container">
                    {activeTab === "player" && (
                        <PlayerTab settings={settings} setSettings={handleSettingsChange} />
                    )}
                    {activeTab === "cpus" && (
                        <CpuTab settings={settings} setSettings={handleSettingsChange} />
                    )}
                    {activeTab === "gameplay" && (
                        <GameplayTab settings={settings} setSettings={handleSettingsChange} />
                    )}
                    {activeTab === "buttons" && (
                        <ButtonTab url={buildLiveGameUrl()} settings={settings} />
                    )}
                    {activeTab !== "buttons" && (
                        <div className="cpu-action-buttons" style={{ paddingTop: 20 }}>
                            <button className="home-page-buttons" onClick={refreshPreview}>Preview Game</button>
                            <a className="home-page-buttons" href="./" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>Exit</a>
                        </div>
                    )}
                    {activeTab !== "player" && (
                        <button className="previous" onClick={goToPreviousTab}>&#8249;</button>
                    )}
                    {activeTab !== "buttons" && (
                        <button className="next" onClick={goToNextTab}>&#8250;</button>
                    )}
                </div>
            </div>
        </div>
    );
}