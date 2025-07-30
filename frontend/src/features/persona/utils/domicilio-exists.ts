import { addDomicilio, getDomicilio } from '../api';
import type { Domicilio, DomicilioDTO } from '../types';

// Verifica si el domicilio ya existe en la db,
// si no existe lo agrega
export const domicilioExists = async (formattedDomicilio: DomicilioDTO): Promise<Domicilio> => {
    try {
        const response = await getDomicilio(formattedDomicilio);
        return response;
    } catch (error) {
        const response = await addDomicilio(formattedDomicilio);
        return response;
    }
};