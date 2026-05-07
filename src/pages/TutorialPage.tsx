import { Link } from "react-router-dom";
import playerImg from "../assets/player.png";

function buildTutorialUrl() {
    return import.meta.env.BASE_URL + "manuals/CyberballOS_AMPPS.pdf";
}

function TutorialPage() {
    console.log(import.meta.env.BASE_URL);
    return (
        <div className="tutorial-page">
            <img src={playerImg} alt="Banner" className="welcome-image1" />
            <h1 className="configHeader">CyberballOS Tutorial</h1>
            <h3>This is a tutorial for CyberballOS that will take you through features step-by-step and provide some additional information about the program.</h3>
            <iframe 
                src={buildTutorialUrl()}
                className = "preview-frame"
            />
            <div className ="two-column-grid" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a
                    href={buildTutorialUrl()}
                    className = "btn1"
                    target= "_blank"
                    rel="noopener noreferrer"
                >
                    Download
                </a>

                <Link to="/" className="btn1">
                    Exit
                </Link>
            </div>
        </div>

    );
}

export default TutorialPage;