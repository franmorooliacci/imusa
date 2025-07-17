import { Dispatch } from 'react';
import { Personal } from './personal';

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface InitializeAuthData {
    access: string;
    refresh: string;
    username?: string;
    personal?: Personal;
}

export interface AuthContextType {
    authTokens: AuthTokens | null;
    initializeAuth: (data: InitializeAuthData) => void;

    username: string | null;
    personal: Personal | null;
    efectores: Personal['efectores'];

    selectedEfectorId: number | null;
    setSelectedEfectorId: Dispatch<number | null>;

    logout: () => void;
}
