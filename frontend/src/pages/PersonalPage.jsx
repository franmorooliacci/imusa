import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPersonaById, getCirugias, sendInformeEmail, getConsultas } from '../services/api';
import { Box, Button, Divider, Grid2, Skeleton, Stack, Typography } from '@mui/material';
import AnimalTable from '../components/AnimalTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faDog, faStethoscope, faUser } from '@fortawesome/free-solid-svg-icons';
import SkeletonList from '../components/SkeletonList';
import AtencionTable from '../components/AtencionTable';
import AnimalForm from '../components/AnimalForm';
import AlertMessage from '../components/AlertMessage';

const UsuarioPage = () => {
    const { id } = useParams();
    const [persona, setPersona] = useState(null);
    const [addingAnimal, setAddingAnimal] = useState(false);
    const [especie, setEspecie] = useState('');
    const [loading, setLoading] = useState(true);
    const [atenciones, setAtenciones] = useState([]);
    const visibleAtenciones = atenciones.filter(a => a.finalizada === 1);
    const navigate = useNavigate();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');

    useEffect(() => {
        const fetchPersona = async () => {
            try {
                const data = await getPersonaById(id);
                setPersona(data);
            } catch (error) {
                console.error('Error fetching usuario details:', error);
            }
        };


        const fetchData = async () => {
            await Promise.all([fetchPersona()]);
            setLoading(false);
        };
    
        fetchData();
        // setTimeout(() => {
        //     fetchData();
        // }, 3000);
    }, [id]);

    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleSendInformeEmail = async (id_cirugia) => {
        if (!responsable.mail) {
            setAlertSeverity('warning');
            setAlertMsg(`La persona no tiene asociada una dirección de correo.`);
            setAlertOpen(true);
            return;
        }
        
        try {
            await sendInformeEmail({ id_cirugia: id_cirugia, to_emails: [responsable.mail] });

            setAlertSeverity('success');
            setAlertMsg('Se ha enviado el informe con éxito!');
            setAlertOpen(true);
        } catch (error) {
            setAlertSeverity('error');
            setAlertMsg('No se ha podido enviar el informe.');
            setAlertOpen(true);
        }
    };

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
    };

    return (
        <Box>
            {addingAnimal ? (
                <AnimalForm
                    mode = {'add'} 
                    initialData = {{ id_especie: especie === 'canino' ? 1 : 2, id_responsable: id }}
                    onSuccess = {(path) => navigate(path)} 
                    onCancel = {() => { setEspecie(''); setAddingAnimal(false)}}
                />
            ) : (
                <Grid2 container spacing={2} sx={{ width: '100%' }}>
                    <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 4 }} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 4, boxShadow: 3, flexGrow: 1 }}>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <FontAwesomeIcon icon={faUser} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />
                            
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
                                    Dirección:
                                </strong>
                                {` ${responsable.domicilio_actual.calle} ${responsable.domicilio_actual.altura}
                                ${responsable.domicilio_actual.bis === 0 ? '' : ' BIS'}
                                ${responsable.domicilio_actual.letra ? ` ${responsable.domicilio_actual.letra}` : ''}
                                ${responsable.domicilio_actual.piso ? ` ${responsable.domicilio_actual.piso}` : ''}
                                ${responsable.domicilio_actual.depto ? ` ${responsable.domicilio_actual.depto}` : ''}
                                ${responsable.domicilio_actual.monoblock ? ` ${responsable.domicilio_actual.monoblock}` : ''}`}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>
                                    Localidad:
                                </strong>
                                {` ${responsable.domicilio_actual.localidad}`}
                            </Typography>

                            <Typography variant='body1'>
                                <strong>Mail:</strong>{' '}
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
                                <FontAwesomeIcon icon={faDog} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />

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
                                <AnimalTable animalList={responsable.caninos} />
                            </Box>
                        }
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 4, boxShadow: 3, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}> 
                                <FontAwesomeIcon icon={faCat} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />

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
                                <AnimalTable animalList={responsable.felinos} />
                            </Box>
                        }
                    </Grid2>

                    {visibleAtenciones.length > 0 &&
                        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ bgcolor: 'background.paper', p: 2, boxShadow: 3, borderRadius: 4, flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <FontAwesomeIcon icon={faStethoscope} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />
                                
                                <Typography variant='h5'>
                                    Atenciones
                                </Typography>
                            </Box>

                            <Divider sx={{ mt: 2, mb: 2 }} />

                            <AtencionTable atenciones={visibleAtenciones} animalDetails={true} onSendEmail={handleSendInformeEmail} />
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
