import type { Domicilio } from '../types';

export const domicilioToString = (domicilio: Domicilio): string => {
    return (
        ` ${domicilio.calle} ${domicilio.altura}` +
        `${domicilio.bis === 0 ? '' : ' BIS'}` +
        `${domicilio.letra ? ` ${domicilio.letra}` : ''}` +
        `${domicilio.piso ? ` ${domicilio.piso}` : ''}` +
        `${domicilio.depto ? ` ${domicilio.depto}` : ''}` +
        `${domicilio.monoblock ? ` ${domicilio.monoblock}` : ''}` +
        `${domicilio.localidad ? `, ${domicilio.localidad}` : ''}`
    );
};