import http from './axiosClient'
import type { Animal, Raza, Tamaño, Color } from '../types/animal';
import type { Atencion, Insumo } from '../types/atencion';
import type { Persona } from '../types/persona';
import type { Personal } from '../types/personal';
import type { Efector } from '../types/efector';
import type { Domicilio } from '../types/domicilio';
import { AuthTokens } from '../types/auth-context';

type APIResponseObj = Record<string, unknown>;
type APIResponseList  = APIResponseObj[];

// Persona endpoints
export const getResponsable = (dni: number, sexo: string): Promise<Persona[]> =>
	http.get<Persona[]>(`personas/buscar/`, { params: { dni, sexo } })
		.then(res => res.data);

export const addResponsable = (newPersona: Persona): Promise<Persona> =>
	http.post<Persona>(`personas/`, newPersona)
		.then(res => res.data);

export const getResponsableById = (id: number): Promise<Persona> =>
	http.get<Persona>(`personas/${id}/`)
		.then(res => res.data);

export const updateResponsable = (id: number, data: Partial<Persona>): Promise<Persona> =>
	http.patch<Persona>(`personas/${id}/`, data)
		.then(res => res.data);

// Animal endpoints
export const addAnimal = (newAnimal: Animal): Promise<Animal> =>
	http.post<Animal>(`animales/`, newAnimal).then(res => res.data);

export const getAnimalById = (id: number): Promise<Animal> =>
	http.get<Animal>(`animales/${id}/`).then(res => res.data);

export const updateAnimal = (id: number, data: Partial<Animal>): Promise<Animal> =>
	http.put<Animal>(`animales/${id}/`, data).then(res => res.data);

export const getRazas = (id_especie: number): Promise<Raza[]> =>
	http.get<Raza[]>(`razas/${id_especie}`).then(res => res.data);

export const getTamaños = (): Promise<Tamaño[]> =>
	http.get<Tamaño[]>('tamaños/').then(res => res.data);

export const getColores = (): Promise<Color[]> =>
	http.get<Color[]>('colores/').then(res => res.data);

// Atencion endpoints
export const addAtencion = (newAtencion: Atencion): Promise<Atencion> =>
	http.post<Atencion>(`atenciones/`, newAtencion).then(res => res.data);

export const addAtencionInsumo = (insumos: Insumo[]): Promise<Insumo[]> =>
	http.post<Insumo[]>(`atencion_insumo/`, insumos).then(res => res.data);

export const getAtenciones = (params: Record<string, any>): Promise<Atencion[]> =>
	http.get<Atencion[]>(`atenciones/buscar/`, { params }).then(res => res.data);

export const getAtencionById = (id: number): Promise<Atencion> =>
	http.get<Atencion>(`atenciones/${id}/`).then(res => res.data);

export const updateAtencion = (id: number, data: Partial<Atencion>): Promise<Atencion> =>
	http.patch<Atencion>(`atenciones/${id}/`, data).then(res => res.data);

export const getInsumosByIdAtencion = (id_atencion: number): Promise<Insumo[]> =>
	http.get<Insumo[]>(`atencion_insumo/buscar`, { params: { id_atencion } })
		.then(res => res.data);

// Personal endpoints
export const getPersonalById = (id: number): Promise<Personal> =>
	http.get<Personal>(`personal/${id}/`).then(res => res.data);

export const getEfectores = (): Promise<Efector[]> =>
	http.get<Efector[]>(`efectores/`).then(res => res.data);

// Domicilio endpoints
export const addDomicilio = (domicilio: Domicilio): Promise<Domicilio> =>
	http.post<Domicilio>(`domicilios/`, domicilio).then(res => res.data);

export const getDomicilio = (params: Record<string, any>): Promise<Domicilio[]> => {
	const query = new URLSearchParams();
	Object.entries(params).forEach(([key, val]) => {
		if (val != null) query.append(key, String(val))
	});
	return http
		.get<Domicilio[]>(`domicilios/buscar/`, { params: query })
		.then(res => res.data);
}

// Login
export const loginUser = (username: string, password: string): Promise<AuthTokens> =>
	http.post(`token/`, { username, password }).then(res => res.data);

// API Ciudadano
export const getCiudadano = (dni: number, sexo: string): Promise<APIResponseObj> =>
	http.get<APIResponseObj>('external_data/ciudadano/', { params: { dni, sexo } })
		.then(res => res.data);

// APIs Geolozalizacion
export const getFeatures = (domicilio: string): Promise<APIResponseList> =>
	http.get<APIResponseList>('external_data/features/', { params: { domicilio } })
		.then(res => res.data);

export const getDireccion = (codigoCalle: number, altura: number, bis?: number, letra?: string): Promise<APIResponseObj> =>
	http.get<APIResponseObj>('external_data/direccion/', {
		params: { codigoCalle, altura, bis, letra }
	}).then(res => res.data);

export const getLatitudLongitud = (punto_x: string, punto_y: string): Promise<APIResponseObj> =>
	http.get<APIResponseObj>('external_data/latitud-longitud/', {
		params: { punto_x, punto_y }
	}).then(res => res.data);

// Informe endpoints
export const getInforme = (id_atencion: number): Promise<string> =>
	http
		.get<Blob>('informes/', { params: { id_atencion }, responseType: 'blob' })
		.then(res => URL.createObjectURL(res.data));

export const sendInformeEmail = (params: Record<string, any>): Promise<void> =>
	http.post('informes/email/', params).then(() => {});

