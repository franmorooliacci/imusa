import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography, Button, Box, Divider, Grid2, Skeleton, Stack, Tooltip, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faDog, faEye, faFileArrowDown, faPaperPlane, faPrint, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import { SkeletonList, GenericTable, BackHeader, AlertMessage } from '@common/components';
import type { AlertSeverity, Column } from '@common/types';
import { formatDate } from '@common/utils';
import { getResponsableById } from '@features/persona';
import type { Atencion } from '@features/atencion';
import { downloadAtencion, getAtenciones, printAtencion, sendInformeEmail, sortAtencionesAsc } from '@features/atencion';
import type { Animal as AnimalType } from '../types';
import { createEmptyAnimal } from '../utils/create-empty-animal';
import { getAnimalById } from '../api';
import AnimalForm from './AnimalForm';

const Animal = () => {
    const { especie, animalId } = useParams();
    const [animal, setAnimal] = useState<AnimalType>(() => createEmptyAnimal());
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [atenciones, setAtenciones] = useState<Atencion[]>([]);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMsg, setAlertMsg] = useState<string>('');
    const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>('info');
    const navigate = useNavigate();

    const visibleAtenciones: Atencion[] = atenciones.filter(a => a.finalizada === 1);
    const sortedAtenciones: Atencion[] = sortAtencionesAsc(visibleAtenciones).reverse();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [animalList, atencionesList] = await Promise.all([getAnimalById(Number(animalId)), getAtenciones({ id_animal: animalId })]);
                setAnimal(animalList);
                setAtenciones(atencionesList);
            } catch (error) {
                setAlertSeverity('error');
                setAlertMsg('No se pudo cargar la información. Por favor, inténtalo de nuevo más tarde.');
                setAlertOpen(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // setTimeout(() => {
        //     fetchData();
        // }, 3000);
    }, [animalId, especie]);

    const handleAddAtencion = (): void => {
        if(animal.fallecido === 1) {
            setAlertSeverity('warning');
            setAlertMsg('No se le puede agregar una atención a un animal fallecido.');
            setAlertOpen(true);
            return;
        }

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
            navigate(`/atencion/agregar/${animalId}`);
        }
    };

    const handleDownload = useCallback(async (id_atencion: number): Promise<void> => {
        try {
            await downloadAtencion(id_atencion);

            setAlertSeverity('success');
            setAlertMsg('Se ha descargado el informe con éxito!');
            setAlertOpen(true);
        } catch (error: any) {
            console.error('Download failed', error);
            setAlertSeverity('error');
            setAlertMsg('No se pudo descargar el informe. Por favor, inténtalo de nuevo más tarde.');
            setAlertOpen(true);
        }
    }, []);
    
    const handleSendInformeEmail = useCallback(async (id_atencion: number): Promise<void> => {
        try {
            const response = await getResponsableById(Number(animal.id_responsable));
            const email = response.correo;

            if (!email) {
                setAlertSeverity('warning');
                setAlertMsg(`La persona no tiene asociada una dirección de correo.`);
                setAlertOpen(true);
                return;
            }

            await sendInformeEmail({ id_atencion: id_atencion, to_emails: [email] });

            setAlertSeverity('success');
            setAlertMsg('Se ha enviado el informe con éxito!');
            setAlertOpen(true);
        } catch (error) {
            setAlertSeverity('error');
            setAlertMsg('No se pudo enviar el informe. Por favor, inténtalo de nuevo más tarde.');
            setAlertOpen(true);
        }
    }, [animal.id_responsable]);

    const atencionColumns = useMemo<Column<Atencion>[]>(() => [
        { 
            id: 'fecha_ingreso',
            label: 'Fecha',
            render: (value) => formatDate(value),
        },
        {
            id: 'hora_ingreso',
            label: 'Hora',
            render: (value) => value.slice(0, 5),
        },
        {
            id: 'efector_nombre',
            label: 'Efector',
        },
        {
            id: 'servicio',
            label: 'Servicio',
            render: () => 'Esterilización',
        },
        {
            id: 'personal_nombre',
            label: 'Profesional',
        },
        {
            id: 'acciones',
            label: 'Acciones',
            align: 'center',
            render: (_v, atencion) => (
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Tooltip title='Ver' arrow>
                        <IconButton
                            color='primary'
                            onClick={() => navigate(`/atencion/${atencion.id}`)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    transform: 'scale(1.1)',
                                    transition: 'transform 0.2s',
                                },
                            }}
                        >
                            <FontAwesomeIcon icon={faEye} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title='Enviar por correo' arrow>
                        <IconButton
                            color='success'
                            onClick={() => handleSendInformeEmail(atencion.id)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    transform: 'scale(1.1)',
                                    transition: 'transform 0.2s',
                                },
                            }}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} size='1x' />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title='Descargar' arrow>
                        <IconButton
                            color='success'
                            onClick={() => handleDownload(atencion.id)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    transform: 'scale(1.1)',
                                    transition: 'transform 0.2s',
                                },
                            }}
                        >
                            <FontAwesomeIcon icon={faFileArrowDown} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title='Imprimir' arrow>
                        <IconButton
                            color='success'
                            onClick={() => printAtencion(atencion.id)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    transform: 'scale(1.1)',
                                    transition: 'transform 0.2s',
                                },
                            }}
                        >
                            <FontAwesomeIcon icon={faPrint} size='1x' />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ], [navigate, handleDownload, handleSendInformeEmail, printAtencion]);

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
    }

    return (
        <Box>
            {editMode ? (
                <AnimalForm
                    mode = {'edit'}
                    initialData = {animal}
                    onSuccess = {(updatedAnimal: AnimalType) => {setAnimal(updatedAnimal); setEditMode(false)}}
                    onCancel = {() => setEditMode(false)}
                />
            ) : (
                <Grid2 container spacing={2} sx={{ width: '100%' }}>
                    <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                        <BackHeader navigateTo = {`/responsable/${animal.id_responsable}`} />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }} sx={{ bgcolor: 'background.paper', p: 2, boxShadow: 3, borderRadius: 4, flexGrow: 1 }}>    
                        

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                                    <FontAwesomeIcon icon={animal.id_especie === 1 ? faDog : faCat} size='2x' />
                                </Box>

                                <Typography variant='h5'>
                                    {animal.nombre}
                                </Typography>
                            </Box>

                            <Button 
                                size='small' 
                                variant='outlined' 
                                color='primary' 
                                onClick={() => {
                                    if(animal.fallecido === 1) {
                                        setAlertSeverity('warning');
                                        setAlertMsg('No se puede editar la información de un animal fallecido.');
                                        setAlertOpen(true);
                                        return;
                                    } else {
                                        setEditMode(true);
                                    }
                                }}
                            >
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

                            <Typography variant='body1'>
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
                                    <strong>Fallecido:</strong> {'Si'}
                                </Typography>
                            }
                        </Stack>
                    </Grid2>  
                    <Grid2 size={{ xs: 12, sm: 12, md: 8, lg: 8 }} sx={{ bgcolor: 'background.paper', p: 2, boxShadow: 3, borderRadius: 4, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                                    <FontAwesomeIcon icon={faStethoscope} size='2x' />
                                </Box>
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
                                <GenericTable<Atencion>
                                    data={sortedAtenciones}
                                    getRowKey={row => row.id}
                                    columns={atencionColumns}
                                />
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

export default Animal;
