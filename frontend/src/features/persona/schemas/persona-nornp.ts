import * as yup from 'yup';
import { domicilio } from './domicilio';
import { contacto } from './contacto';

export const personaNoRnp = yup
	.object({
		nombre: yup
			.string()
			.required('Debe completar el nombre'),

		apellido: yup
			.string()
			.required('Debe completar el apellido'),

		dni: yup
			.number()
			.typeError('El DNI debe ser un número')
			.integer('El DNI debe ser un número entero')
			.positive('El DNI debe ser positivo')
			.required('Debe completar el DNI'),

		sexo: yup
			.string()
			.oneOf(['M', 'F'], 'Seleccione el sexo')
			.required('Debe seleccionar el sexo'),

		fecha_nacimiento: yup
			.date()
			.typeError('Fecha inválida')
			.max(new Date(), 'Fecha inválida')
			.required('Debe completar la fecha de nacimiento'),

		domicilioActual: domicilio.required('Debe completar domicilio actual'),

		contacto: contacto.required()
	})
	.required();

export type PersonaNoRnpFormValues = yup.InferType<typeof personaNoRnp>;
