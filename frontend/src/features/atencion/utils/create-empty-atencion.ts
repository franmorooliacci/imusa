import { createEmptyAnimal } from '@features/animal';
import type { Atencion } from '../types';

export const createEmptyAtencion = (): Atencion => {
    return {
        id_efector: 0,
        id_responsable: 0,
        id_domicilio_responsable: null,
        id_animal: 0,
        id_servicio: 0,
        id_personal: 0,
        fecha_ingreso: null,
        hora_ingreso: null,
        firma_ingreso: null,
        fecha_egreso: null,
        hora_egreso: null,
        firma_egreso: null,
        observaciones: null,
        finalizada: 0,
        id: 0,
        efector_nombre: '',
        personal_nombre: '',
        animal: createEmptyAnimal(),
        insumos: [],
        id_estado_egreso: 0,
        estado_egreso: ''
    } as Atencion;
};