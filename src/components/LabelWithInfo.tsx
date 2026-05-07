import InfoButton from "./InfoButton";
import "./labelWithInfo.css";

type Props = {
    label: string;
    info: React.ReactNode;
};

export default function LabelWithInfo({ label, info }: Props) {
    return (
        <div className="label-row">
            <label className="label-text">{label}</label>
            <InfoButton content={info}/>
        </div>
    );
}