import { faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Divider, Skeleton, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addAtencion, getAnimalById, getResponsableById } from '../services/api';
import ResponsableDetailsForm from '../components/ResponsableDetailsForm';
import AnimalDetailsForm from '../components/AnimalDetailsForm';
import AlertMessage from '../components/AlertMessage';
import SkeletonList from '../components/SkeletonList';
import AuthContext from '../context/AuthContext';
import BackHeader from '../components/BackHeader';

const AddAtencionPage = () => {
    const { responsableId, animalId } = useParams();
    const [formData, setFormData] = useState({
        atencion: {
            señas_particulares: '',
            observaciones_animal: ''
        },
        responsable: {},
        animal: {}
    });
    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertSuccess, setAlertSuccess] = useState(false);
    const { profesional, selectedEfectorId } = useContext(AuthContext);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const now = new Date();

        try{ 
            const newAtencion = {
                id_efector: selectedEfectorId,
                id_responsable: formData.responsable.id_responsable,
                id_domicilio_responsable: formData.responsable.id_domicilio_actual,
                id_animal: formData.animal.id_animal,
                id_servicio: 1,
                id_profesional: profesional.id_profesional,
                señas_particulares: formData.atencion.señas_particulares === '' ? null : formData.atencion.señas_particulares,
                observaciones_animal: formData.atencion.observaciones_animal === '' ? null : formData.atencion.observaciones_animal,
                fecha_ingreso: now.toISOString().split('T')[0],
                hora_ingreso: now.toTimeString().slice(0, 5),
                fecha_egreso: null,
                hora_egreso: null,
                estado_sanitario_egreso: null,
                observaciones_atencion: null,
                estado: 0
            };
                
            await addAtencion(newAtencion);

            setAlertSuccess(true);
            setAlertMsg('Atención agregada con éxito!');
            setAlertOpen(true);

            setTimeout(() => {
                navigate('/atenciones');
            }, 3000); // Timeout para que se muestre la alerta

        } catch(error) {
            setAlertSuccess(false);
            setAlertMsg('No se ha podido agregar la atención.');
            setAlertOpen(true);
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

                <AnimalDetailsForm formData = {formData} onChange = {handleChange} readOnly={false} />

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button 
                        variant='outlined' 
                        color='error' 
                        onClick={() => navigate(`/responsable/${responsableId}/${formData.animal.id_especie === 1 ? 'canino' : 'felino'}/${animalId}`)}
                    >
                        Cancelar
                    </Button>
                    <Button type='submit' variant='contained' color='primary'>
                            Agregar
                    </Button>
                </Box>
            </Box>

            <AlertMessage 
                open = {alertOpen}
                handleClose = {handleCloseAlert}
                message = {alertMsg}
                success = {alertSuccess}
            />
        </Box>
    );
};

export default AddAtencionPage;