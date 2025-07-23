import * as yup from 'yup';

export const search = yup
	.object({
		dni: yup
			.string()
			.matches(/^\d{1,8}$/, 'Ingrese un DNI válido')
			.required('Ingrese un DNI válido'),

		sexo: yup
			.string()
			.oneOf(['','M', 'F'], 'Seleccione el sexo')
			.required('Seleccione el sexo')
	})
	.required();

type SearchFormValues = yup.InferType<typeof search>;

export type SearchFormInputs = Omit<SearchFormValues, 'sexo'> & { sexo: '' | 'M' | 'F' };
