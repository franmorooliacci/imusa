import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import ContactoForm from './ContactoForm';
import { addDomicilio, getDomicilio, updatePersona } from '../services/api';
import AlertMessage from './AlertMessage';
import DomicilioForm from './DomicilioForm';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import domicilioSchema from '../validation/domicilioSchema';
import contactoSchema from '../validation/contactoSchema';

const EditResponsable = ({ editDomicilio, setEditDomicilio, editContacto, setEditContacto, responsable, setResponsable }) => {
    const nestedContactoSchema = yup.object({ contacto: contactoSchema.required() });
    const nestedDomicilioSchema = yup.object({ domicilio: domicilioSchema.required() });
    const contactoMethods = useForm({
        mode: 'onChange',
        resolver: yupResolver(nestedContactoSchema),
        defaultValues: {
            contacto: { 
                telefono: responsable.telefono ?? '', 
                mail: responsable.mail ?? '' 
            }
        }
    });
    const { handleSubmit: handleSubmitContacto } = contactoMethods;
    const domicilioMethods = useForm({
        mode: 'onChange',
        resolver: yupResolver(nestedDomicilioSchema),
        defaultValues: {
            domicilio: responsable.domicilio_actual ?? {}
        }
    });
    const { handleSubmit: handleSubmitDomicilio } = domicilioMethods;
    const [domicilioDone, setDomicilioDone] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');

    // Formatea domicilio para agregar a la db
    const formatDomicilio = (domicilio) => {
    
        const formattedDomicilio = {
            ...domicilio,
            codigo_calle: domicilio.codigo_calle === '' ? null : domicilio.codigo_calle,
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
            fraccion_censal: domicilio.fraccion_censal === '' ? null : domicilio.fraccion_censal,
            radio_censal: domicilio.radio_censal === '' ? null : domicilio.radio_censal,
            lineas_tup: domicilio.lineas_tup === '' ? null : domicilio.lineas_tup
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

    const onSubmitContacto = async (data) => {
        try{
            await updatePersona(responsable.id, data.contacto);
            
            setResponsable(prev => ({
                ...prev,
                telefono: data.contacto.telefono,
                mail: data.contacto.mail
            }));
            
            setAlertSeverity('success');
            setAlertMsg('Modificación realizada con éxito!');
            setAlertOpen(true);
            
            setTimeout(() => {
                setEditContacto(false);
            }, 3000); // Timeout para que se muestre la alerta
        } catch(error){
            setAlertSeverity('error');
            setAlertMsg('No se ha podido realizar la modificación.');
            setAlertOpen(true);
        }
    };

    const onSubmitDomicilio = async (data) => {
        try{
            const formattedDomicilio = formatDomicilio(data.domicilio);
            const newDomicilio = await domicilioExists(formattedDomicilio);

            // Actualizo los datos del responsable que voy a mostrar
            setResponsable(prev => ({
                ...prev,
                domicilio_actual: newDomicilio
            }));

            // Actualizo el nuevo domicilio en la db
            await updatePersona(responsable.id, { id_domicilio_actual: newDomicilio.id });

            setAlertSeverity('success');
            setAlertMsg('Modificación realizada con éxito!');
            setAlertOpen(true);
            
            setTimeout(() => {
                setEditDomicilio(false);
            }, 3000); // Timeout para que se muestre la alerta

        } catch(error){
            setAlertSeverity('error');
            setAlertMsg('No se ha podido realizar la modificación.');
            setAlertOpen(true);
        }
    };

    return (
        <Box>
            {editContacto && (
                <FormProvider {...contactoMethods}>
                    <Box component='form' onSubmit={handleSubmitContacto(onSubmitContacto)} noValidate>
                        <ContactoForm name = {'contacto'} />
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Button 
                                variant='outlined' 
                                color='error' 
                                onClick={() => setEditContacto(false)}
                                size='small'
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type='submit' 
                                variant='contained' 
                                color='primary'
                                size='small'
                            >
                                Guardar
                            </Button>
                        </Box>
                    </Box>
                </FormProvider>
            )}

            {editDomicilio && (
                <FormProvider {...domicilioMethods}>
                    <Box component='form' onSubmit={handleSubmitDomicilio(onSubmitDomicilio)} noValidate>
                        <DomicilioForm name = {'domicilio'} title = {'Domicilio'} setDomicilioDone = {setDomicilioDone} />
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                            <Button 
                                variant='outlined' 
                                color='error' 
                                onClick={() => setEditDomicilio(false)}
                                size='small'
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type='submit' 
                                variant='contained' 
                                color='primary'
                                size='small'
                                disabled={!domicilioDone}
                            >
                                Guardar
                            </Button>
                        </Box>
                    </Box>
                </FormProvider>
            )}

            <AlertMessage
                open = {alertOpen}
                handleClose = {() => setAlertOpen(false)}
                message = {alertMsg}
                severity = {alertSeverity}
            />
        </Box>
    );
};

export default EditResponsable;