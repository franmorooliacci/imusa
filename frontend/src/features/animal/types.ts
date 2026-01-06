export interface Especie {
    id: number;
    nombre: string;
}

export interface Raza {
    id: number;
    id_especie: number;
    nombre: string;
    es_peligrosa: number;
}

export interface Color {
    id: number;
    nombre: string;
}

export interface Tamaño {
    id: number;
    nombre: string;
}

export interface AnimalDTO {
    nombre: string;
    sexo: string;
    fecha_nacimiento?: string | null;
    id_tamaño: number;
    id_responsable?: number | null;
    id_especie: number;
    id_raza: number;
    fallecido: number;
    esterilizado: number;
    adoptado_imusa: number;
    es_peligroso: number;
    observaciones: string | null;
}

export interface Animal extends AnimalDTO {
    id: number;
    colores: Color[];
    raza: string;
    tamaño: string;
    edad: string;
}
