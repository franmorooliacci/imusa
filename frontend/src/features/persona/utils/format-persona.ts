import { PersonaDTO } from '../types';

export const formatPersona = (data: Record<string, any>): PersonaDTO => {
    const date = data.fecha_nacimiento ? new Date(data.fecha_nacimiento) : null;
    const formattedDate = date ? date.toISOString().split('T')[0] : '';

    return { 
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
        sexo: data.sexo,
        fecha_nacimiento: formattedDate,
        id_domicilio_renaper: data.id_domicilio_renaper,
        id_domicilio_actual: data.id_domicilio_actual,
        telefono: data.telefono,
        correo: data.correo === '' ? null : data.correo
    };
};