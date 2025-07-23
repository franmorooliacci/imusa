import { Persona } from '@common/types/entities';
import { PersonaDTO } from '@common/types/dto';

export const createEmptyPersona = (): Persona => {
    return {
        id: 0,
        nombre: '',
        apellido: '',
        dni: 0,
        sexo: '',
        fecha_nacimiento: null,
        id_domicilio_renaper: null,
        id_domicilio_actual: 0,
        telefono: null,
        mail: null,
        edad: null,
        domicilio_actual: null,
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
        fecha_nacimiento: null,
        id_domicilio_renaper: null,
        id_domicilio_actual: 0,
        telefono: null,
        mail: null
    } as PersonaDTO;
};