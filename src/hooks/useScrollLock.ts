import { useEffect } from "react";

export default function useScrollLock(isLocked: boolean) {
    useEffect(() => {
        if (!isLocked) return;

        const y = window.scrollY;
        Object.assign(document.body.style, {
            position: "fixed",
            top: `-${y}px`,
            left: "0",
            right: "0",
            overflow: "hidden",
        });

        return () => {
            Object.assign(document.body.style, {
                position: "",
                top: "",
                left: "",
                right: "",
                overflow: "",
            });
            window.scrollTo(0, y);
        };
    }, [isLocked]);
}