import { useState } from "react";
import type { Settings } from "../../types/Settings";
import InfoButton from "../../components/InfoButton";
import LabelWithInfo from "../../components/LabelWithInfo";

type Props = {
    settings: Settings;
    setSettings: (updated: Settings) => void;
};

function GameplayTab({ settings, setSettings }: Props) {
    const [opacityDisplay, setOpacityDisplay] = useState(Math.round(settings.gameOverOpacity * 100));
    const [throwCountDisplay, setThrowCountDisplay] = useState(settings.throwCount.toString());
    const [timeLimitDisplay, setTimeLimitDisplay] = useState((settings.timeLimit / 1000).toString());
    const [ballSpeedDisplay, setBallSpeedDisplay] = useState((settings.ballSpeed / 1000).toString());

    function update(fields: Partial<Settings>) {
        setSettings({ ...settings, ...fields });
    }

    function updateScheduleText(playerName: string, value: string) {
        update({ scheduleText: { ...settings.scheduleText, [playerName]: value } });
    }

    function saveBallSpeed() {
        const val = parseFloat(ballSpeedDisplay);
        if (isNaN(val) || val < 0.1) {
            setBallSpeedDisplay("0.1");
            update({ ballSpeed: 100 });
            return;
        }
        update({ ballSpeed: Math.round(val * 1000) });
    }

    function saveThrowCount() {
        const val = parseInt(throwCountDisplay);
        if (isNaN(val) || val < 1) {
            setThrowCountDisplay("1");
            update({ throwCount: 1 });
            return;
        }
        update({ throwCount: val });
    }

    function saveTimeLimit() {
        const val = parseFloat(timeLimitDisplay);
        if (isNaN(val) || val < 1) {
            setTimeLimitDisplay("1");
            update({ timeLimit: 1000 });
            return;
        }
        update({ timeLimit: Math.round(val * 1000) });
    }

    return (
        <div>
            <h2>
                Gameplay{" "}
                <InfoButton content={
                    <p>Configure how the game ends, what appears afterwards, ball color and speed, and predetermined throwing order for CPUs.</p>
                } />
            </h2>

            <div className="two-column-grid">

                {/* Game End Condition button */}
                <LabelWithInfo label="Game End Condition:" info={
                    <>
                        <p>How the game ends besides the participant leaving.</p>
                        <br />
                        <p><strong>Throw Count:</strong> game ends after a certain number of throws.</p>
                        <p><strong>Time Limit:</strong> game ends after a designated time <strong>in seconds</strong>.</p>
                        <p><strong>All CPUs Left:</strong> game ends after all CPUs leave.</p>
                    </>
                } />
                <select value={settings.selectedGameOverCondition} onChange={(e) => update({ selectedGameOverCondition: e.target.value })}>
                    <option value="throwCount">Throw Count</option>
                    <option value="timeLimit">Time Limit</option>
                    <option value="allCPUsLeft">All CPUs Left</option>
                </select>

                {/* Throw Count button */}
                {settings.selectedGameOverCondition === "throwCount" && (
                    <>
                        <div className="indent-1">
                            <LabelWithInfo label="Throw Count" info={
                                <p>How many total throws in the game before ending.</p>
                            } />
                        </div>
                        <input type="number" className="inline-input" value={throwCountDisplay} onChange={(e) => setThrowCountDisplay(e.target.value)} onBlur={saveThrowCount} />
                    </>
                )}

                {/* Time Limit fields */}
                {settings.selectedGameOverCondition === "timeLimit" && (
                    <>
                        {/* Display Time button */}
                        <div className="indent-1">
                            <LabelWithInfo label="Display Time" info={
                                <p>Allow the participant to see how much time remains in the top right corner of the screen.</p>
                            } />
                        </div>
                        <input type="checkbox" checked={settings.displayTimeLimit} onChange={(e) => update({ displayTimeLimit: e.target.checked })} />

                        {/* Time Limit Label button */}
                        <label className="indent-1">Label</label>
                        <input type="text" className="inline-input" value={settings.timeLimitText} onChange={(e) => update({ timeLimitText: e.target.value })} />

                        {/* Game Duration button */}
                        <label className="indent-1">Game Duration (s)</label>
                        <input type="number" className="inline-input" value={timeLimitDisplay} onChange={(e) => setTimeLimitDisplay(e.target.value)} onBlur={saveTimeLimit} />
                    </>
                )}

                {/* Game Over Text button */}
                <LabelWithInfo label="Game Over Text" info={
                    <p>The text that will appear when the game ends.</p>
                } />
                <input type="text" value={settings.gameOverText} onChange={(e) => update({ gameOverText: e.target.value })} />

                {/* Game Over Opacity button */}
                <LabelWithInfo label="Game Over Opacity (%)" info={
                    <>
                        <p>How transparent the background behind the Game Over text is.</p>
                        <br />
                        <h4>Note</h4>
                        <p>A higher percentage will result in more of the screen behind the Game Over text to be less visible. The background will be less transparent.</p>
                    </>
                } />
                <div className="range-container">
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={opacityDisplay}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            setOpacityDisplay(val);
                            update({ gameOverOpacity: val / 100 });
                        }}
                    />
                    <span>{opacityDisplay}%</span>
                </div>

                {/* Customize Ball button */}
                <LabelWithInfo label="Customize Ball" info={
                    <p>Select to change the color and speed of the ball.</p>
                } />
                <input type="checkbox" checked={settings.displayBallSettings} onChange={(e) => update({ displayBallSettings: e.target.checked })} />
            </div>

            {settings.displayBallSettings && (
                <div className="two-column-grid">
                    {/* Ball color button */}
                    <label className="indent-1">Color</label>
                    <input type="color" value={settings.ballTint ?? "#ffffff"} onChange={(e) => update({ ballTint: e.target.value })} />

                    {/* Ball speed button */}
                    <div className="indent-1">
                        <LabelWithInfo label="Speed (s)" info={
                            <>
                                <p>How long <strong>in seconds</strong> it takes the ball to travel between players.</p>
                                <br />
                                <h4>Example</h4>
                                <p>A value of 0.5 means the ball takes half a second to reach the other player. A value of 5 means it takes 5 seconds.</p>
                            </>
                        } />
                    </div>
                    <input type="number" className="inline-input" value={ballSpeedDisplay} onChange={(e) => setBallSpeedDisplay(e.target.value)} onBlur={saveBallSpeed} />
                </div>
            )}

            <div className="two-column-grid">
                {/* Use Schedule button */}
                <LabelWithInfo label="Use Schedule?" info={
                    <>
                        <p>Select to set a predetermined throw ordering for the CPUs—controlling when each player receives the ball.</p>
                        <br />
                        <p>A sample schedule for Player 2 is provided: <code>3,13,1,3,3</code></p>
                        <br />
                        <p>The numbers indicate which players the CPU will throw to. "1" means Player 1 and "3" means Player 3.</p>
                        <br />
                        <p><code style={{ display: "inline" }}>13</code> means that Player 2 will throw to Player 1 (participant) and Player 3 (CPU) in their first 2 throws (with a randomized order).</p>
                        <br />
                        <p>So, in this case, Player 2 throws to Player 3 first, then to Player 1 or Player 3, then to the one it didn't throw to, then to Player 1, then to Player 3 two more times before the schedule is over.</p>
                    </>
                } />
                <input type="checkbox" checked={settings.useSchedule} onChange={(e) => update({ useSchedule: e.target.checked })} />
            </div>

            {settings.useSchedule && (
                <div className="two-column-grid">
                    {/* Honor Game End button */}
                    {settings.selectedGameOverCondition === "throwCount" && (
                        <>
                            <div className="indent-1">
                                <LabelWithInfo label="Honor Game End" info={
                                    <>
                                        <p>Sets the value in the Throw Count to override the number of throws placed in the Schedules while allowing the order of the Schedules' values to occur.</p>
                                        <br />
                                        <h4>Note</h4>
                                        <p>With this option on, a value of 10 in Throw Count, along with 20 values in the Schedule, will result in a game with 10 throws that follows a shortened schedule.</p>
                                    </>
                                } />
                            </div>
                            <input type="checkbox" checked={settings.scheduleHonorsThrowCount} onChange={(e) => update({ scheduleHonorsThrowCount: e.target.checked })} />
                        </>
                    )}

                    {/* One schedule text input per CPU player */}
                    {settings.computerPlayers.map((cpu) => (
                        <>
                            <label key={cpu.name} className="indent-1">{cpu.name}</label>
                            <input
                                type="text"
                                className="inline-input"
                                placeholder={`type ${cpu.name}'s schedule`}
                                value={settings.scheduleText[cpu.name] ?? ""}
                                onChange={(e) => updateScheduleText(cpu.name, e.target.value)}
                            />
                        </>
                    ))}
                </div>
            )}
        </div>
    );
}

export default GameplayTab;
