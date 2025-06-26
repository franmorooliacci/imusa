import React, { createContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Tokens
    const [authTokens, setAuthTokens] = useState(() => {
        const t = localStorage.getItem('tokens');
        return t ? JSON.parse(t) : null;
    });
    const tokensRef = useRef(authTokens);

    // Variables de usuario
    const [username, setUsername] = useState(() => {
        return localStorage.getItem('username') || null;
    });
    const [profesional, setProfesional] = useState(() => {
        const p = localStorage.getItem('profesional');
        return p ? JSON.parse(p) : null;
    });
    const [efectores, setEfectores] = useState(() => {
        const e = localStorage.getItem('efectores');
        return e ? JSON.parse(e) : [];
    });
    const [selectedEfectorId, setSelectedEfectorId] = useState(() => {
        const se = localStorage.getItem('selectedEfectorId');
        return se ? parseInt(se, 10) : null;
    });
    

    // Setea las variables de usuario
    const initializeAuth = (data) => {
        const tokens = { access: data.access, refresh: data.refresh };
        setAuthTokens(tokens);
        tokensRef.current = tokens;
        localStorage.setItem('tokens', JSON.stringify(tokens));

        if (data.username) {
            setUsername(data.username);
            localStorage.setItem('username', data.username);
        }
        if (data.profesional) {
            setProfesional(data.profesional);
            localStorage.setItem('profesional', JSON.stringify(data.profesional));
        }
        if (data.efectores) {
            const sortedEfectores = [...data.efectores].sort((a, b) =>
                a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
            );
            setEfectores(sortedEfectores);
            localStorage.setItem('efectores', JSON.stringify(sortedEfectores));
        }
    };

    // Logout
    const logout = () => {
        setAuthTokens(null);
        tokensRef.current = null;
        setUsername(null);
        setProfesional(null);
        setEfectores([]);
        setSelectedEfectorId(null);
        localStorage.removeItem('tokens');
        localStorage.removeItem('username');
        localStorage.removeItem('profesional');
        localStorage.removeItem('efectores');
        localStorage.removeItem('selectedEfectorId');
    };

    // Update selectedEfectorId
    useEffect(() => {
        if (selectedEfectorId !== null) {
            localStorage.setItem('selectedEfectorId', selectedEfectorId);
        }
    }, [selectedEfectorId]);
   
    // Inicializa selectedEfectorId
    useEffect(() => {
        if (
            efectores.length > 0 &&
            selectedEfectorId === null &&
            !localStorage.getItem('selectedEfectorId')
        ) {
            const defaultEfector = efectores.find(e => e.unidad_movil === 0) || efectores[0];
            if (defaultEfector) {
                setSelectedEfectorId(defaultEfector.id);
            }
        }
    }, [efectores, selectedEfectorId]);
    

    return (
        <AuthContext.Provider
            value={{
                authTokens,
                username,
                profesional,
                efectores,
                initializeAuth,
                logout,
                selectedEfectorId,
                setSelectedEfectorId
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
