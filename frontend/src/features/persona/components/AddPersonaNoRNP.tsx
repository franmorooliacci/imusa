import React, { useState } from 'react';
import { Box, Button, Divider, Grid2, Typography, TextField, MenuItem, CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { FormProvider, Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { AlertSeverity, Setter } from '@common/types';
import { personaNoRnp, PersonaNoRnpFormValues } from '../schemas';
import { addNoRNPHandler } from '../utils/persona-handlers';
import ContactoForm from './ContactoForm';
import DomicilioForm from './DomicilioForm';

type Props = {
    setAlertOpen: Setter<boolean>;
    setAlertMsg: Setter<string>;
    setAlertSeverity: Setter<AlertSeverity>;
    onSubmit?: (...args: any[]) => void;
};

const AddPersonaNoRNP = (props: Props) => {
    const { setAlertOpen, setAlertMsg, setAlertSeverity, onSubmit } = props;
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
            contacto: { telefono: '', correo: '' }
        }
    });
    const { handleSubmit, control, formState: { isValid } } = methods;
    const [domicilioDone, setDomicilioDone] = useState<boolean>(false);
    const navigate = useNavigate();
    const canSubmit = domicilioDone && isValid;
    const [submitting, setSubmitting] = useState<boolean>(false);

    const submitHandler = async (data: Record<string, any>): Promise<void> => {
        if (submitting) return;
        setSubmitting(true);

        const persona: Record<string, any> = {
            nombre: data.nombre,
            apellido: data.apellido,
            dni: data.dni,
            sexo: data.sexo,
            fecha_nacimiento: data.fecha_nacimiento,
            id_domicilio_renaper: null,
            id_domicilio_actual: 0,
            telefono: data.contacto.telefono,
            correo: data.contacto.correo === '' ? null : data.contacto.correo,
            domicilioActual: data.domicilioActual
        };

        try {
            const response = await addNoRNPHandler(persona);

            setAlertSeverity('success');
            setAlertMsg('Responsable agregado con éxito!');
            setAlertOpen(true);

            if(onSubmit) {
                onSubmit(response);
            } else {
                setTimeout(() => {
                    navigate(`/responsable/${response.id}`);
                }, 3000); // Timeout para que se muestre la alerta
            }
        } catch (error) {
            setAlertSeverity('error');
            setAlertMsg('No se pudo agregar al responsable. Por favor, inténtalo de nuevo más tarde.');
            setAlertOpen(true);
            setSubmitting(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 4 }}>
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

                <ContactoForm name='contacto' />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                        variant='contained' 
                        color='primary' 
                        disabled={!canSubmit || submitting}
                        onClick={handleSubmit(submitHandler)}
                    > 
                        { submitting ? <CircularProgress size={24}  /> : 'Agregar'}
                    </Button>
                </Box>
            </Box>
        </FormProvider>
    );
};

export default AddPersonaNoRNP;
