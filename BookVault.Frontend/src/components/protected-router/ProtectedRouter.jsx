import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export default function ProtectedRouter() {
    const { user, setUser } = useUser(); 
    const [isLogged, setIsLogged] = useState(false);
    const [waiting, setWaiting] = useState(true);

    useEffect(()=>{
        fetch("https://localhost:7157/api/Auth/authuser", {
            method: "GET",
            credentials: "include", // Include cookies in cross-origin requests
        }).then(response => {
            if (response.ok) { 
                return response.json();
            } else {
                throw new Error('Unauthorized');
            }
        }).then(data=> {
            setUser(data.user);  // Store user data in context
            localStorage.setItem("userEmail", data.user.email)
            console.log(data.user);
            setIsLogged(true)
            setWaiting(false)
        }).catch(err=> {
            console.log("Error protected routes: ", err);
            setWaiting(false);
            localStorage.removeItem("userEmail");
            setUser(null); // Clear user data in context
        })
    },[setUser])

  return ( waiting ? <div className="waitingPage">
    <div>Waiting...</div>
  </div>:
  isLogged ? <Outlet /> : <Navigate to="/auth" />
  )
}
