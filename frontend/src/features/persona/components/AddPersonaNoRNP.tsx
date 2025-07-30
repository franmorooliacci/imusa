import React, { useState } from 'react';
import { Box, Button, Divider, Grid2, Typography, TextField, MenuItem, CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { FormProvider, Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { AlertSeverity, Setter } from '@common/types';
import type { PersonaDTO } from '../types';
import { addPersona } from '../api';
import { personaNoRnp, PersonaNoRnpFormValues } from '../schemas';
import { formatDomicilio, domicilioExists } from '../utils';
import ContactoForm from './ContactoForm';
import DomicilioForm from './DomicilioForm';

type Props = {
    setAlertOpen: Setter<boolean>;
    setAlertMsg: Setter<string>;
    setAlertSeverity: Setter<AlertSeverity>;
};

const AddPersonaNoRNP = (props: Props) => {
    const { setAlertOpen, setAlertMsg, setAlertSeverity } = props;
    const methods = useForm<PersonaNoRnpFormValues>({
        mode: 'onChange',
        resolver: yupResolver(personaNoRnp),
        defaultValues: {
            nombre: '',
            apellido: '',
            dni: undefined,
            sexo: undefined,
            fecha_nacimiento: undefined,
            domicilioActual: {},
            contacto: { telefono: '', mail: '' }
        }
    });
    const { handleSubmit, control, formState: { isValid } } = methods;
    const [domicilioDone, setDomicilioDone] = useState<boolean>(false);
    const navigate = useNavigate();
    const canSubmit = domicilioDone && isValid;
    const [submitting, setSubmitting] = useState<boolean>(false);

    const formatResponsable = (data: Record<string, any>): PersonaDTO => {

        const date = new Date(data.fecha_nacimiento);
        const formattedDate = date.toISOString().split('T')[0];
    
        return { 
            nombre: data.nombre,
            apellido: data.apellido,
            dni: data.dni,
            sexo: data.sexo,
            fecha_nacimiento: formattedDate,
            id_domicilio_renaper: null,
            id_domicilio_actual: 0,
            telefono: data.contacto.telefono === '' ? null : data.contacto.telefono,
            mail: data.contacto.mail === '' ? null : data.contacto.mail
        };
    };

    const onSubmit = async (data: Record<string, any>): Promise<void> => {
        if (submitting) return;
        setSubmitting(true);

        try {
            const formattedResponsable = formatResponsable(data);
            const formattedDomicilio = formatDomicilio(data.domicilioActual);
            
            const domicilio = await domicilioExists(formattedDomicilio);
            formattedResponsable.id_domicilio_actual = domicilio.id;
            
            const response = await addPersona(formattedResponsable);

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
                    setAlertOpen = {setAlertOpen}
                    setAlertMsg = {setAlertMsg}
                    setAlertSeverity = {setAlertSeverity}
                />

                <ContactoForm name="contacto" />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button type='submit' variant='contained' color='primary' disabled={!canSubmit || submitting}> 
                        { submitting ? <CircularProgress size={24}  /> : 'Agregar'}
                    </Button>
                </Box>
            </Box>
        </FormProvider>
    );
};

export default AddPersonaNoRNP;
