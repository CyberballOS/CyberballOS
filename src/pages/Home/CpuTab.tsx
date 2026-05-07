import { useState, useEffect } from "react";
import type { Settings, CpuSettings } from "../../types/Settings";
import InfoButton from "../../components/InfoButton";
import LabelWithInfo from "../../components/LabelWithInfo";
import useScrollLock from "../../hooks/useScrollLock";

type Props = {
    settings: Settings;
    setSettings: (updated: Settings) => void;
};

function CpuTab({ settings, setSettings }: Props) {
    const [activeCpuIndex, setActiveCpuIndex] = useState(0);
    const [nameInput, setNameInput] = useState(settings.computerPlayers[0]?.name ?? "");
    const [portraitInput, setPortraitInput] = useState(settings.computerPlayers[0]?.portraitBuff ?? "");
    const [draftCpu, setDraftCpu] = useState<Record<string, string>>({});

    function toSeconds(ms: number | undefined, fallback: number) {
        return ms != null ? ms / 1000 : fallback;
    }

    useEffect(() => {
        const cpu = settings.computerPlayers[activeCpuIndex];
        setNameInput(cpu.name);
        setPortraitInput(cpu.portraitBuff ?? "");
        setDraftCpu({
            throwDelay: toSeconds(cpu.throwDelay, 3).toString(),
            throwDelayVariance: toSeconds(cpu.throwDelayVariance, 1).toString(),
            catchDelay: toSeconds(cpu.catchDelay, 0.5).toString(),
            catchDelayVariance: toSeconds(cpu.catchDelayVariance, 0.2).toString(),
            leaveTurn: (cpu.leaveTurn ?? 10).toString(),
            leaveTurnVariance: (cpu.leaveTurnVariance ?? 0).toString(),
            leaveTurnChance: (cpu.leaveTurnChance ?? 100).toString(),
            leaveTime: toSeconds(cpu.leaveTime, 40).toString(),
            leaveTimeVariance: toSeconds(cpu.leaveTimeVariance, 0).toString(),
            leaveTimeChance: (cpu.leaveTimeChance ?? 100).toString(),
            leaveIgnored: (cpu.leaveIgnored ?? 4).toString(),
            leaveIgnoredVariance: (cpu.leaveIgnoredVariance ?? 0).toString(),
            leaveIgnoredChance: (cpu.leaveIgnoredChance ?? 100).toString(),
            leaveTimeIgnored: toSeconds(cpu.leaveTimeIgnored, 15).toString(),
            leaveTimeIgnoredVariance: toSeconds(cpu.leaveTimeIgnoredVariance, 0).toString(),
            leaveTimeIgnoredChance: (cpu.leaveTimeIgnoredChance ?? 100).toString(),
            leaveOtherLeaver: (cpu.leaveOtherLeaver ?? 1).toString(),
            leaveOtherLeaverChance: (cpu.leaveOtherLeaverChance ?? 100).toString(),
            // should change after default data is fixed
            ...Object.fromEntries(
                (cpu.targetPreference ?? []).map((v, i) => [
                    `targetPreference_${i}`,
                    i === activeCpuIndex + 1 ? "0" : v.toString()
                ])
            ),
        });
    }, [activeCpuIndex]);

    const [showCustomize, setShowCustomize] = useState(false);
    const [showDefaultPortraitModal, setShowDefaultPortraitModal] = useState(false);
    const [showDelays, setShowDelays] = useState(false);
    const [showTargetPrefs, setShowTargetPrefs] = useState(true);
    const [showLeaveOptions, setShowLeaveOptions] = useState(false);
    const cpu = settings.computerPlayers[activeCpuIndex];

    useScrollLock(showDefaultPortraitModal);

    useEffect(() => {
        const updatedList = settings.computerPlayers.map((cpu, cpuIndex) => {
            if (cpu.targetPreference.length >= settings.computerPlayers.length + 1) {
                return cpu;
            }
            const pref = [...cpu.targetPreference];
            pref.splice(cpuIndex + 1, 0, 0); 
            return { ...cpu, targetPreference: pref };
        });
        setSettings({ ...settings, computerPlayers: updatedList });
    }, []);


    function hasFlag(flag: number) {
        return ((cpu.leaveTrigger ?? 0) & flag) !== 0;
    }
    
    function commitCurrentInputs() {
        console.log("committing targetPreference", (cpu.targetPreference ?? []).map((_, i) => parseInt(draftCpu[`targetPreference_${i}`]) || 0));
        updateCpu(activeCpuIndex, {
            throwDelay: Math.max(0, Math.round((parseFloat(draftCpu.throwDelay) || 0) * 1000)),
            throwDelayVariance: Math.max(0, Math.round((parseFloat(draftCpu.throwDelayVariance) || 0) * 1000)),
            catchDelay: Math.max(0, Math.round((parseFloat(draftCpu.catchDelay) || 0) * 1000)),
            catchDelayVariance: Math.max(0, Math.round((parseFloat(draftCpu.catchDelayVariance) || 0) * 1000)),
            leaveTurn: Math.max(0, parseInt(draftCpu.leaveTurn) || 0),
            leaveTurnVariance: Math.max(0, parseInt(draftCpu.leaveTurnVariance) || 0),
            leaveTurnChance: Math.min(100, Math.max(0, parseFloat(draftCpu.leaveTurnChance) || 100)),
            leaveTime: Math.max(0, Math.round((parseFloat(draftCpu.leaveTime) || 0) * 1000)),
            leaveTimeVariance: Math.max(0, Math.round((parseFloat(draftCpu.leaveTimeVariance) || 0) * 1000)),
            leaveTimeChance: Math.min(100, Math.max(0, parseFloat(draftCpu.leaveTimeChance) || 100)),
            leaveIgnored: Math.max(0, parseInt(draftCpu.leaveIgnored) || 0),
            leaveIgnoredVariance: Math.max(0, parseInt(draftCpu.leaveIgnoredVariance) || 0),
            leaveIgnoredChance: Math.min(100, Math.max(0, parseFloat(draftCpu.leaveIgnoredChance) || 100)),
            leaveTimeIgnored: Math.max(0, Math.round((parseFloat(draftCpu.leaveTimeIgnored) || 0) * 1000)),
            leaveTimeIgnoredVariance: Math.max(0, Math.round((parseFloat(draftCpu.leaveTimeIgnoredVariance) || 0) * 1000)),
            leaveTimeIgnoredChance: Math.min(100, Math.max(0, parseFloat(draftCpu.leaveTimeIgnoredChance) || 100)),
            leaveOtherLeaver: Math.max(0, parseInt(draftCpu.leaveOtherLeaver) || 0),
            leaveOtherLeaverChance: Math.min(100, Math.max(0, parseFloat(draftCpu.leaveOtherLeaverChance) || 100)),
            targetPreference: (cpu.targetPreference ?? []).map((_, i) => Math.max(0, parseInt(draftCpu[`targetPreference_${i}`]) || 0)),
        });
    }
    
    function draftChange(field: string, value: string) {
        setDraftCpu(prev => ({ ...prev, [field]: value }));
    }
    
    function draftCommit() {
        commitCurrentInputs();
    }

    function getTabClass(i: number) {
        return i === activeCpuIndex ? "tab active" : "tab";
    }

    function getTargetLabel(i: number) {
        return i === 0 ? "Human" : `CPU Player ${i + 1}`;
    }

    function updateCpu(index: number, fields: Partial<CpuSettings>) {
        const updatedList = [...settings.computerPlayers];
        updatedList[index] = { ...updatedList[index], ...fields };
        setSettings({ ...settings, computerPlayers: updatedList });
    }

    function updateCpuName(index: number, name: string) {
        updateCpu(index, { name });
    }

    function updateTint(tint: string) {
        updateCpu(activeCpuIndex, { tint });
    }

    function updatePortraitBuff(portraitBuff: string) {
        updateCpu(activeCpuIndex, { portraitBuff });
    }

    function toggleFlag(flag: number, value: boolean) {
        const current = cpu.leaveTrigger ?? 0;
        const updated = value ? current | flag : current & ~flag;
        updateCpu(activeCpuIndex, { leaveTrigger: updated });
    }

    function convertImageToUrl() {
        window.open("https://postimages.org/", "_blank");
    }

    function chooseDefaultPortrait(url: string) {
        updatePortraitBuff(url);
        setShowDefaultPortraitModal(false);
    }

    function clearPortrait() {
        updatePortraitBuff("");
    }

    function addCPU() {
        const newPlayerNumber = settings.computerPlayers.length + 2;
        const totalTargets = settings.computerPlayers.length + 2; 
        const newPref = Array(totalTargets).fill(0);
        newPref[0] = 50; 
        newPref[1] = 50; 

        const newCpu: CpuSettings = {
            name: "Player " + newPlayerNumber,
            targetPreference: newPref,
            throwDelay: 3000,
            throwDelayVariance: 1000,
            catchDelay: 500,
            catchDelayVariance: 200
        };
    
        const updatedList = [...settings.computerPlayers, newCpu];
        for (let i = 0; i < updatedList.length - 1; i++) {
            updatedList[i] = { ...updatedList[i], targetPreference: [...updatedList[i].targetPreference, 0] };
        }
    
        setSettings({ ...settings, computerPlayers: updatedList });
        setActiveCpuIndex(updatedList.length - 1);
    }

    function removeCPU() {
        if (settings.computerPlayers.length <= 1) {
            return;
        }

        const updatedList = [...settings.computerPlayers];
        updatedList.pop();

        // Remove the last
        for (const cpu of updatedList) {
            cpu.targetPreference.pop();
        }

        setSettings({ ...settings, computerPlayers: updatedList });

        if (activeCpuIndex >= updatedList.length) {
            setActiveCpuIndex(updatedList.length - 1);
        }
    }

    return (
        <div>
            <h2>
                CPUs{" "}
                <InfoButton content={
                    <p>The computer-controlled players the participant will play virtual ball-toss with.</p>
                } />
            </h2>

            {/* Tab buttons for switching between CPU */}
            <div className="tab-container">
                {settings.computerPlayers.map((_cpu, i) => (
                    <button key={i} className={getTabClass(i)} onClick={() => { commitCurrentInputs(); setActiveCpuIndex(i); }}>
                        Player {i + 2}
                    </button>
                ))}
            </div>

            {/* Add/Remove CPU buttons */}
            <div className="cpu-action-buttons" style={{ paddingBottom: 20 }}>
                <button className="home-page-buttons" onClick={addCPU}>Add CPU</button>
                <button className="home-page-buttons" onClick={removeCPU} disabled={settings.computerPlayers.length <= 1}>Remove CPU</button>
            </div>

            {cpu && (
                <div>
                    <div className="two-column-grid">
                        {/* Name button */}
                        <label>Name</label>
                        <input type="text" className="inline-input" value={nameInput} onChange={(e) => setNameInput(e.target.value)} onBlur={() => updateCpuName(activeCpuIndex, nameInput)} />

                        {/* Customize button */}
                        <LabelWithInfo label="Customize" info={
                            <p>Select to change the color of the CPU or add a portrait to the CPU.</p>
                        } />
                        <input type="checkbox" checked={showCustomize} onChange={(e) => setShowCustomize(e.target.checked)} />
                    </div>

                    {showCustomize && (
                        <div className="two-column-grid">
                            {/* Color button */}
                            <label className="indent-1">Color</label>
                            <input type="color" value={cpu.tint ?? "#ffffff"} onChange={(e) => updateTint(e.target.value)} />

                            {/* Portrait button */}
                            <div className="indent-1">
                                <LabelWithInfo label="Portrait" info={
                                    <>
                                        <p>Insert a URL to give this CPU a portrait for the game.</p>
                                        <br />
                                        <h4>Note</h4>
                                        <p>Not all URLs are supported by this feature, look into the manual for a detailed description. Any image stored in Qualtrics and any publicly available <strong>direct</strong> URL to the image should work.</p>
                                    </>
                                } />
                            </div>
                            {cpu.portraitBuff && (
                                <>
                                    <img src={cpu.portraitBuff} className="portrait-preview" />
                                    <label></label>
                                </>
                            )}

                            {/* Enter URL text */}
                            <input type="text" value={portraitInput} placeholder="Enter URL" onChange={(e) => setPortraitInput(e.target.value)} onBlur={() => updatePortraitBuff(portraitInput)} />

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

                    {/* Throw & Catch Delays button */}
                    <div className="two-column-grid">
                        <LabelWithInfo label="Throw & Catch Delays" info={
                            <>
                                <p>How fast this CPU will catch and throw the ball during the game.</p>
                                <br />
                                <h4>Note</h4>
                                <p>Variance refers to the deviation (+/-) away from the set value.</p>
                                <br />
                                <h4>Example</h4>
                                <p>A variance of 0.2 means the CPU will vary by +/- 0.2 seconds from the base delay.</p>
                            </>
                        } />
                        <input type="checkbox" checked={showDelays} onChange={(e) => setShowDelays(e.target.checked)} />
                    </div>

                    {/* How long CPU pauses before throwing/catching ball */}
                    {showDelays && (
                        <div className="two-column-grid">
                            <div className="indent-1">
                                <LabelWithInfo label="Throw Delay (s)" info={
                                    <p>The amount of time <strong>in seconds</strong> the CPU stands in a "throw-ready" stance before throwing it.</p>
                                } />
                            </div>
                            <input type="number" className="inline-input" value={draftCpu.throwDelay ?? ""} onChange={(e) => draftChange("throwDelay", e.target.value)} onBlur={draftCommit} />
                            <label className="indent-2">Variance (s)</label>
                            <input type="number" className="inline-input" value={draftCpu.throwDelayVariance ?? ""} onChange={(e) => draftChange("throwDelayVariance", e.target.value)} onBlur={draftCommit} />
                            <div className="indent-1">
                                <LabelWithInfo label="Catch Delay (s)" info={
                                    <p>The amount of time <strong>in seconds</strong> the CPU stands in a "caught-ball" stance before preparing to throw.</p>
                                } />
                            </div>
                            <input type="number" className="inline-input" value={draftCpu.catchDelay ?? ""} onChange={(e) => draftChange("catchDelay", e.target.value)} onBlur={draftCommit} />           
                            <label className="indent-2">Variance (s)</label>
                            <input type="number" className="inline-input" value={draftCpu.catchDelayVariance ?? ""} onChange={(e) => draftChange("catchDelayVariance", e.target.value)} onBlur={draftCommit} />
                        </div>
                    )}

                    {/* Target Preferences button */}
                    <div className="two-column-grid">
                        <LabelWithInfo label="Target Preferences" info={
                            <>
                                <p>A percentage that indicates how bias a CPU will be in throwing to a specific target.</p>
                                <br />
                                <h4>Note</h4>
                                <p>This percentage must equal <strong>exactly</strong> 100% between all potential targets (Human and CPUs).</p>
                                <br />
                                <h4>Example</h4>
                                <p>A 33 for Human and a 67 for CPU Player 3 means that CPU Player 2 has a 67% chance to throw to CPU Player 3 each time (and a 33% chance to throw to Human).</p>
                            </>
                        } />
                        <input type="checkbox" checked={showTargetPrefs} onChange={(e) => setShowTargetPrefs(e.target.checked)} />
                    </div>

                    {showTargetPrefs && (
                        <div className="two-column-grid">
                            {cpu.targetPreference.reduce((sum, p) => sum + p, 0) !== 100 && (
                                <p className="warning">WARNING: Target Preferences must add to 100%.</p>
                            )}

                            {cpu.targetPreference.map((_pref, i) => {
                                if (i === activeCpuIndex + 1) return null;
                                return (
                                    <div key={i} style={{ display: "contents" }}>
                                        <label className="indent-1">{getTargetLabel(i)}</label>
                                        <input type="number" className="inline-input" value={draftCpu[`targetPreference_${i}`] ?? ""} onChange={(e) => draftChange(`targetPreference_${i}`, e.target.value)} onBlur={draftCommit} />
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Leave Game Options button */}
                    <div className="two-column-grid">
                        <LabelWithInfo label="Leave Game Options" info={
                            <>
                                <p>Select to change a trigger for when the CPU will leave the game.</p>
                                <br />
                                <h4>Note</h4>
                                <p>Chance refers to the probability the CPU will leave at the threshold point.</p>
                                <br />
                                <h4>Example</h4>
                                <p>Setting Chance at 50% means the CPU will leave 50% of the time.</p>
                                <br />
                                <h4>Note</h4>
                                <p>Variance refers to the deviation (+/-) away from the set value.</p>
                                <br />
                                <h4>Example</h4>
                                <p>A variance of 2 means the participant is shown the <strong>Leave Game</strong> button +/- 2 throws from a 10 Throws Elapsed Threshold (8 to 12 throws).</p>
                            </>
                        } />
                        <input type="checkbox" checked={showLeaveOptions} onChange={(e) => setShowLeaveOptions(e.target.checked)} />
                    </div>

                    {showLeaveOptions && (
                        <div>

                            {/* Throws Elapsed button */}
                            <div className="two-column-grid">
                                <div className="indent-1">
                                    <LabelWithInfo label="Throws Elapsed" info={
                                        <p>The number of throws between all players before this CPU leaves.</p>
                                    } />
                                </div>
                                <input type="checkbox" checked={hasFlag(1)} onChange={(e) => toggleFlag(1, e.target.checked)} />
                            </div>
                            {hasFlag(1) && (
                                <div className="two-column-grid">
                                    <label className="indent-2">Leave Threshold</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveTurn ?? ""} onChange={(e) => draftChange("leaveTurn", e.target.value)} onBlur={draftCommit} />                                    
                                    <label className="indent-2">Variance</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveTurnVariance ?? ""} onChange={(e) => draftChange("leaveTurnVariance", e.target.value)} onBlur={draftCommit} />                                    
                                    <label className="indent-2">Chance (%)</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveTurnChance ?? ""} onChange={(e) => draftChange("leaveTurnChance", e.target.value)} onBlur={draftCommit} />
                                </div>
                            )}

                            {/* Time Elapsed button */}
                            <div className="two-column-grid">
                                <div className="indent-1">
                                    <LabelWithInfo label="Time Elapsed" info={
                                        <p>How much time <strong>in seconds</strong> passes before the CPU leaves.</p>
                                    } />
                                </div>
                                <input type="checkbox" checked={hasFlag(2)} onChange={(e) => toggleFlag(2, e.target.checked)} />
                            </div>
                            {hasFlag(2) && (
                                <div className="two-column-grid">
                                    <label className="indent-2">Leave Threshold (s)</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveTime ?? ""} onChange={(e) => draftChange("leaveTime", e.target.value)} onBlur={draftCommit} />
                                    <label className="indent-2">Variance (s)</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveTimeVariance ?? ""} onChange={(e) => draftChange("leaveTimeVariance", e.target.value)} onBlur={draftCommit} />
                                    <label className="indent-2">Chance (%)</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveTimeChance ?? ""} onChange={(e) => draftChange("leaveTimeChance", e.target.value)} onBlur={draftCommit} />
                                </div>
                            )}

                            {/* Throws Ignored button */}
                            <div className="two-column-grid">
                                <div className="indent-1">
                                    <LabelWithInfo label="Throws Ignored" info={
                                        <p>How many throws occur only between the other CPUs and participant before the CPU leaves.</p>
                                    } />
                                </div>
                                <input type="checkbox" checked={hasFlag(4)} onChange={(e) => toggleFlag(4, e.target.checked)} />
                            </div>
                            {hasFlag(4) && (
                                <div className="two-column-grid">
                                    <label className="indent-2">Leave Threshold</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveIgnored ?? ""} onChange={(e) => draftChange("leaveIgnored", e.target.value)} onBlur={draftCommit} />
                                    <label className="indent-2">Variance</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveIgnoredVariance ?? ""} onChange={(e) => draftChange("leaveIgnoredVariance", e.target.value)} onBlur={draftCommit} />
                                    <label className="indent-2">Chance (%)</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveIgnoredChance ?? ""} onChange={(e) => draftChange("leaveIgnoredChance", e.target.value)} onBlur={draftCommit} />
                                </div>
                            )}

                            {/* Time Ignored button */}
                            <div className="two-column-grid">
                                <div className="indent-1">
                                    <LabelWithInfo label="Time Ignored" info={
                                        <p>How much time <strong>in seconds</strong> the other CPUs and participant spend only throwing to each other before the CPU leaves.</p>
                                    } />
                                </div>
                                <input type="checkbox" checked={hasFlag(16)} onChange={(e) => toggleFlag(16, e.target.checked)} />
                            </div>
                            {hasFlag(16) && (
                                <div className="two-column-grid">
                                    <label className="indent-2">Leave Threshold (s)</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveTimeIgnored ?? ""} onChange={(e) => draftChange("leaveTimeIgnored", e.target.value)} onBlur={draftCommit} />
                                    <label className="indent-2">Variance (s)</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveTimeIgnoredVariance ?? ""} onChange={(e) => draftChange("leaveTimeIgnoredVariance", e.target.value)} onBlur={draftCommit} />
                                    <label className="indent-2">Chance (%)</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveTimeIgnoredChance ?? ""} onChange={(e) => draftChange("leaveTimeIgnoredChance", e.target.value)} onBlur={draftCommit} />
                                </div>
                            )}

                            {/* Others Leaving button */}
                            <div className="two-column-grid">
                                <div className="indent-1">
                                    <LabelWithInfo label="Others Leaving" info={
                                        <p>The number of other CPUs that must leave before the CPU leaves.</p>
                                    } />
                                </div>
                                <input type="checkbox" checked={hasFlag(8)} onChange={(e) => toggleFlag(8, e.target.checked)} />
                            </div>
                            {hasFlag(8) && (
                                <div className="two-column-grid">
                                    <label className="indent-2">Leave Threshold</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveOtherLeaver ?? ""} onChange={(e) => draftChange("leaveOtherLeaver", e.target.value)} onBlur={draftCommit} />
                                    <label className="indent-2">Chance (%)</label>
                                    <input type="number" className="inline-input" value={draftCpu.leaveOtherLeaverChance ?? ""} onChange={(e) => draftChange("leaveOtherLeaverChance", e.target.value)} onBlur={draftCommit} />
                                </div>
                            )}

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

export default CpuTab;
