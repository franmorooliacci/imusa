import type { PersonaDTO, Persona } from '../types';
import { createEmptyDomicilio } from './create-empty-domicilio';

export const createEmptyPersona = (): Persona => {
    return {
        id: 0,
        nombre: '',
        apellido: '',
        dni: 0,
        sexo: '',
        fecha_nacimiento: '',
        id_domicilio_renaper: null,
        id_domicilio_actual: 0,
        telefono: '',
        mail: null,
        edad: 0,
        domicilio_actual: createEmptyDomicilio(),
        caninos: [],
        felinos: []
    } as Persona;
};

export const createEmptyPersonaDTO = (): PersonaDTO => {
    return {
        nombre: '',
        apellido: '',
        dni: 0,
        sexo: '',
        fecha_nacimiento: '',
        id_domicilio_renaper: null,
        id_domicilio_actual: 0,
        telefono: '',
        mail: null
    } as PersonaDTO;
};