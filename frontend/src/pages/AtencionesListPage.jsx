import { alpha, Box, CircularProgress, Grid2, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { getAtenciones } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faDog, faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AtencionesListPage = () => {
    const [atenciones, setAtenciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const { selectedEfectorId } = useContext(AuthContext);
    const sortedAtenciones = atenciones.sort((a, b) => {
        const dateDiff = new Date(a.fecha_ingreso) - new Date(b.fecha_ingreso);
        if (dateDiff !== 0) return dateDiff;
        return a.hora_ingreso.localeCompare(b.hora_ingreso);
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAtenciones = async () => {
            try{
                const params = { id_efector: selectedEfectorId, estado: 0 }
                const response = await getAtenciones(params);
                setAtenciones(response);
                setLoading(false);
            } catch(error){

            }
        };

        fetchAtenciones();
    }, [selectedEfectorId]);

    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };
    
    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

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
    };

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
    };

    return (
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
                    <FontAwesomeIcon icon={faFileMedical} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />
                    <Typography variant='h5'>
                        Atenciones en curso
                    </Typography>
                </Stack>
            </Grid2>

            {sortedAtenciones.map((atencion) => (
                <Grid2 key={atencion.id_atencion} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                    <ListItem
                        disablePadding 
                        sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 4, overflow: 'hidden' }}
                    >
                        <ListItemButton 
                            onClick={() => navigate(`/atencion/finalizar/${atencion.id_atencion}/${atencion.id_responsable}/${atencion.id_animal}`)} 
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
                                            {`${atencion.animal.raza_nombre} • ${atencion.animal.pelaje_color}`}
                                        </Typography>
                                        <br />
                                        <Typography variant='body2' component='span' color='text.secondary'>
                                            {`${formatDate(atencion.fecha_ingreso)}` +
                                            ` - ${formatTime(atencion.hora_ingreso)}` + 
                                            ` - ${atencion.profesional_nombre}`}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                </Grid2>
            ))}
        </Grid2>
    
    );
};

export default AtencionesListPage;