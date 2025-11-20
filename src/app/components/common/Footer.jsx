
import React from "react";

export default function Footer() {
    return (
        <footer className="bg-[#092327] text-white py-8 border-t border-[#1a3a40]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} Chess Puzzle Directory. All rights reserved.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                    <a href="/terms-of-service" className="hover:text-white transition-colors duration-200">
                        Terms of Service
                    </a>{" "}
                    |{" "}
                    <a href="/privacy-policy" className="hover:text-white transition-colors duration-200">
                        Privacy Policy
                    </a>
                </p>
            </div>
        </footer>
    );
}