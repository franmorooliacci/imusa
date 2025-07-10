import * as yup from 'yup';
import domicilioSchema from './domicilioSchema';
import contactoSchema from './contactoSchema';

const responsableSchema = yup.object({
  mismoDomicilio: yup
    .string()
    .oneOf(['si','no'])
    .required(),

  domicilioRenaper: domicilioSchema.required(),

  domicilioActual: domicilioSchema.when('mismoDomicilio', {
    is: 'no',
    then: (schema) => schema.required('Debe completar domicilio actual'),
    otherwise: (schema) => schema.strip()
  }),  

  contacto: contactoSchema.required()
});

export default responsableSchema;
