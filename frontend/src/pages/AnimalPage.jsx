import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimalById, getAtenciones } from '../services/api';
import { Typography, Button, Box, Divider, Grid2, Skeleton, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faDog, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import SkeletonList from '../components/SkeletonList';
import AtencionTable from '../components/AtencionTable';
import AnimalForm from '../components/AnimalForm';
import BackHeader from '../components/BackHeader';
import AlertMessage from '../components/AlertMessage';

const AnimalPage = () => {
    const { especie, animalId, responsableId } = useParams();
    const [animal, setAnimal] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [atenciones, setAtenciones] = useState([]);
    const visibleAtenciones = atenciones.filter(a => a.finalizada === 1);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [animalList, atencionesList] = await Promise.all([getAnimalById(animalId), getAtenciones({ id_animal: animalId })]);
                setAnimal(animalList);
                setAtenciones(atencionesList);
            } catch (error) {

            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // setTimeout(() => {
        //     fetchData();
        // }, 3000);
    }, [animalId, responsableId, especie]);

    // const handleDelete = async () => {
    //     try {
    //         await deleteAnimal(animalId);

    //         // Setea las variables de la alerta
    //         setAlertSuccess(true);
    //         setAlertMsg(`${animal.id_especie === 1 ? 'Canino' : 'Felino'} eliminado con éxito!`);
    //         setAlertOpen(true);

    //         setTimeout(() => {
    //             navigate(`/responsable/${responsableId}`);
    //         }, 1000);
    //     } catch (error) {
    //         // Setea las variables de la alerta
    //         setAlertSuccess(false);
    //         setAlertMsg(`No se ha podido eliminar ${animal.id_especie === 1 ? 'Canino' : 'Felino'}.`);
    //         setAlertOpen(true);
    //     }
    // };

    const handleAddAtencion = () => {
        // Busca si el animal tiene alguna atencion en curso
        const ongoing = atenciones.find(a => a.finalizada === 0);

        if (ongoing) {
            // true, muestra la alerta
            setAlertSeverity('warning');
            setAlertMsg(
                `${animal.nombre} tiene una atención en curso en el efector ${ongoing.efector_nombre}. ` +
                'Debe finalizarla antes de agregar otra.'
            );
            setAlertOpen(true);
        } else {
            // false, redirige a la pagina de atenciones
            navigate(`/atencion/agregar/${responsableId}/${animalId}`);
        }
    };

    if (loading) {
        return (
            <Box>
                <Grid2 container spacing={2} sx={{ width: '100%' }}>
                    <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }} sx={{ bgcolor: 'background.paper', p: 2, boxShadow: 3, borderRadius: 4, flexGrow: 1 }}>
                        <Skeleton variant='rounded' height={60} />
                        <Divider sx={{ mt: 2, mb: 2 }}/>
                        <SkeletonList length={5} random={true} />
                    </Grid2>
                
                    <Grid2 size={{ xs: 12, sm: 12, md: 8, lg: 8 }} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 4, boxShadow: 3, flexGrow: 1 }}>
                        <Skeleton variant='rounded' height={60} />
                        <Divider sx={{ mt: 2, mb: 2 }}/>
                        <SkeletonList length={5} random={false} />
                    </Grid2>
                </Grid2>
            </Box>
        );
    };

    return (
        <Box>
            {editMode ? (
                <AnimalForm
                    mode = {'edit'}
                    initialData = {animal}
                    onSuccess = {(updatedAnimal) => {setAnimal(updatedAnimal); setEditMode(false)}}
                    onCancel = {() => setEditMode(false)}
                />
            ) : (
                <Grid2 container spacing={2} sx={{ width: '100%' }}>
                    <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                        <BackHeader navigateTo = {`/responsable/${responsableId}`} />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }} sx={{ bgcolor: 'background.paper', p: 2, boxShadow: 3, borderRadius: 4, flexGrow: 1 }}>    
                        

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <FontAwesomeIcon icon={animal.id_especie === 1 ? faDog : faCat} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />
                                
                                <Typography variant='h5'>
                                    {animal.nombre}
                                </Typography>
                            </Box>

                            <Button size='small' variant='outlined' color='primary' onClick={() => setEditMode(true)}>
                                Editar
                            </Button>
                        </Box>

                        <Divider sx={{ mt: 2, mb: 2 }} />

                        <Stack spacing={0.5}>
                            <Typography variant='body1'>
                                <strong>Sexo:</strong> {animal.sexo === 'M' ? 'Macho' : 'Hembra'}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>Edad:</strong> {animal.edad}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>Especie:</strong> {animal.id_especie === 1 ? 'Canino' : 'Felino'}
                            </Typography>
                            
                            <Typography variant='body1'>
                                <strong>Raza:</strong> {animal.raza}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>Tamaño:</strong> {animal.tamaño}
                            </Typography>

                            <Typography variant="body1">
                                <strong>Pelaje:</strong> {animal.colores?.map(c => c.nombre).join(', ') || 'No especificado'}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>Esterilizado:</strong> {animal.esterilizado === 1 ? 'Si' : 'No'}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>Adoptado en IMuSA:</strong> {animal.adoptado_imusa === 1 ? 'Si' : 'No'}
                            </Typography>

                            {animal.fallecido === 1 &&
                                <Typography variant='body1'>
                                    <strong>Fallecido:</strong> {'SI'}
                                </Typography>
                            }
                        </Stack>
                    </Grid2>  
                    <Grid2 size={{ xs: 12, sm: 12, md: 8, lg: 8 }} sx={{ bgcolor: 'background.paper', p: 2, boxShadow: 3, borderRadius: 4, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <FontAwesomeIcon icon={faStethoscope} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />
                                
                                <Typography variant='h5'>
                                    Atenciones
                                </Typography>
                            </Box>

                            <Button size='small' variant='outlined' color='primary' onClick={() => handleAddAtencion()}>
                                Agregar
                            </Button>
                        </Box>

                        {visibleAtenciones.length > 0 &&
                            <Box>
                                <Divider sx={{ mt: 2, mb: 2 }} />
                                <AtencionTable atenciones={visibleAtenciones} animalDetails={false} />
                            </Box>
                        }
                    </Grid2>
                </Grid2>
            )}

            <AlertMessage
                open={alertOpen}
                handleClose={() => setAlertOpen(false)}
                message={alertMsg}
                severity={alertSeverity}
            />
        </Box>
    );
};

export default AnimalPage;
