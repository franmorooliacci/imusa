import { faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Divider, Skeleton, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addAtencion, getAnimalById, getResponsableById } from '../services/api';
import { CircularProgress } from '@mui/material';
import ResponsableDetailsForm from '../components/ResponsableDetailsForm';
import AnimalDetailsForm from '../components/AnimalDetailsForm';
import AlertMessage from '../components/AlertMessage';
import SkeletonList from '../components/SkeletonList';
import AuthContext from '../context/AuthContext';
import BackHeader from '../components/BackHeader';
import FirmaForm from '../components/FirmaForm';

const AddAtencionPage = () => {
    const { responsableId, animalId } = useParams();
    const [formData, setFormData] = useState({
        atencion: {
            firma_ingreso: ''
        },
        responsable: {},
        animal: {}
    });
    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const { personal, selectedEfectorId } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchResponsable = async () => {
            try{
                const response = await getResponsableById(responsableId);
                setFormData(prev => ({
                    ...prev,
                    responsable: response
                }));

            } catch(error){

            }
        };

        const fetchAnimal = async () => {
            try{
                const response = await getAnimalById(animalId);
                setFormData(prev => ({
                    ...prev,
                    animal: response
                }));

            } catch(error){

            }
        };

        const fetchData = async () => {
            await Promise.all([fetchResponsable(), fetchAnimal()]);
            setLoading(false);
        };

        fetchData();
        // setTimeout(() => {
        //     fetchData();
        // }, 3000);
    }, [responsableId, animalId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (submitting) return;
        setSubmitting(true);

        const now = new Date();

        try{ 
            const newAtencion = {
                id_efector: selectedEfectorId,
                id_responsable: formData.responsable.id,
                id_domicilio_responsable: formData.responsable.id_domicilio_actual,
                id_animal: formData.animal.id,
                id_servicio: 1,
                id_personal: personal.id,
                fecha_ingreso: now.toISOString().split('T')[0],
                hora_ingreso: now.toTimeString().slice(0, 5),
                firma_ingreso: formData.atencion.firma_ingreso === '' ? null : formData.atencion.firma_ingreso,
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
            setAlertMsg('No se ha podido agregar la atención.');
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
    };

    return (
        <Box>
            <BackHeader navigateTo = {`/responsable/${responsableId}/${formData.animal.id_especie === 1 ? 'canino' : 'felino'}/${animalId}`} />
            
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
                        <FontAwesomeIcon icon={faFileMedical} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />

                        <Typography variant='h5'>
                            Nueva atención
                        </Typography>
                    </Stack>
                </Divider>

                <ResponsableDetailsForm formData = {formData} />

                <AnimalDetailsForm formData = {formData} />

                <FirmaForm
                    onChange={(base64) =>
                        setFormData(prev => ({
                            ...prev,
                            atencion: {
                                ...prev.atencion,
                                firma_ingreso: base64
                            }
                        }))
                    }
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <Button 
                        variant='outlined' 
                        color='error' 
                        onClick={() => navigate(`/responsable/${responsableId}/${formData.animal.id_especie === 1 ? 'canino' : 'felino'}/${animalId}`)}
                    >
                        Cancelar
                    </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!formData.atencion.firma_ingreso || submitting}
                        >
                         { submitting ? <CircularProgress size={24}  /> : 'Finalizar'}
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

export default AddAtencionPage;