import * as yup from 'yup';

export const searchSchema = yup
	.object({
		dni: yup
			.string()
			.matches(/^\d{1,8}$/, 'Ingrese un DNI válido')
			.required('Ingrese un DNI válido'),

		sexo: yup
			.string()
			.oneOf(['M', 'F'], 'Seleccione el sexo')
			.required('Seleccione el sexo')
	})
	.required();

export type SearchFormValues = yup.InferType<typeof searchSchema>;
