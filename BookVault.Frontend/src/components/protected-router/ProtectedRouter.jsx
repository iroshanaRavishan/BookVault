import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export default function ProtectedRouter() {
    const { refreshUser } = useUser(); 
    const [isLogged, setIsLogged] = useState(false);
    const [waiting, setWaiting] = useState(true);

    useEffect(() => {
        refreshUser()
        .then(() => {
            setIsLogged(true);
            setWaiting(false);
        })
        .catch(() => {
            setIsLogged(false);
            setWaiting(false);
        });
    }, [refreshUser]);

  return ( waiting ? <div className="waitingPage">
    <div>Waiting...</div>
  </div>:
  isLogged ? <Outlet /> : <Navigate to="/auth" />
  )
}
