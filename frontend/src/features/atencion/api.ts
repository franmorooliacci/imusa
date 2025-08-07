import http from '@common/api/client';
import type { Atencion, Insumo, Personal, Efector, AtencionDTO, AtencionInsumo, EstadoEgreso } from './types';

// Atencion endpoints
export const addAtencion = (newAtencion: AtencionDTO): Promise<Atencion> =>
	http.post<Atencion>(`atenciones/`, newAtencion).then(res => res.data);

export const addAtencionInsumo = (insumos: AtencionInsumo[]): Promise<AtencionInsumo[]> =>
	http.post<AtencionInsumo[]>(`atencion_insumo/`, insumos).then(res => res.data);

export const getAtenciones = (params: Record<string, any>): Promise<Atencion[]> =>
	http.get<Atencion[]>(`atenciones/buscar/`, { params }).then(res => res.data);

export const getAtencionById = (id: number): Promise<Atencion> =>
	http.get<Atencion>(`atenciones/${id}/`).then(res => res.data);

export const updateAtencion = (id: number, data: Partial<Atencion>): Promise<Atencion> =>
	http.patch<Atencion>(`atenciones/${id}/`, data).then(res => res.data);

export const getInsumosByIdAtencion = (id_atencion: number): Promise<Insumo[]> =>
	http.get<Insumo[]>(`atencion_insumo/buscar`, { params: { id_atencion } })
		.then(res => res.data);

export const getEstadosEgreso = (): Promise<EstadoEgreso[]> =>
	http.get<EstadoEgreso[]>(`estados_egreso/`)
		.then(res => res.data);

// Personal endpoints
export const getPersonalById = (id: number): Promise<Personal> =>
	http.get<Personal>(`personal/${id}/`).then(res => res.data);

export const getEfectores = (): Promise<Efector[]> =>
	http.get<Efector[]>(`efectores/`).then(res => res.data);

// Informe endpoints
export const getInforme = (id_atencion: number): Promise<string> =>
	http
		.get<Blob>('informes/', { params: { id_atencion }, responseType: 'blob' })
		.then(res => URL.createObjectURL(res.data));

export const sendInformeEmail = (params: Record<string, any>): Promise<void> =>
	http.post('informes/email/', params).then(() => {});