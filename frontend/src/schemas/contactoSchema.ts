import * as yup from 'yup';

export const contactoSchema = yup
	.object({
		telefono: yup
			.string()
			.required('Campo obligatorio')
			.matches(/^\d{10}$/, 'Teléfono inválido'),

		mail: yup
			.string()
			.notRequired()
			.test(
				'is-empty-or-email',
				'Mail inválido',
				(value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
			)
	})
	.required();

export type ContactoFormValues = yup.InferType<typeof contactoSchema>;
