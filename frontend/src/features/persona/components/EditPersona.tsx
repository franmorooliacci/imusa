import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { Setter, AlertSeverity } from '@common/types';
import type { Persona } from '../types';
import { updatePersona } from '../api';
import { domicilio, contacto } from '../schemas';
import { formatDomicilio, domicilioExists } from '../utils';
import DomicilioForm from './DomicilioForm';
import ContactoForm from './ContactoForm';

type Props = {
    editDomicilio: boolean;
    setEditDomicilio: Setter<boolean>;
    editContacto: boolean;
    setEditContacto: Setter<boolean>;
    existingPersona: Persona;
    setExistingPersona: Setter<Persona>;
    setAlertOpen: Setter<boolean>;
    setAlertMsg: Setter<string>;
    setAlertSeverity: Setter<AlertSeverity>;
};

const EditPersona = (props: Props) => {
    const {
        editDomicilio,
        setEditDomicilio,
        editContacto,
        setEditContacto,
        existingPersona,
        setExistingPersona,
        setAlertOpen,
        setAlertMsg,
        setAlertSeverity
    } = props;
    const nestedContactoSchema = yup.object({ contacto: contacto.required() });
    const nestedDomicilioSchema = yup.object({ domicilio: domicilio.required() });
    const contactoMethods = useForm({
        mode: 'onChange',
        resolver: yupResolver(nestedContactoSchema),
        defaultValues: {
            contacto: { 
                telefono: existingPersona.telefono ?? '', 
                correo: existingPersona.correo ?? '' 
            }
        }
    });
    const { handleSubmit: handleSubmitContacto } = contactoMethods;
    const domicilioMethods = useForm({
        mode: 'onChange',
        resolver: yupResolver(nestedDomicilioSchema),
        defaultValues: {
            domicilio: existingPersona.domicilio_actual ?? {}
        }
    });
    const { handleSubmit: handleSubmitDomicilio } = domicilioMethods;
    const [domicilioDone, setDomicilioDone] = useState<boolean>(false);

    const onSubmitContacto = async (data: Record<string, any>): Promise<void> => {
        try{
            await updatePersona(existingPersona.id, data.contacto);
            
            setExistingPersona((prev) => ({
                ...prev,
                telefono: data.contacto.telefono,
                correo: data.contacto.correo,
            }));

            
            setAlertSeverity('success');
            setAlertMsg('Modificación realizada con éxito!');
            setAlertOpen(true);
            
            setTimeout(() => {
                setEditContacto(false);
            }, 3000); // Timeout para que se muestre la alerta
        } catch(error){
            setAlertSeverity('error');
            setAlertMsg('No se pudo realizar la modificación. Por favor, inténtalo de nuevo más tarde.');
            setAlertOpen(true);
        }
    };

    const onSubmitDomicilio = async (data: Record<string, any>): Promise<void> => {
        try{
            const formattedDomicilio = formatDomicilio(data.domicilio);
            const newDomicilio = await domicilioExists(formattedDomicilio);

            // Actualizo los datos del responsable que voy a mostrar
            setExistingPersona((prev) => ({
                ...prev,
                domicilio_actual: newDomicilio
            }));

            // Actualizo el nuevo domicilio en la db
            await updatePersona(existingPersona.id, { id_domicilio_actual: newDomicilio.id });

            setAlertSeverity('success');
            setAlertMsg('Modificación realizada con éxito!');
            setAlertOpen(true);
            
            setTimeout(() => {
                setEditDomicilio(false);
            }, 3000); // Timeout para que se muestre la alerta

        } catch(error){
            setAlertSeverity('error');
            setAlertMsg('No se pudo realizar la modificación. Por favor, inténtalo de nuevo más tarde.');
            setAlertOpen(true);
        }
    };

    return (
        <Box>
            {editContacto && (
                <FormProvider {...contactoMethods}>
                    <Box>
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
                                variant='contained' 
                                color='primary'
                                size='small'
                                onClick={handleSubmitContacto(onSubmitContacto)}
                            >
                                Guardar
                            </Button>
                        </Box>
                    </Box>
                </FormProvider>
            )}

            {editDomicilio && (
                <FormProvider {...domicilioMethods}>
                    <Box>
                        <DomicilioForm 
                            name = {'domicilio'} 
                            title = {'Domicilio'} 
                            setDomicilioDone = {setDomicilioDone} 
                            setAlertOpen = {setAlertOpen}
                            setAlertMsg = {setAlertMsg}
                            setAlertSeverity = {setAlertSeverity}    
                        />
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
                                variant='contained' 
                                color='primary'
                                size='small'
                                disabled={!domicilioDone}
                                onClick={handleSubmitDomicilio(onSubmitDomicilio)}
                            >
                                Guardar
                            </Button>
                        </Box>
                    </Box>
                </FormProvider>
            )}
        </Box>
    );
};

export default EditPersona;