import React, { useContext, useState, useEffect } from 'react'

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        var isLocalUser = localStorage.getItem('pw_user')
        var isSessionUser = sessionStorage.getItem('pw_user');
        if(isLocalUser) setUser(isLocalUser);
        if(isSessionUser) setUser(isLocalUser);
    }, [user])

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}