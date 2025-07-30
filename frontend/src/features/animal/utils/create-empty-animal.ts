import type { Animal } from '../types';

export const createEmptyAnimal = (id_especie: number = 0, id_responsable: number | null = null): Animal => {
    return {
        nombre: '',
        sexo: '',
        fecha_nacimiento: null,
        id_tamaño: 0,
        id_responsable: id_responsable,
        id_especie: id_especie,
        id_raza: 0,
        fallecido: 0,
        esterilizado: 0,
        adoptado_imusa: 0,
        id: 0,
        colores: [],
        raza: '',
        tamaño: '',
        edad: ''
    } as Animal;
};