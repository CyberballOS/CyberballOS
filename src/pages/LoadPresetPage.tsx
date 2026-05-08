import { useState } from 'react';
import './pageSpecificCSS/loadPresetPage.css';
import { Link, useNavigate } from "react-router-dom";
import defaultPresetsData from '../assets/defaultPresets.json' with {type: 'json'};

type UserGame = {
    name: string;
    description: string;
    settings: object;
};

function LoadPresetPage () {

    const defaultPresets = defaultPresetsData as any[];

    const getSafeVidPath = (path: string) => {
        const isSafe = path.startsWith('/') && path.endsWith('.mp4');
        return isSafe ? path : '';
    };

    const [activeTab, setActiveTab] = useState('Presets');

    const [userGames, setUserGames] = useState<UserGame[]>(() => {
        const games = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;
            try {
                const parsed = JSON.parse(localStorage.getItem(key) ?? '{}');                
                if (parsed?.settings) {
                    games.push({ name: key, description: parsed.description, settings: parsed.settings });
                }
            } catch {
                // skip non-preset keys
            }
        }
        return games;
    });

    const navigate = useNavigate();

    function loadPreset(settings: object) {
        navigate('/home', { state: { settings } });
    }

    const tabs = ['Presets', 'Your Games', 'Load File'];

    return (
        <div className="page-wrapper">
            <header className="page-header">
                <div className = "top-banner"></div>
                <h1 className="title">CyberballOS Presets</h1>
            </header>

            <div className="main-card">
                <nav className="tab-bar">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                <div className="tab-content">
                    {/* PRESETS TAB*/}
                    {/*TODO: change each preset-row to onClick to homepage that sets the settings correctly*/}
                    {activeTab === 'Presets' && (
                        <div className="presets-container">
                
                            <div className="grid-labels">
                                <span>NAME</span>
                                <span>DESCRIPTION</span>
                                <span>VIDEO</span>
                            </div>

                            {defaultPresets.map((preset: any) => (
                                <div 
                                    className="preset-row" 
                                    key={preset.name}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        loadPreset(preset.settings);
                                    }}
                                >
                                    <div className="name-col">
                                        <strong>{preset.name}</strong>
                                    </div>
                                    <div className="desc-col">
                                        <p>{preset.description}</p>
                                    </div>
                                    <div className="video-col">
                                        <div className="video-aspect-box">
                                            {getSafeVidPath(preset.video) ? (
                                                <video 
                                                    width="100%" 
                                                    autoPlay
                                                    controlsList="nodownload nofullscreen noremoteplayback"
                                                    loop
                                                    muted
                                                    playsInline
                                                    disablePictureInPicture
                                                    style={{ pointerEvents: 'none' }}
                                                    controls={false}
                                                    preload="auto"
                                                    src={getSafeVidPath(preset.video)}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <div className="video-error">Video Not Found</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <Link to="/" className="btn1">Exit</Link>
                            </div>
                        </div>   
                    )}
                    {/*YOUR GAMES TAB*/}
                    {activeTab === 'Your Games' && (
                        <div className="games-container">
                        {userGames.length > 0 ? (
                            <div className="games-list">
                                {userGames.map((game) => (
                                    <div className="preset-row" key={game.name} onClick={() => loadPreset(game.settings)}>
                                        <div className="name-col">
                                            <strong>{game.name}</strong>
                                        </div>
                                        <div className="desc-col">
                                            <p>{game.description}</p>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                            <button className="delete-btn" onClick={(e) => {
                                                e.stopPropagation();
                                                localStorage.removeItem(game.name);
                                                setUserGames(userGames.filter(g => g.name !== game.name));
                                            }}>X</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                                <div className="empty-view">
                                    <p>There are no games currently saved here.</p>
                                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <Link to="/" className="btn1">Exit</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {/*LOAD FILE TAB*/}
                    {activeTab === 'Load File' && (
                        <div className="games-container">
                            <div className="file-upload-wrapper">
                                <label className="upload-btn">
                                    Upload Preset File
                                    <input
                                        type="file"
                                        accept=".txt"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onload = (loadEvent) => {
                                                try {
                                                    const parsed = JSON.parse(loadEvent.target?.result as string);
                                                    if (parsed) {
                                                        navigate('/home', { state: { settings: parsed } });
                                                    } else {
                                                        alert("Invalid file format.");
                                                    }
                                                } catch {
                                                    alert("Error reading file. Make sure it is a valid settings file.");
                                                }
                                            };
                                            reader.readAsText(file);
                                        }}
                                    />
                                </label>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <Link to="/" className="btn1">
                                    Exit
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoadPresetPage;
