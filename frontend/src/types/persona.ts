import { Domicilio } from './domicilio';

export interface Persona {
    id: number;
    nombre: string;
    apellido: string;
    dni: number;
    sexo: string;
    fecha_nacimiento: string | null;
    id_domicilio_renaper?: Domicilio | null;
    id_domicilio_actual: Domicilio;
    telefono?: string | null;
    mail?: string | null;
}
