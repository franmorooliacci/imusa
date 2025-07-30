import http from '@common/api/client'
import type { Animal, Raza, Tamaño, Color } from './types';

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