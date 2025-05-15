import * as yup from 'yup';

const domicilioSchema = yup.object({
    calle: yup
        .string()
        .required('Campo obligatorio'),
    altura: yup
        .string()
        .required('Campo obligatorio'),
    bis: yup
        .boolean(),
    letra: yup
        .string()
        .nullable(),
    piso: yup
        .string()
        .nullable(),
    depto: yup
        .string()
        .nullable(),
    monoblock: yup
        .string()
        .nullable(),
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
    coordenada_x: yup
        .string()
        .nullable(),
    coordenada_y: yup
        .string()
        .nullable(),
    punto_x: yup
        .string()
        .nullable(),
    punto_y: yup
        .string()
        .nullable(),
    latitud: yup
        .string()
        .nullable(),
    longitud: yup
        .string()
        .nullable(),
    fraccion_censal: yup
        .string()
        .nullable(),
    radio_censal: yup
        .string()
        .nullable()
});

export default domicilioSchema;