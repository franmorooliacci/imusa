import http from '@common/api/client';
import type { APIResponseObj, APIResponseList } from '@common/types';
import type { PersonaDTO, DomicilioDTO, Persona, Domicilio } from './types';

// Persona endpoints
export const addPersona = (newPersona: PersonaDTO): Promise<Persona> =>
    http.post<Persona>(`personas/`, newPersona).then(res => res.data);

export const getPersona = (dni: string, sexo: string): Promise<Persona> =>
    http.get<Persona>(`personas/buscar/`, { params: { dni, sexo } }).then(res => res.data);

export const getResponsableById = (id: number): Promise<Persona> =>
	http.get<Persona>(`personas/${id}/`).then(res => res.data);

export const updatePersona = (id: number, data: Partial<Persona>): Promise<Persona> =>
	http.patch<Persona>(`personas/${id}/`, data).then(res => res.data);

// Domicilio endpoints
export const addDomicilio = (domicilio: DomicilioDTO): Promise<Domicilio> =>
    http.post<Domicilio>(`domicilios/`, domicilio).then(res => res.data);

export const getDomicilio = (params: Record<string, any>): Promise<Domicilio> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
        if (val != null) query.append(key, String(val))
    });
    return http.get<Domicilio>(`domicilios/buscar/`, { params: query }).then(res => res.data);
};

// API Ciudadano
export const getCiudadano = (dni: string, sexo: string): Promise<APIResponseObj> =>
	http.get<APIResponseObj>('external_data/ciudadano/', { params: { dni, sexo } }).then(res => res.data);

// APIs Geolozalizacion
export const getFeatures = (domicilio: string): Promise<APIResponseList> =>
	http.get<APIResponseList>('external_data/features/', { params: { domicilio } }).then(res => res.data);

export const getDireccion = (codigoCalle: number, altura: number, bis?: number, letra?: string): Promise<APIResponseObj> =>
	http.get<APIResponseObj>('external_data/direccion/', {
		params: { codigoCalle, altura, bis, letra }
	}).then(res => res.data);
