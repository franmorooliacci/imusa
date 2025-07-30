import type { Domicilio } from '../types';

export const createEmptyDomicilio = (): Domicilio => {
    return {
        id: 0,
        calle: '',
        codigo_calle: null,
        altura: 0,
        bis: null,
        letra: null,
        piso: null,
        depto: null,
        monoblock: null,
        barrio: null,
        vecinal: null,
        distrito: null,
        seccional_policial: null,
        localidad: '',
        lineas_tup: null,
        coordenada_x: null,
        coordenada_y: null,
        fraccion_censal: null,
        radio_censal: null
    } as Domicilio;
};