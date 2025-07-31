import type { DomicilioDTO } from '../types';

// Formatea domicilio para agregar a la db
export const formatDomicilio = (domicilio: Record<string, any>): DomicilioDTO => {

    return {
        calle: String(domicilio.calle),
        codigo_calle: domicilio.codigo_calle === '' ? null : Number(domicilio.codigo_calle) || null,
        altura: Number(domicilio.altura),
        bis: domicilio.bis ? 1 : 0,
        letra: domicilio.letra === '' ? null : domicilio.letra,
        piso: domicilio.piso === '' ? null : domicilio.piso,
        depto: domicilio.depto === '' ? null : domicilio.depto,
        monoblock: domicilio.monoblock === '' ? null : domicilio.monoblock,
        localidad: String(domicilio.localidad),
        barrio: domicilio.barrio === '' ? null : String(domicilio.barrio),
        vecinal: domicilio.vecinal === '' ? null : String(domicilio.vecinal),
        distrito: domicilio.distrito === '' ? null : String(domicilio.distrito),
        seccional_policial: domicilio.seccional_policial === '' ? null : String(domicilio.seccional_policial),
        coordenada_x: domicilio.coordenada_x === '' ? null : String(domicilio.coordenada_x),
        coordenada_y: domicilio.coordenada_y === '' ? null : String(domicilio.coordenada_y),
        fraccion_censal: domicilio.fraccion_censal === '' ? null : String(domicilio.fraccion_censal),
        radio_censal: domicilio.radio_censal === '' ? null : String(domicilio.radio_censal),
        lineas_tup: domicilio.lineas_tup === '' ? null : String(domicilio.lineas_tup),
    };
};