import { addPersona } from '../api';
import { Persona } from '../types';
import { domicilioExists } from './domicilio-exists';
import { formatDomicilio } from './format-domicilio';
import { formatPersona } from './format-persona';

export const addHandler = async (data: Record<string, any>): Promise<Persona> => {
    const formattedResponsable = formatPersona(data);
    const formattedDomRNP = formatDomicilio(data.domicilioRenaper);

    const domicilio = await domicilioExists(formattedDomRNP);
    formattedResponsable.id_domicilio_renaper = domicilio.id;

    if(data.mismoDomicilio === 'no'){
        const formattedDomAct = formatDomicilio(data.domicilioActual);
        const domicilio = await domicilioExists(formattedDomAct);
        formattedResponsable.id_domicilio_actual = domicilio.id;
    } else {
        formattedResponsable.id_domicilio_actual = formattedResponsable.id_domicilio_renaper;
    }
    
    const response = await addPersona(formattedResponsable);
    return response;
};

export const addNoRNPHandler = async (data: Record<string, any>): Promise<Persona> => {
    const formattedResponsable = formatPersona(data);
    const formattedDomicilio = formatDomicilio(data.domicilioActual);
    
    const domicilio = await domicilioExists(formattedDomicilio);
    formattedResponsable.id_domicilio_actual = domicilio.id;
    
    const response = await addPersona(formattedResponsable);
    return response;
};