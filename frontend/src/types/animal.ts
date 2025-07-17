export interface Especie {
	id: number
	nombre: string
}

export interface Raza {
	id: number
	id_especie: Especie
	nombre: string
}

export interface Color {
	id: number
	nombre: string
}

export interface Tamaño {
	id: number
	nombre: string
}

export interface Animal {
	id: number
	nombre: string
	sexo: string
	fecha_nacimiento?: string | null
	id_tamaño: Tamaño
	id_responsable?: number | null
	id_especie: Especie
	id_raza: Raza
	fallecido: number
	esterilizado: number
	adoptado_imusa: number
	colores: Color[]
}