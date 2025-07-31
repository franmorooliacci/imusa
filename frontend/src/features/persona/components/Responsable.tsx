import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Divider, Grid2, IconButton, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faDog, faEye, faFileArrowDown, faPaperPlane, faPrint, faStethoscope, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { SkeletonList, AlertMessage, GenericTable } from '@common/components';
import type { AlertSeverity, Column } from '@common/types';
import { formatDate } from '@common/utils';
import type { Animal } from '@features/animal';
import { AnimalForm, createEmptyAnimal } from '@features/animal';
import type { Atencion } from '@features/atencion';
import { getAtenciones, sortAtencionesAsc, downloadAtencion, sendInformeEmail, printAtencion } from '@features/atencion';
import type { Persona } from '../types';
import { getResponsableById } from '../api';
import { createEmptyPersona, domicilioToString } from '../utils';

const ResponsablePage = () => {
    const { id } = useParams();
    const [responsable, setResponsable] = useState<Persona>(() => createEmptyPersona());
    const [addingAnimal, setAddingAnimal] = useState<boolean>(false);
    const [especie, setEspecie] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [atenciones, setAtenciones] = useState<Atencion[]>([]);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMsg, setAlertMsg] = useState<string>('');
    const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>('info');
    const navigate = useNavigate();

    const visibleAtenciones: Atencion[] = atenciones.filter(a => a.finalizada === 1);
    const sortedAtenciones: Atencion[] = sortAtencionesAsc(visibleAtenciones).reverse();

    useEffect(() => {
        const fetchResponsable = async () => {
            try {
                const data: Persona = await getResponsableById(Number(id));
                setResponsable(data);
            } catch (error) {
                console.error('Error fetching responsable details:', error);
            }
        };

        const fetchAtenciones = async () => {
            try {
                const params: Record<string, any> = {id_responsable: id};
                const data: Atencion[] = await getAtenciones(params);
                setAtenciones(data);
            } catch (error) {
            }
        }

        const fetchData = async () => {
            await Promise.all([fetchResponsable(), fetchAtenciones()]);
            setLoading(false);
        };
    
        fetchData();
        // setTimeout(() => {
        //     fetchData();
        // }, 3000);
    }, [id]);

    const handleDownload = useCallback(async (id_atencion: number): Promise<void> => {
        try {
            await downloadAtencion(id_atencion);

            setAlertSeverity('success');
            setAlertMsg('Se ha descargado el informe con éxito!');
            setAlertOpen(true);
        } catch (error: any) {
            console.error('Download failed', error);
            setAlertSeverity('error');
            setAlertMsg('No se ha podido descargar el informe.');
            setAlertOpen(true);
        }
    }, []);

    const handleSendInformeEmail = useCallback(async (id_atencion: number): Promise<void> => {
        if (!responsable.mail) {
            setAlertSeverity('warning');
            setAlertMsg(`La persona no tiene asociada una dirección de correo.`);
            setAlertOpen(true);
            return;
        }
        
        try {
            await sendInformeEmail({ id_atencion: id_atencion, to_emails: [responsable.mail] });

            setAlertSeverity('success');
            setAlertMsg('Se ha enviado el informe con éxito!');
            setAlertOpen(true);
        } catch (error) {
            setAlertSeverity('error');
            setAlertMsg('No se ha podido enviar el informe.');
            setAlertOpen(true);
        }
    },[responsable.mail]);

    const caninoColumns = useMemo<Column<Animal>[]>(() => [
        { id: 'nombre', label: 'Nombre' },
        { id: 'sexo',   label: 'Sexo' },
        { id: 'edad',   label: 'Edad' },
        { id: 'raza',   label: 'Raza' },
        {
            id: 'detalles',
            label: 'Detalles',
            render: (_value, animal) => (
                <IconButton
                    color='primary'
                    onClick={() =>
                        navigate(`/responsable/${animal.id_responsable}/canino/${animal.id}`)
                    }
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.08)',
                            transform: 'scale(1.1)',
                            transition: 'transform 0.2s',
                        },
                    }}
                >
                    <FontAwesomeIcon icon={faEye} />
                </IconButton>
            ),
        },
    ], [navigate]);

    const felinoColumns = useMemo<Column<Animal>[]>(() => [
        { id: 'nombre', label: 'Nombre' },
        { id: 'sexo',   label: 'Sexo' },
        { id: 'edad',   label: 'Edad' },
        { id: 'raza',   label: 'Raza' },
        {
            id: 'detalles',
            label: 'Detalles',
            render: (_value, animal) => (
                <IconButton
                    color='primary'
                    onClick={() =>
                        navigate(`/responsable/${animal.id_responsable}/felino/${animal.id}`)
                    }
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.08)',
                            transform: 'scale(1.1)',
                            transition: 'transform 0.2s',
                        },
                    }}
                >
                    <FontAwesomeIcon icon={faEye} />
                </IconButton>
            ),
        },
    ], [navigate]);

    const atencionColumns = useMemo<Column<Atencion>[]>(() => [
        {
            id: 'especie',
            label: 'Especie',
            render: (_value, atencion) => (
                <FontAwesomeIcon icon={atencion.animal.id_especie === 1 ? faDog : faCat} size='2x' />
            ),
        },
        {
            id: 'nombre',
            label: 'Nombre',
            render: (_value, atencion) => atencion.animal.nombre,
        },
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
                    <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 4 }} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 4, boxShadow: 3, flexGrow: 1 }}>
                        <Skeleton variant='rounded' height={60} />
                        <Divider sx={{ mt: 2, mb: 2 }}/>
                        <SkeletonList length={10} random={true} />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 4, boxShadow: 3, flexGrow: 1 }}>
                        <Skeleton variant='rounded' height={60} />
                        <Divider sx={{ mt: 2, mb: 2 }}/>
                        <SkeletonList length={5} random={false} />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 4, boxShadow: 3, flexGrow: 1 }}>
                        <Skeleton variant='rounded' height={60} />
                        <Divider sx={{ mt: 2, mb: 2 }}/>
                        <SkeletonList length={5} random={false} />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 4, boxShadow: 3, flexGrow: 1 }}>
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
            {addingAnimal ? (
                <AnimalForm
                    mode = {'add'} 
                    initialData = { createEmptyAnimal(especie === 'canino' ? 1 : 2, Number(id)) }
                    onSuccess = {(path: string) => navigate(path)} 
                    onCancel = {() => { setEspecie(''); setAddingAnimal(false)}}
                />
            ) : (
                <Grid2 container spacing={2} sx={{ width: '100%' }}>
                    <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 4 }} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 4, boxShadow: 3, flexGrow: 1 }}>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                                <FontAwesomeIcon icon={faUser} size='2x' />
                            </Box>

                            <Typography variant='h5'>
                                Información Personal
                            </Typography>
                        </Box>

                        <Divider sx={{ mt: 2, mb: 2}} />
                        
                        <Stack spacing={0.5}>
                            <Typography variant='body1'>
                                <strong>Nombre:</strong>{' '}{responsable.nombre}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>Apellido:</strong>{' '}{responsable.apellido}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>DNI:</strong>{' '}
                                {responsable.dni}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>Sexo:</strong>{' '}
                                {responsable.sexo === 'M' ? 'Masculino' : 'Femenino'}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>Edad:</strong>{' '}
                                {responsable.edad}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>Fecha de Nacimiento:</strong>{' '}
                                {formatDate(responsable.fecha_nacimiento)}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>
                                    Domicilio:
                                </strong>
                                {` ${domicilioToString(responsable.domicilio_actual)}`}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>Correo:</strong>{' '}
                                {responsable.mail || ' - '}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>Telefono:</strong>{' '}
                                {responsable.telefono}
                            </Typography>
                        </Stack>
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 4, boxShadow: 3, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}> 
                                <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                                    <FontAwesomeIcon icon={faDog} size='2x' />
                                </Box>

                                <Typography variant='h5'>
                                    {'Caninos'}
                                </Typography>
                            </Box>

                            <Button 
                                size='small' 
                                variant='outlined' 
                                color='primary' 
                                onClick={() => {setEspecie('canino'); setAddingAnimal(true);}}
                            >
                                Agregar
                            </Button>
                        </Box>

                        {responsable.caninos.length > 0 &&
                            <Box>
                                <Divider sx={{ mt: 2, mb: 2}} />
                                <GenericTable<Animal>
                                    data={responsable.caninos}
                                    getRowKey={row => row.id}
                                    columns={caninoColumns}
                                />
                            </Box>
                        }
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 4, boxShadow: 3, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}> 
                                <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                                    <FontAwesomeIcon icon={faCat} size='2x' />
                                </Box>

                                <Typography variant='h5'>
                                    {'Felinos'}
                                </Typography>
                            </Box>

                            <Button 
                                size='small' 
                                variant='outlined' 
                                color='primary' 
                                onClick={() => {setEspecie('felino'); setAddingAnimal(true);}}
                            >
                                Agregar
                            </Button>
                        </Box>

                        {responsable.felinos.length > 0 &&
                            <Box>
                                <Divider sx={{ mt: 2, mb: 2}} />
                                <GenericTable<Animal>
                                    data={responsable.felinos}
                                    getRowKey={row => row.id}
                                    columns={felinoColumns}
                                />
                            </Box>
                        }
                    </Grid2>

                    {visibleAtenciones.length > 0 &&
                        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ bgcolor: 'background.paper', p: 2, boxShadow: 3, borderRadius: 4, flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                                    <FontAwesomeIcon icon={faStethoscope} size='2x' />
                                </Box>                            
                                <Typography variant='h5'>
                                    Atenciones
                                </Typography>
                            </Box>

                            <Divider sx={{ mt: 2, mb: 2 }} />

                            <GenericTable<Atencion>
                                data={sortedAtenciones}
                                getRowKey={row => row.id}
                                columns={atencionColumns}
                            />
                        </Grid2>
                    }
                </Grid2>
            )}

            <AlertMessage
                open = {alertOpen}
                handleClose = {() => setAlertOpen(false)}
                message = {alertMsg}
                severity = {alertSeverity}
            />
        </Box>
    );
}

export default ResponsablePage;
