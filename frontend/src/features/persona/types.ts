import type { Animal } from '@features/animal';

export interface DomicilioDTO {
    calle: string;
    codigo_calle?: number | null;
    altura: number;
    bis?: number | null;
    letra?: string | null;
    piso?: number | null;
    depto?: string | null;
    monoblock?: number | null;
    barrio?: string | null;
    vecinal?: string | null;
    distrito?: string | null;
    seccional_policial?: string | null;
    localidad: string;
    lineas_tup?: string | null;
    coordenada_x?: string | null;
    coordenada_y?: string | null;
    fraccion_censal?: string | null;
    radio_censal?: string | null;
}

export interface Domicilio extends DomicilioDTO {
    id: number;
}

// variables que no contempla API Ciudadano
export interface DomicilioBuffer {
    piso?: number | '';
    depto?: string | '';
    monoblock?: number | '';
}

export interface PersonaDTO {
    nombre: string;
    apellido: string;
    dni: number;
    sexo: string;
    fecha_nacimiento: string;
    id_domicilio_renaper?: number | null;
    id_domicilio_actual: number;
    telefono: string;
    mail?: string | null;
}

export interface Persona extends PersonaDTO {
    id: number;
    edad: number;
    domicilio_actual: Domicilio;
    caninos: Animal[];
    felinos: Animal[];
}