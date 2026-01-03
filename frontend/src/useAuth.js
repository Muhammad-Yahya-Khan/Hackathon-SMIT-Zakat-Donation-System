// useAuth Hook - Simple hook to get current user
import { useState, useEffect } from "react";
import { getCurrentUser } from "./authService";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user on component mount
    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setLoading(false);

        // Listen for auth changes (login/logout)
        const handleAuthChange = () => {
            const updatedUser = getCurrentUser();
            setUser(updatedUser);
        };

        window.addEventListener("authChange", handleAuthChange);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener("authChange", handleAuthChange);
        };
    }, []);

    return { user, loading };
};
