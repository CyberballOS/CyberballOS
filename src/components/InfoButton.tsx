import { useState } from 'react';
import InfoModal from './InfoModal';
import './infoButton.css';

type Props = {
    content: React.ReactNode;
};

export default function InfoButton({ content }: Props) {
    const [open, setOpen] = useState(false);
    return (
        <span>
            <button className="infoButton" onClick={() => setOpen(true)}>?</button>
            {open && (
                <InfoModal content={content} onClose={() => setOpen(false)}/>
            )}
        </span>
    );
}