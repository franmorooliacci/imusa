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
        barrio: domicilio.barrio ? domicilio.barrio : null,
        vecinal: domicilio.vecinal ? domicilio.vecinal : null,
        distrito: domicilio.distrito ? domicilio.distrito : null,
        seccional_policial: domicilio.seccional_policial ? domicilio.seccional_policial : null,
        coordenada_x: domicilio.coordenada_x ? domicilio.coordenada_x : null,
        coordenada_y: domicilio.coordenada_y ? domicilio.coordenada_y : null,
        fraccion_censal: domicilio.fraccion_censal ? domicilio.fraccion_censal : null,
        radio_censal: domicilio.radio_censal ? domicilio.radio_censal : null,
        lineas_tup: domicilio.lineas_tup ? domicilio.lineas_tup : null,
    };
};