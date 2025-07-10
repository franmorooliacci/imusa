import * as yup from 'yup';
import domicilioSchema from './domicilioSchema';
import contactoSchema from './contactoSchema';

const responsableNoRnpSchema = yup.object({
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
        .oneOf(['M', 'F'])
        .required('Debe seleccionar el sexo'),

    fecha_nacimiento: yup
        .date()
        .typeError('Fecha inválida')
        .max(new Date(), 'Fecha inválida')
        .required('Debe completar la fecha de nacimiento'),

    domicilioActual: domicilioSchema
        .required('Debe completar domicilio actual'),

    contacto: contactoSchema.required()
});

export default responsableNoRnpSchema;