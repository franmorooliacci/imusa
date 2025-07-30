import { faAddressCard, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Box, Button, CircularProgress, Divider, Grid2, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { updateAnimal } from '../services/api';

const SearchResultsTable = ({ searched, responsable, isLoading, isInDb, 
    addingResponsable, setAddingResponsable, editDomicilio, setEditDomicilio, editContacto, setEditContacto, renaperFound, Transfer ={}}) => {
    const navigate = useNavigate();
    return (
        <Box sx={{ mt: 2 }}>
            {searched && (
                isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : (renaperFound === true && isInDb) ? (
                    <Box>
                        <Alert severity='info' sx={{ display: 'flex', justifyContent: 'center' }} > 
                            La persona está registrada en el IMuSA.
                        </Alert>

                        <Grid2 container spacing={2} sx={{ mt: 2, alignItems: 'center', justifyContent: 'center' }}>
                            <Grid2>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <FontAwesomeIcon icon={faUser} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />
                                    
                                    <Typography variant='body1'>
                                        {responsable.nombre} {responsable.apellido}
                                    </Typography>
                                </Box>
                            </Grid2>

                            {(!editDomicilio && !editContacto) &&
                             <Grid2>
                                {Object.keys(Transfer).length === 0 ? (
                                    <Button 
                                        size="small" 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => navigate(`/responsable/${responsable.id}`)}
                                    >
                                        Continuar
                                    </Button>
                                ) : (
                                    <Button 
                                        size="small" 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => {
                                            const finalData = {
                                                ...Transfer,
                                                id_responsable: responsable.id
                                            };
                                            updateAnimal(finalData.Transfer.id, finalData);
                                            navigate(`/responsable/${responsable.id}`);
                                        }}
                                    >
                                        Transferir
                                    </Button>
                                )}
                            </Grid2>

                            }       
                        </Grid2>

                        {(!editDomicilio && !editContacto) &&
                            <Grid2 container spacing={2} sx={{ mt: 2 }}>
                                <Grid2 sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <FontAwesomeIcon icon={faLocationDot} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />
                        
                                            <Typography variant='h7'>
                                                Domicilio
                                            </Typography>
                                        </Box>
                                        <Button 
                                            size='small' 
                                            variant='outlined' 
                                            color='primary' 
                                            onClick={() => setEditDomicilio(true)}
                                        >
                                            Editar
                                        </Button>
                                    </Box>

                                    <Divider sx={{ mt: 1, mb: 1 }} />

                                    <Stack spacing={0.5} sx={{ mt: 1 }}>
                                        <Typography variant='body2'>
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
                                        <Typography variant='body2'>
                                            <strong>
                                                Localidad:
                                            </strong>
                                            {` ${responsable.domicilio_actual.localidad}`}
                                        </Typography>
                                    </Stack>
                                </Grid2>

                                <Grid2 sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <Box sx={{ display: 'flex', gap: 1 }} >
                                            <FontAwesomeIcon icon={faAddressCard} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />
                        
                                            <Typography variant='h7'>
                                                Contacto
                                            </Typography>
                                        </Box>
                                        <Button 
                                            size='small' 
                                            variant='outlined' 
                                            color='primary' 
                                            onClick={() => setEditContacto(true)}
                                        >
                                            Editar
                                        </Button>
                                    </Box>

                                    <Divider sx={{ mt: 1, mb: 1 }} />

                                    <Stack spacing={0.5} sx={{ mt: 1 }}>
                                        <Typography variant='body2'>
                                            <strong>
                                                Mail:
                                            </strong>
                                            {` ${responsable.mail || ' - '}`}
                                        </Typography>
                                        <Typography variant='body2'>
                                            <strong>
                                                Teléfono:
                                            </strong>
                                            {` ${responsable.telefono}`}
                                        </Typography>
                                    </Stack>
                                </Grid2>
                            </Grid2>
                        }
                    </Box>
                ) : (renaperFound === true && !isInDb) ? (
                    <Box>
                        {responsable.fallecido ? (
                            <Box>
                                <Alert severity='error' sx={{ display: 'flex', justifyContent: 'center' }} > 
                                    La persona está fallecida.
                                </Alert>

                                <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
                                    <FontAwesomeIcon icon={faUser} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />
                                    
                                    <Typography variant='body1'>
                                        {responsable.nombre} {responsable.apellido}
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Box>
                                <Alert severity='warning' sx={{ display: 'flex', justifyContent: 'center' }} > 
                                    La persona no está registrada en el IMuSA.
                                </Alert>

                                <Box sx={{ display: 'flex', gap: 2 , mt: 2, alignItems: 'center', justifyContent: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <FontAwesomeIcon icon={faUser} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />
                                        
                                        <Typography variant='body1'>
                                            {responsable.nombre} {responsable.apellido}
                                        </Typography>
                                    </Box>

                                    {!addingResponsable &&
                                        <Button 
                                            size='small' 
                                            variant='outlined' 
                                            color='primary' 
                                            onClick={() => setAddingResponsable(true)}
                                        >
                                            Agregar
                                        </Button>
                                    }
                                </Box>
                            </Box>
                        )}
                    </Box>
                ) : (renaperFound === false) ? (
                    <Box>
                        <Alert severity='error' sx={{ display: 'flex', justifyContent: 'center' }} > 
                            No se encontraron resultados.
                        </Alert>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant='outlined' 
                                color='primary' 
                                onClick={() => navigate('/responsable/agregar')}
                            >
                                Agregar
                            </Button>
                        </Box>
                    </Box>
                ) : null
            )}
        </Box>
    );
}

export default SearchResultsTable;
