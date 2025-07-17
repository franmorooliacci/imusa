import { Box, Button, Divider, FormControlLabel, Grid2, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DomicilioForm from './DomicilioForm';
import { addDomicilio, addResponsable, getDomicilio } from '../services/api';
import AlertMessage from './AlertMessage';
import { useNavigate } from 'react-router-dom';
import ContactoForm from './ContactoForm';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import responsableSchema from '../validation/responsableSchema';
import { CircularProgress } from '@mui/material';

const AddResponsable = ({ responsable }) => {
    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(responsableSchema),
        defaultValues: {
            mismoDomicilio: 'si',
            domicilioRenaper: {},
            domicilioActual: {},
            contacto: { telefono:'', mail:'' }
        }
    });
    const { handleSubmit, watch, trigger, formState: { isValid } } = methods;
    const mismoDom = watch('mismoDomicilio');
    const [domRenaperDone, setDomRenaperDone] = useState(false);
    const [domActualDone, setDomActualDone] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const canSubmit = domRenaperDone && (mismoDom === 'no' ? domActualDone : true) && isValid;
    
    useEffect(() => {
        if (mismoDom === 'si') {
            trigger('domicilioRenaper').then(valid => {
                setDomRenaperDone(valid);
            });
            setDomActualDone(false);
        }
    }, [mismoDom, trigger]);

    // Formatea responsable para agregar a la db
    const formatResponsable = () => {

        const date = new Date(responsable.fecha_nacimiento);
        const formattedDate = date.toISOString().split('T')[0];

        const values = methods.getValues();
    
        const formattedResponsable = { 
            nombre: responsable.nombre,
            apellido: responsable.apellido,
            dni: responsable.dni,
            sexo: responsable.sexo,
            fecha_nacimiento: formattedDate,
            id_domicilio_renaper: '',
            id_domicilio_actual: '',
            telefono: values.contacto.telefono === '' ? null : values.contacto.telefono,
            mail: values.contacto.mail === '' ? null : values.contacto.mail
        };
    
        return formattedResponsable;
    };

    // Formatea domicilio para agregar a la db
    const formatDomicilio = (domicilio) => {
    
        const formattedDomicilio = {
            ...domicilio,
            bis: domicilio.bis ? 1 : 0,
            letra: domicilio.letra === '' ? null : domicilio.letra,
            piso: domicilio.piso === '' ? null : domicilio.piso,
            depto: domicilio.depto === '' ? null : domicilio.depto,
            monoblock: domicilio.monoblock === '' ? null : domicilio.monoblock,
            barrio: domicilio.barrio === '' ? null : domicilio.barrio,
            vecinal: domicilio.vecinal === '' ? null : domicilio.vecinal,
            distrito: domicilio.distrito === '' ? null : domicilio.distrito,
            seccional_policial: domicilio.seccional_policial === '' ? null : domicilio.seccional_policial,
            coordenada_x: domicilio.coordenada_x === '' ? null : domicilio.coordenada_x,
            coordenada_y: domicilio.coordenada_y === '' ? null : domicilio.coordenada_y,
            punto_x: domicilio.punto_x === '' ? null : domicilio.punto_x,
            punto_y: domicilio.punto_y === '' ? null : domicilio.punto_y,
            latitud: domicilio.latitud === '' ? null : domicilio.latitud,
            longitud: domicilio.longitud === '' ? null : domicilio.longitud,
            fraccion_censal: domicilio.fraccion_censal === '' ? null : domicilio.fraccion_censal,
            radio_censal: domicilio.radio_censal === '' ? null : domicilio.radio_censal
        };
    
        return formattedDomicilio;
    };

    // Verifica si el domicilio ya existe en la db, 
    // si no existe lo agrega
    const domicilioExists = async (formattedDomicilio) => {
        try {
            const response = await getDomicilio(formattedDomicilio);
            return response;
        } catch (error) {
            try {
                const response = await addDomicilio(formattedDomicilio);
                return response;
            } catch (error) {
                throw error;
            }
        }
    };

    const onSubmit = async (data) => {

        if (submitting) return;
        setSubmitting(true);
        
        try {
            const formattedResponsable = formatResponsable();
            const formattedDomRNP = formatDomicilio(data.domicilioRenaper);

            const domicilio = await domicilioExists(formattedDomRNP);
            formattedResponsable.id_domicilio_renaper = domicilio.id;

            if(data.mismoDomicilio === 'no'){
                const formattedDomAct = formatDomicilio(data.domicilioActual);
                const domicilio = await domicilioExists(formattedDomAct);
                formattedResponsable.id_domicilio_actual = domicilio.id;
            } else {
                formattedResponsable.id_domicilio_actual = formattedResponsable.id_domicilio_renaper;
            }
                
            const response = await addResponsable(formattedResponsable);
                
            setAlertSeverity('success');
            setAlertMsg('Responsable agregado con éxito!');
            setAlertOpen(true);
        
            setTimeout(() => {
                navigate(`/responsable/${response.id}`);
            }, 3000); // Timeout para que se muestre la alerta
        } catch (error) {
            setAlertSeverity('error');
            setAlertMsg('No se ha podido agregar al responsable.');
            setAlertOpen(true);
            setSubmitting(false);
        }
    };
    
    return (
        <FormProvider {...methods}>
            <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
                <DomicilioForm 
                    name = {'domicilioRenaper'} 
                    title = {'Domicilio (ReNaPer)'} 
                    domicilioRenaper = {responsable.domicilio_actual} 
                    setDomicilioDone = {setDomRenaperDone}
                />

                <Divider sx={{ mt: 2 }} />

                <Grid2 container spacing={1} sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Grid2>
                        <Typography variant='body1'>¿Es su domicilio actual?</Typography>
                    </Grid2>
                    <Grid2>
                        <Controller
                            name="mismoDomicilio"
                            control={methods.control}
                            defaultValue="si"
                            render={({ field }) => (
                                <RadioGroup row {...field}>
                                    <FormControlLabel value="si" control={<Radio />} label="SI" />
                                    <FormControlLabel value="no" control={<Radio />} label="NO" />
                                </RadioGroup>
                            )}
                        />
                    </Grid2>
                </Grid2>

                {mismoDom === 'no' &&
                    <DomicilioForm 
                        name = {'domicilioActual'} 
                        title = {'Domicilio (Actual)'} 
                        setDomicilioDone = {setDomActualDone}
                    />
                }

                <ContactoForm name = {'contacto'} />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button type='submit' variant='contained' color='primary' disabled={!canSubmit || submitting}> 
                        { submitting ? <CircularProgress size={24}  /> : 'Agregar'}</Button>
                </Box>

                <AlertMessage
                    open = {alertOpen}
                    handleClose = {() => setAlertOpen(false)}
                    message = {alertMsg}
                    severity = {alertSeverity}
                />
            </Box>
        </FormProvider>
    );
};

export default AddResponsable;