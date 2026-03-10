// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Most reliable method in 2024–2025
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });

        // Alternative (sometimes needed for mobile / certain browsers):
        // document.documentElement.scrollTop = 0;
        // document.body.scrollTop = 0;
    }, [pathname]); // ← runs every time route changes

    return null;
}