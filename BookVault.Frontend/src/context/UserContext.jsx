import React, {createContext, useContext, useState} from "react";

// creating the context for the user
const UserContext = createContext();

// creating the provider component
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{user, setUser}}>
            { children }
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext)
}