import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, FormControlLabel, Grid2, Radio, RadioGroup, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider, Controller, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { AlertSeverity, Setter } from '@common/types';
import { addPersona } from '../api';
import { persona, PersonaFormValues } from '../schemas';
import { formatDomicilio, domicilioExists } from '../utils';
import type { PersonaDTO } from '../types';
import DomicilioForm from './DomicilioForm';
import ContactoForm from './ContactoForm';

type Props = {
    newPersona: PersonaDTO;
    domicilioActual: string;
    setAlertOpen: Setter<boolean>;
    setAlertMsg: Setter<string>;
    setAlertSeverity: Setter<AlertSeverity>;
    onSubmit?: (...args: any[]) => void;
};

const AddPersona = ({ newPersona, domicilioActual, setAlertOpen, setAlertMsg, setAlertSeverity, onSubmit }: Props) => {
    const methods = useForm<PersonaFormValues>({
        mode: 'onChange',
        resolver: yupResolver(persona) as Resolver<PersonaFormValues>,
        defaultValues: {
            mismoDomicilio: 'si',
            domicilioRenaper: {},
            domicilioActual: {},
            contacto: { telefono:'', mail:'' }
        },
        shouldUnregister: false
    });
    const { handleSubmit, watch, trigger, formState: { isValid } } = methods;
    const mismoDom = watch('mismoDomicilio');
    const [domRenaperDone, setDomRenaperDone] = useState(false);
    const [domActualDone, setDomActualDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const canSubmit = domRenaperDone && (mismoDom === 'no' ? domActualDone : true) && isValid;

    useEffect(() => {
        if (mismoDom === 'si') {
            setDomActualDone(false);
            trigger('domicilioRenaper').then(valid => {
                setDomRenaperDone(valid);
            });
        }
    }, [mismoDom, trigger]);

    //console.log('isValid', isValid, 'errors', methods.formState.errors, 'values', methods.getValues());
    //console.log('domRenaperDone', domRenaperDone,'domActualDone', domActualDone, 'isValid', isValid, 'canSubmit', canSubmit);

    // Formatea responsable para agregar a la db
    const formatResponsable = (): PersonaDTO => {

        const date = newPersona.fecha_nacimiento ? new Date(newPersona.fecha_nacimiento) : null;
        const formattedDate = date ? date.toISOString().split('T')[0] : '';

        const values = methods.getValues();
    
        return { 
            nombre: newPersona.nombre,
            apellido: newPersona.apellido,
            dni: newPersona.dni,
            sexo: newPersona.sexo,
            fecha_nacimiento: formattedDate,
            id_domicilio_renaper: 0,
            id_domicilio_actual: 0,
            telefono: values.contacto.telefono,
            mail: values.contacto.mail === '' ? null : values.contacto.mail
        };
    };

    const defaultSubmitHandler = async (data: Record<string, any>): Promise<void> => {

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
                
            const response = await addPersona(formattedResponsable);
                
            setAlertSeverity('success');
            setAlertMsg('Responsable agregado con éxito!');
            setAlertOpen(true);
        
            setTimeout(() => {
                navigate(`/responsable/${response.id}`);
            }, 3000); // Timeout para que se muestre la alerta
        } catch (error) {
            setAlertSeverity('error');
            setAlertMsg('No se pudo agregar al responsable. Por favor, inténtalo de nuevo más tarde.');
            setAlertOpen(true);
            setSubmitting(false);
        }
    };

    const submitHandler = onSubmit ?? defaultSubmitHandler;
    
    return (
        <FormProvider {...methods}>
            <Box>
                <DomicilioForm 
                    name = {'domicilioRenaper'} 
                    title = {'Domicilio (ReNaPer)'} 
                    domicilioRenaper = {domicilioActual} 
                    setDomicilioDone = {setDomRenaperDone}
                    setAlertOpen = {setAlertOpen}
                    setAlertMsg = {setAlertMsg}
                    setAlertSeverity = {setAlertSeverity}
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
                        setAlertOpen = {setAlertOpen}
                        setAlertMsg = {setAlertMsg}
                        setAlertSeverity = {setAlertSeverity}
                    />
                }

                <ContactoForm name = {'contacto'} />

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

export default AddPersona;