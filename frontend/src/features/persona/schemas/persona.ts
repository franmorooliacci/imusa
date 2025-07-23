import * as yup from 'yup';
import { domicilio } from './domicilio';
import { contacto } from './contacto';

export const persona = yup
	.object({
		mismoDomicilio: yup
			.string()
			.oneOf(['si', 'no'], 'Seleccione una opción')
			.required('Campo obligatorio'),

		domicilioRenaper: domicilio.required(),

		domicilioActual: yup.mixed().when('mismoDomicilio', {
			is: 'no',
			then: () => domicilio.required('Debe completar domicilio actual'),
			otherwise: () => yup.mixed().notRequired().nullable()
		}),

		contacto: contacto.required()
	})
	.required();

export type PersonaFormValues = Omit<yup.InferType<typeof persona>, 'domicilioActual'> & {
    domicilioActual?: yup.InferType<typeof domicilio> | null;
};