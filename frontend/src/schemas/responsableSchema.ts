import * as yup from 'yup';
import { domicilioSchema } from './domicilioSchema';
import { contactoSchema } from './contactoSchema';

export const responsableSchema = yup
	.object({
		mismoDomicilio: yup
			.string()
			.oneOf(['si', 'no'], 'Seleccione una opción')
			.required('Campo obligatorio'),

		domicilioRenaper: domicilioSchema.required(),

		domicilioActual: domicilioSchema.when('mismoDomicilio', {
			is: 'no',
			then: (schema) => schema.required('Debe completar domicilio actual'),
			otherwise: (schema) => schema.strip()
		}),

		contacto: contactoSchema.required()
	})
	.required();

export type ResponsableFormValues = yup.InferType<typeof responsableSchema>;