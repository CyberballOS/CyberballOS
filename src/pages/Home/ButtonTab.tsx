import { useState } from "react";
import type { Settings } from "../../types/Settings";
import InfoButton from "../../components/InfoButton";

type Props = {
    url: string;
    settings: Settings;
};

function ButtonTab({ url, settings }: Props) {
    const [embedCopied, setEmbedCopied] = useState(false);
    const [urlCopied, setUrlCopied] = useState(false);
    const [showPresetModal, setShowPresetModal] = useState(false);
    const [presetName, setPresetName] = useState("");
    const [presetDescription, setPresetDescription] = useState("");
    const [showFileModal, setShowFileModal] = useState(false);
    const [fileName, setFileName] = useState("");

    // Open game in new tab
    function openGamePreview() {
        window.open(url, "_blank");
    }

    // Copies iframe embed snippet 
    function copyEmbedCode() {
        const embedCode = '<iframe id="cyberball" width="100%" height="580" src="' + url + '"></iframe>';
        navigator.clipboard.writeText(embedCode);
        setEmbedCopied(true);
        setTimeout(() => setEmbedCopied(false), 1500);
    }

    function copyGameUrl() {
        navigator.clipboard.writeText(url);
        setUrlCopied(true);
        setTimeout(() => setUrlCopied(false), 1500);
    }

    function confirmPresetSave() {
        if (presetName.trim() === "") {
            alert("Please enter a preset name.");
            return;
        }
        const presetData = { description: presetDescription, settings: settings };
        localStorage.setItem(presetName, JSON.stringify(presetData));
        setShowPresetModal(false);
        setPresetName("");
        setPresetDescription("");
    }
    
    function cancelPresetSave() {
        setShowPresetModal(false);
        setPresetName("");
        setPresetDescription("");
    }
    
    function confirmFileSave() {
        if (fileName.trim() === "") {
            alert("Please enter a file name.");
            return;
        }
        const settingsString = JSON.stringify(settings, null, 2);
        const blob = new Blob([settingsString], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        const objectUrl = window.URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = fileName.endsWith(".txt") ? fileName : `${fileName}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(objectUrl);
        document.body.removeChild(a);
        setShowFileModal(false);
        setFileName("");
    }
    
    function cancelFileSave() {
        setShowFileModal(false);
        setFileName("");
    }

    async function downloadQsf(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        const response = await fetch("/assets/cyberball_qualtrics.qsf");
        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = "cyberball_qualtrics.qsf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(objectUrl);
        document.body.removeChild(a);
    }

    return (
        <div>
            <h2>
                Application Options{" "}
                <InfoButton content={
                    <p>Export the game for actual use.</p>
                } />
            </h2>
            <div className="button-container">

                <button className="bottom-buttons" onClick={openGamePreview}>
                    &#129514; Open Game Preview
                </button>

                <button className="bottom-buttons" onClick={() => setShowPresetModal(true)}>
                     &#128190; Save Preset
                </button>

                <button className="bottom-buttons" onClick={() => setShowFileModal(true)}>
                    &#128190; Download Game
                </button>

                <a className="bottom-buttons" href="/assets/cyberball_qualtrics.qsf" download onClick={downloadQsf}>
                    &#128190; Download CyberballOS Qualtrics Survey Template (QSF)
                </a>

                <button className="bottom-buttons" onClick={copyEmbedCode}>
                    {embedCopied ? "Copied!" : "\u29C9 Copy Embed Code"}
                </button>

                <button className="bottom-buttons" onClick={copyGameUrl}>
                    {urlCopied ? "Copied!" : "\u29C9 Copy Game URL"}
                </button>

                {/* Back to the landing page */}
                <a className="bottom-buttons" href="./">Exit</a>

            </div>

        {/* Save Preset Modal */}
        {showPresetModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="close-btn" onClick={cancelPresetSave}>X</button>
                        <h2>Save Preset</h2>
                        <div className="two-column-grid">
                            <label>Name</label>
                            <input type="text" value={presetName} onChange={(e) => setPresetName(e.target.value)} />
                            <label>Description</label>
                            <textarea value={presetDescription} onChange={(e) => setPresetDescription(e.target.value)} rows={4} style={{ resize: "vertical" }} />                        </div>
                        <br />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button onClick={confirmPresetSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Download Game Modal */}
            {showFileModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="close-btn" onClick={cancelFileSave}>X</button>
                        <h2>Save As</h2>
                        <div className="two-column-grid">
                            <label>File Name</label>
                            <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />
                        </div>
                        <br />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button onClick={confirmFileSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ButtonTab;