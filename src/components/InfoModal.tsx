import { createPortal } from "react-dom";
import "./infoModal.css"

type Props = {
    content: React.ReactNode;
    onClose: () => void;
}

export default function InfoModal({ content, onClose }: Props) {
    return createPortal(
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalBox" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose}>X</button>
                <h3>Information</h3>
                {content}
            </div>
        </div>,
        document.body
    );
}