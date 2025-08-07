import type { Persona } from '@features/persona';
import type { Animal } from '@features/animal';

//---------- Servicio ----------//
export interface Servicio {
	id: number;
	nombre: string;
}

//---------- Insumo ----------//
export interface Insumo {
	id: number;
	nombre: string;
	tope_max?: number | null;
	tope_min?: number | null;
}

export interface AtencionInsumo {
    id_atencion: number;
    id_insumo: number;
    cant_ml: number;
    cant_ml_prequirurgico?: number | null;
    cant_ml_induccion?: number | null;
    cant_ml_quirofano?: number | null;
}

export type InsumoOption = {
    selected: boolean;
    value: string;
    id: number;
};

export type InsumoOptions = {
    acepromacina: InsumoOption;
    triancinolona: InsumoOption;
    atropina: InsumoOption;
    dexametasona: InsumoOption;
    diazepan: InsumoOption;
    antibiotico: InsumoOption;
    doxapram: InsumoOption;
    coagulante: InsumoOption;
    ivermectina: InsumoOption;
    complejoVitB: InsumoOption;
    mezcla: InsumoOption;
    dipirona: InsumoOption;
};

export type KetaminaKeys = 'prequirurgico' | 'induccion' | 'quirofano';
export type KetaminaState = Record<KetaminaKeys, string>;

//---------- Estado Egreso ----------//
export interface EstadoEgreso {
    id: number;
    nombre: string;
}

//---------- Atencion ----------//
export interface AtencionDTO {
    id_efector: number;
    id_responsable: number;
    id_domicilio_responsable?: number | null;
    id_animal: number;
    id_servicio: number;
    id_personal: number;
    fecha_ingreso?: string | null;
    hora_ingreso?: string | null;
    firma_ingreso?: string | null;
    id_estado_egreso?: number | null;
    fecha_egreso?: string | null;
    hora_egreso?: string | null;
    firma_egreso?: string | null;
    observaciones?: string | null;
    finalizada: number;
}

export interface Atencion extends AtencionDTO{
	id: number;
	efector_nombre: string;
	personal_nombre: string;
	animal: Animal;
	insumos: Insumo[];
    estado_egreso: string;
}

//---------- Efector ----------//
export interface Efector {
    id: number;
    nombre: string;
    unidad_movil: number;
}

//---------- Personal ----------//
export interface TipoPersonal {
    id: number;
    nombre: string;
}

export interface Personal {
    id: number;
    id_persona: Persona;
    matricula: string;
    firma?: string | null;
    legajo: number;
    user?: number | null;
    efectores: Efector[];
    id_tipo_personal: TipoPersonal;
}