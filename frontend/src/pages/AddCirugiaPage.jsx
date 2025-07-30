import { faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Divider, Skeleton, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addCirugia, getAnimalById, getPersonaById, getTiposCirugia } from '../services/api';
import { CircularProgress } from '@mui/material';
import ResponsableDetailsForm from '../components/ResponsableDetailsForm';
import AnimalDetailsForm from '../components/AnimalDetailsForm';
import AlertMessage from '../components/AlertMessage';
import SkeletonList from '../components/SkeletonList';
import AuthContext from '../context/AuthContext';
import BackHeader from '../components/BackHeader';
import FirmaForm from '../components/FirmaForm';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import SearchPage from './SearchPage';

const AddCirugiaPage = () => {
    const { responsableId, animalId } = useParams();
    const [formData, setFormData] = useState({
        cirugia: {
            firma_ingreso: '',
            id_tipo_cirugia: '',
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
    const [tipoAtencion, setTipoAtencion] = useState(''); // 🔥 NUEVO: por defecto es cirugía
    const [tiposCirugia, setTiposCirugia] = useState([]); 
    const [changeResp, setChangeResp] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        const fetchResponsable = async () => {
            try{
                const response = await getPersonaById(responsableId);
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


    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const tipos = await getTiposCirugia();
                setTiposCirugia(tipos);
            } catch (error) {

            }
        };

        fetchTipos();
    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (submitting) return;
        setSubmitting(true);

        const now = new Date();

        try{ 
            const newCirugia = {
                id_efector: selectedEfectorId,
                id_responsable: formData.responsable.id,
                id_responsable_atencion: formData.responsable.id,
                id_domicilio_responsable: formData.responsable.id_domicilio_actual,
                id_animal: formData.animal.id,
                id_personal: personal.id,
                fecha: now.toISOString().split('T')[0],
                hora_ingreso: now.toTimeString().slice(0, 5),
                firma_ingreso: formData.cirugia.firma_ingreso === '' ? null : formData.cirugia.firma_ingreso,
                id_tipo_cirugia: formData.cirugia.id_tipo_cirugia,
                finalizada: 0
            };
            console.log(newCirugia)
            await addCirugia(newCirugia);

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
        changeResp ? (
            <SearchPage
            Transfer = {{}}
            cirugia = {formData}
            /> ) : (
    
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

               <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        onClick={() => setChangeResp(true)}
                        >
                            Cambiar responsable
                </Button>
                <AnimalDetailsForm formData = {formData} />
                


    <>
        <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="tipo-cirugia-label">Tipo de cirugía</InputLabel>
            <Select
                labelId="tipo-cirugia-label"
                id="tipo-cirugia"
                value={formData.cirugia?.id_tipo_cirugia || ''}
                label="Tipo de cirugía"
                onChange={(e) =>
                    setFormData(prev => ({
                        ...prev,
                        cirugia: {
                            ...prev.cirugia,
                            id_tipo_cirugia: e.target.value
                        }
                    }))
                }
            >
                {tiposCirugia.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>

        <FirmaForm
            onChange={(base64) =>
                setFormData(prev => ({
                    ...prev,
                    cirugia: {
                        ...prev.cirugia,
                        firma_ingreso: base64
                    }
                }))
            }
        />
    </>


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
                            disabled={!formData.cirugia.firma_ingreso|| !formData.cirugia.id_tipo_cirugia || submitting}
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
    )
);

}


export default AddCirugiaPage;