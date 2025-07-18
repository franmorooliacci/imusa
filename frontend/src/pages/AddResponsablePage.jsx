import React, { useState } from 'react';
import { Box, Button, Divider, Grid2, Typography, TextField, MenuItem } from '@mui/material';
import { FormProvider, Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import ContactoForm from '../components/ContactoForm';
import DomicilioForm from '../components/DomicilioForm';
import AlertMessage from '../components/AlertMessage';
import { addDomicilio, addResponsable, getDomicilio } from '../services/api';
import { useNavigate } from 'react-router-dom';
import responsableNoRnpSchema from '../validation/responsableNoRnpSchema';
import { CircularProgress } from '@mui/material';

const AddResponsablePage = () => {
    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(responsableNoRnpSchema),
        defaultValues: {
            nombre: '',
            apellido: '',
            dni: '',
            sexo: '',
            fecha_nacimiento: '',
            domicilioActual: {},
            contacto: { telefono: '', mail: '' }
        }
    });
    const { handleSubmit, control, formState: { isValid } } = methods;
    const [domicilioDone, setDomicilioDone] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const navigate = useNavigate();
    const canSubmit = domicilioDone && isValid;
    const [submitting, setSubmitting] = useState(false);

    const formatResponsable = (data) => {

        const date = new Date(data.fecha_nacimiento);
        const formattedDate = date.toISOString().split('T')[0];
    
        const formattedResponsable = { 
            nombre: data.nombre,
            apellido: data.apellido,
            dni: data.dni,
            sexo: data.sexo,
            fecha_nacimiento: formattedDate,
            id_domicilio_renaper: '',
            id_domicilio_actual: '',
            telefono: data.contacto.telefono === '' ? null : data.contacto.telefono,
            mail: data.contacto.mail === '' ? null : data.contacto.mail
        };
    
        return formattedResponsable;
    };

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
            const formattedResponsable = formatResponsable(data);
            const formattedDomicilio = formatDomicilio(data.domicilioActual);
            
            const domicilio = await domicilioExists(formattedDomicilio);
            formattedResponsable.id_domicilio_actual = domicilio.id;
            
            const response = await addResponsable(formattedResponsable);

            setAlertSeverity('success');
            setAlertMsg('Responsable agregado con éxito!');
            setAlertOpen(true);

            setTimeout(() => {
                navigate(`/responsable/${response.id}`);
            }, 3000);
        } catch (error) {
            setAlertSeverity('error');
            setAlertMsg('No se ha podido agregar al responsable.');
            setAlertOpen(true);
            setSubmitting(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <Box
                component='form'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 4 }}
            >
                <Divider>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <FontAwesomeIcon icon={faUserPlus} size='2x' />
                        <Typography variant='h5'>Agregar responsable</Typography>
                    </Box>
                </Divider>

                <Grid2 container spacing={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Grid2 container sx={{ justifyContent: 'center' }}>    
                        <Grid2>
                            <Controller
                                name='nombre'
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label='Nombre'
                                        variant='outlined'
                                        size='small'
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Grid2>
                        <Grid2>
                            <Controller
                                name='apellido'
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label='Apellido'
                                        variant='outlined'
                                        size='small'
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Grid2>
                    </Grid2>
                    <Grid2 container sx={{ justifyContent: 'center'}}>
                        <Grid2>
                            <Controller
                                name='dni'
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label='DNI'
                                        variant='outlined'
                                        size='small'
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Grid2>
                        <Grid2>
                            <Controller
                                name='sexo'
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label='Sexo'
                                        variant='outlined'
                                        size='small'
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        sx={{ minWidth: 245 }}
                                    >
                                        <MenuItem value='M'>Masculino</MenuItem>
                                        <MenuItem value='F'>Femenino</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid2>
                    </Grid2>
                    <Grid2 container sx={{ justifyContent: 'center' }}>
                        <Grid2>
                            <Controller
                                name='fecha_nacimiento'
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        type='date'
                                        label='Fecha de Nacimiento'
                                        variant='outlined'
                                        size='small'
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true
                                            }
                                        }}
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        sx={{ minWidth: 245 }}
                                    />
                                )}
                            />
                        </Grid2>
                    </Grid2>
                </Grid2>

                <DomicilioForm
                    name='domicilioActual'
                    title='Domicilio'
                    setDomicilioDone={setDomicilioDone}
                />

                <ContactoForm name="contacto" />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button type='submit' variant='contained' color='primary' disabled={!canSubmit || submitting}> 
                        { submitting ? <CircularProgress size={24}  /> : 'Agregar'}</Button>
                </Box>

                <AlertMessage
                    open={alertOpen}
                    handleClose={() => setAlertOpen(false)}
                    message={alertMsg}
                    severity={alertSeverity}
                />
            </Box>
        </FormProvider>
    );
};

export default AddResponsablePage;
