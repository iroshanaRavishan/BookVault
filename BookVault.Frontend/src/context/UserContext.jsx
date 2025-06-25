import React, {createContext, useCallback, useContext, useState} from "react";

// creating the context for the user
const UserContext = createContext();

// creating the provider component
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    // Centralized user fetching logic
    const refreshUser = useCallback(async () => {
        try {
        const response = await fetch("https://localhost:7157/api/Auth/authuser", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Unauthorized");
        }

        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("userEmail", data.user.email);
        console.log(data.user);
        } catch (error) {
        console.error("Error refreshing user:", error);
        setUser(null);
        localStorage.removeItem("userEmail");
        throw error;
        }
    }, []);

    return (
        <UserContext.Provider value={{user, setUser, refreshUser }}>
            { children }
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext)
}