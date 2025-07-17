import * as yup from 'yup';

export const domicilioSchema = yup
	.object({
		calle: yup
			.string()
			.required('Campo obligatorio'),

		codigo_calle: yup
			.number()
			.nullable(),

		altura: yup
			.number()
			.required('Campo obligatorio'),

		bis: yup
			.boolean()
			.nullable(),

		letra: yup
			.string()
			.nullable(),

		piso: yup
			.number()
			.nullable(),

		depto: yup
			.string()
			.nullable(),

		monoblock: yup
			.number()
			.nullable(),

		barrio: yup
			.string()
			.nullable(),

		vecinal: yup
			.string()
			.nullable(),

		distrito: yup
			.string()
			.nullable(),

		seccional_policial: yup
			.string()
			.nullable(),

		localidad: yup
			.string()
			.required('Campo obligatorio'),

		lineas_tup: yup
			.string()
			.nullable(),

		coordenada_x: yup
			.string()
			.nullable(),

		coordenada_y: yup
			.string()
			.nullable(),

		fraccion_censal: yup
			.string()
			.nullable(),

		radio_censal: yup
			.string()
			.nullable()
	})
	.required();

export type DomicilioFormValues = yup.InferType<typeof domicilioSchema>;
