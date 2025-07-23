import * as yup from 'yup';

export const domicilio = yup
	.object({
		calle: yup
			.string()
			.required('Campo obligatorio'),

		codigo_calle: yup
			.number()
			.nullable(),

		altura: yup
			.number()
			.required('Campo obligatorio')
			.typeError('Campo obligatorio'),

		bis: yup
			.mixed<boolean | number>()
			.transform((value, original) => {
				if (typeof original === 'boolean') {
					return original ? 1 : 0;
				}
				return original;
			})
			.oneOf([0,1])
			.nullable(),

		letra: yup
			.string()
			.nullable(),

		piso: yup
			.number()
			.nullable()
			.transform((value, original) =>
				original === '' ? null : value
			),

		depto: yup
			.string()
			.nullable()
			.transform((value, original) =>
				original === '' ? null : value
			),

		monoblock: yup
			.number()
			.nullable()
			.transform((value, original) =>
				original === '' ? null : value
			),

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

export type DomicilioFormValues = yup.InferType<typeof domicilio>;
