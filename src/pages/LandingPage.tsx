import { Link } from "react-router-dom";
import './pageSpecificCSS/LandingPage.css';


function LandingPage() {
    return (
        <>
            <div className = "top-banner"></div>
            <div className = "content container">
                <h1>Welcome to CyberballOS!</h1>
                <div className = "btn-column-centered">
                    <Link to="/home" className="btn1">Create New</Link>
                    <Link to="/presets" className="btn1">Load Preset</Link>
                    <Link to="/tutorial" className="btn1">Cyberball Tutorial</Link>
                    <Link to="/help" className="btn1">Help</Link>
                </div>
            </div>
        </>
    );
}

export default LandingPage;

