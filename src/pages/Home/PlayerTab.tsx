import { useState } from "react";
import type { Settings } from "../../types/Settings";
import InfoButton from "../../components/InfoButton";
import LabelWithInfo from "../../components/LabelWithInfo";
import useScrollLock from "../../hooks/useScrollLock";

type Props = {
    settings: Settings;
    setSettings: (updated: Settings) => void;
};

function PlayerTab({ settings, setSettings }: Props) {

    function toSeconds(ms: number | undefined, fallback: number) {
        return ms != null ? ms / 1000 : fallback;
    }

    function updateSettings(fields: Partial<Settings>) {
        setSettings({ ...settings, ...fields });
    }
    
    function updatePlayer(fields: Partial<typeof settings.player>) {
        setSettings({ ...settings, player: { ...settings.player, ...fields } });
    }
    
    function updatePlayerName(name: string) {
        updatePlayer({ name });
    }
    
    function updateTint(tint: string) {
        updatePlayer({ tint });
    }
    
    function updatePortraitBuff(portraitBuff: string) {
        updatePlayer({ portraitBuff });
    }
    
    function hasFlag(flag: number) {
        return ((settings.player.leaveTrigger ?? 0) & flag) !== 0;
    }
    
    function toggleFlag(flag: number, value: boolean) {
        const current = settings.player.leaveTrigger ?? 0;
        const updated = value ? current | flag : current & ~flag;
        updatePlayer({ leaveTrigger: updated });
    }

    const [showDefaultPortraitModal, setShowDefaultPortraitModal] = useState(false);
    const [draftPlayer, setDraftPlayer] = useState({
        leaveTurn: (settings.player.leaveTurn ?? 10).toString(),
        leaveTurnVariance: (settings.player.leaveTurnVariance ?? 0).toString(),
        leaveTime: toSeconds(settings.player.leaveTime, 40).toString(),
        leaveTimeVariance: toSeconds(settings.player.leaveTimeVariance, 0).toString(),
        leaveIgnored: (settings.player.leaveIgnored ?? 4).toString(),
        leaveIgnoredVariance: (settings.player.leaveIgnoredVariance ?? 0).toString(),
        leaveTimeIgnored: toSeconds(settings.player.leaveTimeIgnored, 15).toString(),
        leaveTimeIgnoredVariance: toSeconds(settings.player.leaveTimeIgnoredVariance, 0).toString(),
        leaveOtherLeaver: (settings.player.leaveOtherLeaver ?? 1).toString(),
    });

    useScrollLock(showDefaultPortraitModal);
    
    function draftChange(field: string, value: string) {
        setDraftPlayer(prev => ({ ...prev, [field]: value }));
    }
    
    function draftCommit() {
        updatePlayer({
            leaveTurn: Math.max(0, parseInt(draftPlayer.leaveTurn) || 0),
            leaveTurnVariance: Math.max(0, parseInt(draftPlayer.leaveTurnVariance) || 0),
            leaveTime: Math.max(0, Math.round((parseFloat(draftPlayer.leaveTime) || 0) * 1000)),
            leaveTimeVariance: Math.max(0, Math.round((parseFloat(draftPlayer.leaveTimeVariance) || 0) * 1000)),
            leaveIgnored: Math.max(0, parseInt(draftPlayer.leaveIgnored) || 0),
            leaveIgnoredVariance: Math.max(0, parseInt(draftPlayer.leaveIgnoredVariance) || 0),
            leaveTimeIgnored: Math.max(0, Math.round((parseFloat(draftPlayer.leaveTimeIgnored) || 0) * 1000)),
            leaveTimeIgnoredVariance: Math.max(0, Math.round((parseFloat(draftPlayer.leaveTimeIgnoredVariance) || 0) * 1000)),
            leaveOtherLeaver: Math.max(0, parseInt(draftPlayer.leaveOtherLeaver) || 0),
        });
    }
    
    function convertImageToUrl() {
        window.open("https://postimages.org/", "_blank");
    }

    function chooseDefaultPortrait(url: string) {
        updatePlayer({ portraitBuff: url });
        setShowDefaultPortraitModal(false);
    }

    function clearPortrait() {
        updatePlayer({ portraitBuff: "" });
    }

    return (
        <div>
            <h2>
                Participant{" "}
                <InfoButton content={
                    <p>This is the player controlled by the participant.</p>
                } />
            </h2>

            <div className="two-column-grid">
                {/* Name button */}
                <label>Name</label>
                <input type="text" className="inline-input" value={settings.player.name} onChange={(e) => updatePlayerName(e.target.value)} />

                {/* Customize button */}
                <LabelWithInfo label="Customize" info={
                    <p>Select to change the color of the player or add a portrait to the player.</p>
                } />
                <input type="checkbox" checked={settings.displayPlayerCustomizations} onChange={(e) => updateSettings({ displayPlayerCustomizations: e.target.checked })} />
            </div>

            {settings.displayPlayerCustomizations && (
                <div className="two-column-grid">
                    {/* Color button */}
                    <label className="indent-1">Color</label>
                    <input type="color" value={settings.player.tint ?? "#ffffff"} onChange={(e) => updateTint(e.target.value)} />

                    {/* Portrait button */}
                    <div className="indent-1">
                        <LabelWithInfo label="Portrait" info={
                            <>
                                <p>Insert a URL to give the player a portrait for the game.</p>
                                <br />
                                <h4>Note</h4>
                                <p>Not all URLs are supported by this feature, look into the manual for a detailed description. Any image stored in Qualtrics and any publicly available <strong>direct</strong> URL to the image should work.</p>
                            </>
                        } />
                    </div>
                    {settings.player.portraitBuff && (
                        <>
                            <img src={settings.player.portraitBuff} className="portrait-preview" />
                            <label></label>
                        </>
                    )}

                    {/* Enter URL text */}
                    <input type="text" value={settings.player.portraitBuff ?? ""} placeholder="Enter URL" onChange={(e) => updatePortraitBuff(e.target.value)} />

                    {/* Convert to URL button */}
                    <label></label>
                    <button className="bottom-buttons portrait-btn" onClick={convertImageToUrl}>Convert Image to URL</button>

                    <label></label>

                    {/* Select Default button */}
                    <button className="bottom-buttons portrait-btn" onClick={() => setShowDefaultPortraitModal(true)}>Select Default</button>

                    <label></label>

                    {/* Clear button */}
                    <button className="bottom-buttons portrait-btn" onClick={clearPortrait}>Clear</button>
                </div>
            )}

            {/* Leave Game Options button */}
            <div className="two-column-grid">
                <LabelWithInfo label="Leave Game Options" info={
                    <>
                        <p>Select to change a trigger to tempt the participant to leave the game. It causes a <strong>Leave Game</strong> button to appear where the participant can click to end the game.</p>
                        <br />
                        <h4>Note</h4>
                        <p>Variance refers to the deviation (+/-) away from the set value.</p>
                        <br />
                        <h4>Example</h4>
                        <p>A variance of 2 means the participant is shown the <strong>Leave Game</strong> button +/- 2 throws from a 10 Throws Elapsed Threshold (8 to 12 throws).</p>
                    </>
                } />
                <input type="checkbox" checked={settings.displayPlayerLeaveTriggers} onChange={(e) => updateSettings({ displayPlayerLeaveTriggers: e.target.checked })} />
            </div>

            {settings.displayPlayerLeaveTriggers && (
                <div>

                    {/* Throws Elapsed button */}
                    <div className="two-column-grid">
                        <div className="indent-1">
                            <LabelWithInfo label="Throws Elapsed" info={
                                <p>The number of throws between all players before the <strong>Leave Game</strong> button appears.</p>
                            } />
                        </div>
                        <input type="checkbox" checked={hasFlag(1)} onChange={(e) => toggleFlag(1, e.target.checked)} />
                    </div>
                    {hasFlag(1) && (
                        <div className="two-column-grid">
                            <label className="indent-2">Leave Threshold</label>
                            <input type="number" className="inline-input" value={draftPlayer.leaveTurn} onChange={(e) => draftChange("leaveTurn", e.target.value)} onBlur={draftCommit} />                           
                            <label className="indent-2">Variance</label>
                            <input type="number" className="inline-input" value={draftPlayer.leaveTurnVariance} onChange={(e) => draftChange("leaveTurnVariance", e.target.value)} onBlur={draftCommit} />
                        </div>
                    )}

                    {/* Time Elapsed button */}
                    <div className="two-column-grid">
                        <div className="indent-1">
                            <LabelWithInfo label="Time Elapsed" info={
                                <p>How long the game is played <strong>in seconds</strong> before the <strong>Leave Game</strong> button appears.</p>
                            } />
                        </div>
                        <input type="checkbox" checked={hasFlag(2)} onChange={(e) => toggleFlag(2, e.target.checked)} />
                    </div>
                    {hasFlag(2) && (
                        <div className="two-column-grid">
                            <label className="indent-2">Leave Threshold (s)</label>
                            <input type="number" className="inline-input" value={draftPlayer.leaveTime} onChange={(e) => draftChange("leaveTime", e.target.value)} onBlur={draftCommit} />
                            <label className="indent-2">Variance (s)</label>
                            <input type="number" className="inline-input" value={draftPlayer.leaveTimeVariance} onChange={(e) => draftChange("leaveTimeVariance", e.target.value)} onBlur={draftCommit} />
                        </div>
                    )}

                    {/* Throws Ignored button */}
                    <div className="two-column-grid">
                        <div className="indent-1">
                            <LabelWithInfo label="Throws Ignored" info={
                                <p>How many throws occur only between the CPUs before the <strong>Leave Game</strong> button appears for the participant.</p>
                            } />
                        </div>
                        <input type="checkbox" checked={hasFlag(4)} onChange={(e) => toggleFlag(4, e.target.checked)} />
                    </div>
                    {hasFlag(4) && (
                        <div className="two-column-grid">
                            <label className="indent-2">Leave Threshold</label>
                            <input type="number" className="inline-input" value={draftPlayer.leaveIgnored} onChange={(e) => draftChange("leaveIgnored", e.target.value)} onBlur={draftCommit} />                            
                            <label className="indent-2">Variance</label>
                            <input type="number" className="inline-input" value={draftPlayer.leaveIgnoredVariance} onChange={(e) => draftChange("leaveIgnoredVariance", e.target.value)} onBlur={draftCommit} />
                        </div>
                    )}

                    {/* Time Ignored button */}
                    <div className="two-column-grid">
                        <div className="indent-1">
                            <LabelWithInfo label="Time Ignored" info={
                                <p>How much time <strong>in seconds</strong> the CPUs spend throwing to each other before the <strong>Leave Game</strong> button appears for the participant.</p>
                            } />
                        </div>
                        <input type="checkbox" checked={hasFlag(16)} onChange={(e) => toggleFlag(16, e.target.checked)} />
                    </div>
                    {hasFlag(16) && (
                        <div className="two-column-grid">
                            <label className="indent-2">Leave Threshold (s)</label>
                            <input type="number" className="inline-input" value={draftPlayer.leaveTimeIgnored} onChange={(e) => draftChange("leaveTimeIgnored", e.target.value)} onBlur={draftCommit} />                            
                            <label className="indent-2">Variance (s)</label>
                            <input type="number" className="inline-input" value={draftPlayer.leaveTimeIgnoredVariance} onChange={(e) => draftChange("leaveTimeIgnoredVariance", e.target.value)} onBlur={draftCommit} />
                        </div>
                    )}

                    {/* CPUs Leaving button */}
                    <div className="two-column-grid">
                        <div className="indent-1">
                            <LabelWithInfo label="CPUs Leaving" info={
                                <p>The number of CPUs that must leave before the <strong>Leave Game</strong> button appears for the participant.</p>
                            } />
                        </div>
                        <input type="checkbox" checked={hasFlag(8)} onChange={(e) => toggleFlag(8, e.target.checked)} />
                    </div>
                    {hasFlag(8) && (
                        <div className="two-column-grid">
                            <label className="indent-2">Leave Threshold</label>
                            <input type="number" className="inline-input" value={draftPlayer.leaveOtherLeaver} onChange={(e) => draftChange("leaveOtherLeaver", e.target.value)} onBlur={draftCommit} />
                        </div>
                    )}

                </div>
            )}

            {/* Default Portrait Modal */}
            {showDefaultPortraitModal && (
                <div className="modal-overlay" onClick={() => setShowDefaultPortraitModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowDefaultPortraitModal(false)}>X</button>
                        <h4>Portrait Selection</h4>
                        <p>Select an image below to set it as the portrait for the participant.</p>
                        <div className="portrait-options">
                            {(settings.defaultPortraits ?? []).map((url, i) => (
                                <img key={i} src={url} onClick={() => chooseDefaultPortrait(url)} className="default-portrait" alt={`default portrait ${i}`} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default PlayerTab;
