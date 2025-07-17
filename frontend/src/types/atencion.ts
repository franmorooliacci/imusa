import { Animal } from './animal';

export interface Servicio {
	id: number
	nombre: string
}

export interface Insumo {
	id: number
	nombre: string
	tope_max?: number | null
	tope_min?: number | null
}

export interface Atencion {
	id: number
	id_efector: number
	id_responsable: number
	id_domicilio_responsable?: number | null
	id_animal: Animal
	id_servicio: Servicio
	id_personal: number
	fecha_ingreso?: string | null
	hora_ingreso?: string | null
	firma_ingreso?: string | null
	fecha_egreso?: string | null
	hora_egreso?: string | null
	firma_egreso?: string | null
	observaciones?: string | null
	finalizada: number
	insumos: Insumo[]
}