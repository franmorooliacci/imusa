import * as yup from 'yup';

export const animalSchema = yup.object({
	nombre: yup
		.string()
		.required('Ingrese el nombre'),

	sexo: yup
		.string()
		.oneOf(['M', 'H'], 'Seleccione el sexo')
		.transform((val, orig) => (orig === '' ? undefined : val))
		.required('Seleccione el sexo'),

	fecha_nacimiento: yup
		.date()
		.nullable(),

	id_tamaño: yup
		.number()
		.transform((val, orig) => (orig === '' ? undefined : val))
		.required('Seleccione el tamaño'),

	id_raza: yup
		.number()
		.transform((val, orig) => (orig === '' ? undefined : val))
		.required('Seleccione la raza'),

	fallecido: yup
		.number()
		.oneOf([0, 1])
		.required(),

	esterilizado: yup
		.number()
		.oneOf([0, 1])
		.required(),

	adoptado_imusa: yup
		.number()
		.oneOf([0, 1])
		.required(),

	colores: yup
		.array()
		.of(yup.number().required())
		.min(1, 'Seleccione al menos un color')
		.required('El color es requerido'),
});

export type AnimalFormValues = yup.InferType<typeof animalSchema>;
