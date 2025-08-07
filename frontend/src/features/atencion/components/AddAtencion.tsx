import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Divider, Skeleton, Stack, Typography, CircularProgress } from '@mui/material';
import { faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertMessage, SkeletonList, BackHeader } from '@common/components';
import { AuthContext } from '@common/context/auth';
import type { AlertSeverity } from '@common/types';
import type { Animal } from '@features/animal';
import { createEmptyAnimal, getAnimalById } from '@features/animal';
import type { Persona } from '@features/persona';
import { createEmptyPersona, getResponsableById } from '@features/persona';
import type { AtencionDTO } from '../types';
import { addAtencion } from '../api';
import ResponsableForm from './ResponsableForm';
import AnimalForm from './AnimalForm';
import AutorizacionForm from './AutorizacionForm';

const AddAtencion = () => {
    const { animalId } = useParams();
    const [firma, setFirma] = useState<string>('');
    const [responsable, setResponsable] = useState<Persona>(() => createEmptyPersona());
    const [autorizado, setAutorizado] = useState<Persona>(() => createEmptyPersona());
    const [animal, setAnimal] = useState<Animal>(() => createEmptyAnimal());
    const [loading, setLoading] = useState<boolean>(true);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMsg, setAlertMsg] = useState<string>('');
    const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>('info');
    const [submitting, setSubmitting] = useState<boolean>(false);
    const { personal, selectedEfectorId } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const animalResp: Animal = await getAnimalById(Number(animalId));
                setAnimal(animalResp);

                const personaResp: Persona = await getResponsableById(Number(animalResp.id_responsable));
                setResponsable(personaResp);
                setAutorizado(personaResp);

                setLoading(false);
            } catch(error) {
                setAlertSeverity('error');
                setAlertMsg('No se pudo cargar la información. Por favor, inténtalo de nuevo más tarde.');
                setAlertOpen(true);
            }
        };

        fetchData();
        // setTimeout(() => {
        //     fetchData();
        // }, 3000);
    }, [animalId]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        
        if (submitting) return;
        setSubmitting(true);
        
        const now = new Date();

        try{ 
            const newAtencion: AtencionDTO = {
                id_efector: Number(selectedEfectorId),
                id_responsable: responsable.id === autorizado.id ? responsable.id : autorizado.id,
                id_domicilio_responsable: responsable.id === autorizado.id ? responsable.id_domicilio_actual : autorizado.id_domicilio_actual,
                id_animal: animal.id,
                id_servicio: 1,
                id_personal: personal!.id,
                fecha_ingreso: now.toISOString().split('T')[0],
                hora_ingreso: now.toTimeString().slice(0, 5),
                firma_ingreso: firma === '' ? null : firma,
                finalizada: 0
            };
                
            await addAtencion(newAtencion);

            setAlertSeverity('success');
            setAlertMsg('Atención agregada con éxito!');
            setAlertOpen(true);

            setTimeout(() => {
                navigate('/atenciones');
            }, 3000); // Timeout para que se muestre la alerta

        } catch(error) {
            setAlertSeverity('error');
            setAlertMsg('No se pudo agregar la atención. Por favor, inténtalo de nuevo más tarde.');
            setAlertOpen(true);
            setSubmitting(false);
        }

    };

    if(loading){
        return (
            <Box sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 4 }}>
                <Skeleton variant='rounded' height={60} />
                <Divider sx={{ mt: 2, mb: 1 }}/>
                <SkeletonList length={10} random={false} />

                <Divider variant='middle' sx={{ mt: 1, mb: 1 }}/>
                <SkeletonList length={10} random={false} />

                <Divider variant='middle' sx={{ mt: 1, mb: 1 }}/>
                <SkeletonList length={2} random={false} />
            </Box>
        );
    }

    return (
        <Box>
            <BackHeader navigateTo = {`/${animal.id_especie === 1 ? 'canino' : 'felino'}/${animalId}`} />
            
            <Box
                component='form'
                onSubmit={handleSubmit}
                sx={{
                    p: 2, 
                    bgcolor: 'background.paper', 
                    boxShadow: 3, 
                    borderRadius: 4,
                    display: 'flex', 
                    flexDirection: 'column',
                    mt: 2
                }}
                noValidate
            >
                <Divider>
                    <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 1 }}>
                        <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                            <FontAwesomeIcon icon={faFileMedical} size='2x' />
                        </Box>

                        <Typography variant='h5'>
                            Nueva atención
                        </Typography>
                    </Stack>
                </Divider>

                <ResponsableForm responsable = {responsable} />

                <AnimalForm animal = {animal} />

                <AutorizacionForm 
                    responsable = {autorizado} 
                    setResponsable = {setAutorizado}
                    setFirma = {setFirma}
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <Button 
                        variant='outlined' 
                        color='error' 
                        onClick={() => navigate(`/${animal.id_especie === 1 ? 'canino' : 'felino'}/${animalId}`)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        disabled={!firma || submitting}
                    >
                        { submitting ? <CircularProgress size={24}  /> : 'Agregar'}
                    </Button>
                </Box>
            </Box>

            <AlertMessage 
                open = {alertOpen}
                handleClose = {() => setAlertOpen(false)}
                message = {alertMsg}
                severity = {alertSeverity}
            />
        </Box>
    );
};

export default AddAtencion;