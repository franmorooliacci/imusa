import React, { useContext, useEffect, useState } from 'react';
import { alpha, Box, CircularProgress, Grid2, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faDog, faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import type { AlertSeverity } from '@common/types';
import { AlertMessage } from '@common/components';
import { AuthContext } from '@common/context/auth';
import { formatDate, formatTime } from '@common/utils';
import { getAtenciones } from '../api';
import type { Atencion } from '../types';
import { sortAtencionesAsc } from '../utils/sort-atenciones-asc';

const ListAtencion = () => {
    const [atenciones, setAtenciones] = useState<Atencion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMsg, setAlertMsg] = useState<string>('');
    const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>('info');
    const { selectedEfectorId } = useContext(AuthContext);
    const sortedAtenciones: Atencion[] = sortAtencionesAsc(atenciones);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAtenciones = async () => {
            try{
                const params = { id: selectedEfectorId, finalizada: 0 }
                const response = await getAtenciones(params);
                setAtenciones(response);
                setLoading(false);
            } catch(error){
                setAlertSeverity('error');
                setAlertMsg('No se pudo cargar la información. Por favor, inténtalo de nuevo más tarde.');
                setAlertOpen(true);
            }
        };

        fetchAtenciones();
    }, [selectedEfectorId]);

    if (loading) {
        return (
            <Box 
                sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress size={80} />
            </Box>
        );
    }

    if (atenciones.length === 0) {
        return (
            <Box 
                sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h6">No hay atenciones en curso.</Typography>
            </Box>
        );
    }

    return (
        <>
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <Stack 
                        direction='row' 
                        alignItems='center'
                        justifyContent='center'
                        spacing={1} 
                        sx={{ 
                            bgcolor: 'background.paper', 
                            boxShadow: 3, 
                            borderRadius: 4, 
                            p: 2
                        }}
                    >
                        <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                            <FontAwesomeIcon icon={faFileMedical} size='2x' />
                        </Box>
                        <Typography variant='h5'>
                            Atenciones en curso
                        </Typography>
                    </Stack>
                </Grid2>

                {sortedAtenciones.map((atencion) => (
                    <Grid2 key={atencion.id} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <ListItem
                            disablePadding 
                            sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 4, overflow: 'hidden' }}
                        >
                            <ListItemButton 
                                onClick={() => navigate(`/atencion/finalizar/${atencion.id}/${atencion.id_responsable}/${atencion.id_animal}`)} 
                                sx={
                                    (theme) => ({
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.action.hover, 0.1),
                                        },
                                    }
                                )}
                            >
                                <ListItemIcon sx={{ color: (theme) => theme.palette.text.primary }}>
                                    <FontAwesomeIcon 
                                        icon={atencion.animal.id_especie === 1 ? faDog : faCat} 
                                        size='2x' 
                                        
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant='h6' component='div'>
                                            {atencion.animal.nombre}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant='body2' component='span' color='text.secondary'>
                                                {`${atencion.animal.raza} • ${atencion.animal.tamaño} • ${atencion.animal.colores.map(c => c.nombre).join(', ')}`}
                                            </Typography>
                                            <br />
                                            <Typography variant='body2' component='span' color='text.secondary'>
                                                {`${formatDate(atencion.fecha_ingreso!)}` +
                                                ` - ${formatTime(atencion.hora_ingreso!)}` + 
                                                ` - ${atencion.personal_nombre}`}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    </Grid2>
                ))}
            </Grid2>
            
            <AlertMessage 
                open = {alertOpen}
                handleClose = {() => setAlertOpen(false)}
                message = {alertMsg}
                severity = {alertSeverity}
            />
        </>
    );
};

export default ListAtencion;