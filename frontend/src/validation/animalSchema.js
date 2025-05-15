import * as yup from 'yup';

export const animalSchema = yup.object({
    id_raza: yup
        .string()
        .required('Seleccione una raza'),
    nombre: yup
        .string()
        .required('Ingrese el nombre'),
    sexo: yup
        .string()
        .oneOf(['M', 'H'], 'Seleccione el sexo')
        .required('El sexo es requerido'),
    año_nacimiento: yup
        .number()
        .typeError('Ingrese un año válido')
        .integer('Ingrese un año entero')
        .min(1900, 'Año demasiado bajo')
        .max(new Date().getFullYear(), 'Año en el futuro')
        .required('Ingrese el año de nacimiento'),
    pelaje_color: yup
        .string()
        .max(30, 'Máximo 30 caracteres'),
    fallecido: yup
        .number()
        .oneOf([0, 1]),
});