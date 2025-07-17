import { Efector } from './efector';
import { Persona } from './persona';

export interface TipoPersonal {
    id: number;
    nombre: string;
}

export interface Personal {
    id: number;
    id_persona: Persona;
    matricula: string;
    firma?: string | null;
    legajo: number;
    estado: number;
    user?: number | null;
    efectores: Efector[];
    id_tipo_personal: TipoPersonal;
}

