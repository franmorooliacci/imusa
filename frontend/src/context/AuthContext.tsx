import React, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import { AuthContextType, InitializeAuthData, AuthTokens } from '../types/auth-context';
import { Personal } from '../types/personal';

const defaultContext: AuthContextType = {
    authTokens: null,
    initializeAuth: () => {},

    username: null,
    personal: null,
    efectores: [],

    selectedEfectorId: null,
    setSelectedEfectorId: () => {},

    logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
        const t = localStorage.getItem('tokens');
        return t ? JSON.parse(t) : null;
    });
    const tokensRef = useRef<AuthTokens | null>(authTokens);
    const [username, setUsername] = useState<string | null>(() =>
        localStorage.getItem('username') || null
    );
    const [personal, setPersonal] = useState<Personal | null>(() => {
        const p = localStorage.getItem('personal');
        return p ? JSON.parse(p) : null;
    });
    const [efectores, setEfectores] = useState<Personal['efectores']>(() => {
        const e = localStorage.getItem('efectores');
        return e ? JSON.parse(e) : [];
    });
    const [selectedEfectorId, setSelectedEfectorId] = useState<number | null>(() => {
        const se = localStorage.getItem('selectedEfectorId');
        return se ? parseInt(se, 10) : null;
    });

    const initializeAuth = (data: InitializeAuthData) => {
        const tokens: AuthTokens = { access: data.access, refresh: data.refresh };
        setAuthTokens(tokens);
        tokensRef.current = tokens;
        localStorage.setItem('tokens', JSON.stringify(tokens));

        if (data.username) {
            setUsername(data.username);
            localStorage.setItem('username', data.username);
        }
        
        if (data.personal) {
            setPersonal(data.personal);
            localStorage.setItem('personal', JSON.stringify(data.personal));

            const sorted = [...data.personal.efectores].sort((a, b) =>
                a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
            );
            setEfectores(sorted);
            localStorage.setItem('efectores', JSON.stringify(sorted));
        }
    };

    const logout = () => {
        setAuthTokens(null);
        tokensRef.current = null;
        setUsername(null);
        setPersonal(null);
        setEfectores([]);
        setSelectedEfectorId(null);
        ['tokens','username','personal','efectores','selectedEfectorId'].forEach(k => localStorage.removeItem(k));
    };

    useEffect(() => {
        if (selectedEfectorId !== null) {
            localStorage.setItem('selectedEfectorId', selectedEfectorId.toString());
        }
    }, [selectedEfectorId]);

    useEffect(() => {
        if (
            efectores.length > 0 &&
            selectedEfectorId === null &&
            !localStorage.getItem('selectedEfectorId')
        ) {
            const def = efectores.find(e => e.unidad_movil === 0) || efectores[0];
            setSelectedEfectorId(def?.id ?? null);
        }
    }, [efectores, selectedEfectorId]);

    return (
        <AuthContext.Provider
            value={{
                authTokens,
                initializeAuth,
                username,
                personal,
                efectores,
                selectedEfectorId,
                setSelectedEfectorId,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
