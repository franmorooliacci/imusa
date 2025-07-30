import React from 'react';
import { Alert, Box, Button, CircularProgress, Divider, Grid2, Stack, Typography } from '@mui/material';
import { faAddressCard, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import type { Setter } from '@common/types';
import type { Persona, PersonaDTO } from '../types';
import { domicilioToString } from '../utils';

type Props = {
    searched: boolean;
    newPersona: PersonaDTO;
    existingPersona: Persona;
    isLoading: boolean;
    isInDb: boolean;
    addingResponsable: boolean;
    setAddingResponsable: Setter<boolean>;
    editDomicilio: boolean;
    setEditDomicilio: Setter<boolean>;
    editContacto: boolean;
    setEditContacto: Setter<boolean>;
    renaperFound: boolean | null;
    fallecido: boolean;
    setNoRNP: Setter<boolean>;
};

const SearchPersonaResult = (props: Props) => {
    const {
        searched,
        newPersona,
        existingPersona,
        isLoading,
        isInDb,
        addingResponsable,
        setAddingResponsable,
        editDomicilio,
        setEditDomicilio,
        editContacto,
        setEditContacto,
        renaperFound,
        fallecido,
        setNoRNP
    } = props;
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
                                    <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                                        <FontAwesomeIcon icon={faUser} size='1x' />
                                    </Box>
                                    
                                    <Typography variant='body1'>
                                        {existingPersona.nombre} {existingPersona.apellido}
                                    </Typography>
                                </Box>
                            </Grid2>

                            {(!editDomicilio && !editContacto) &&
                                <Grid2>
                                    <Button 
                                        size='small' 
                                        variant='contained' 
                                        color='primary' 
                                        onClick={() => navigate(`/responsable/${existingPersona.id}`)}
                                    >
                                        Continuar
                                    </Button>
                                </Grid2>
                            }       
                        </Grid2>

                        {(!editDomicilio && !editContacto) &&
                            <Grid2 container spacing={2} sx={{ mt: 2 }}>
                                <Grid2 sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                                                <FontAwesomeIcon icon={faLocationDot} size='1x' />
                                            </Box>
                        
                                            <Typography>
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
                                            {` ${domicilioToString(existingPersona.domicilio_actual)}`}
                                        </Typography>
                                    </Stack>
                                </Grid2>

                                <Grid2 sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <Box sx={{ display: 'flex', gap: 1 }} >
                                            <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                                                <FontAwesomeIcon icon={faAddressCard} size='1x' />
                                            </Box>

                                            <Typography>
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
                                                Correo:
                                            </strong>
                                            {` ${existingPersona.mail || ' - '}`}
                                        </Typography>
                                        <Typography variant='body2'>
                                            <strong>
                                                Teléfono:
                                            </strong>
                                            {` ${existingPersona.telefono}`}
                                        </Typography>
                                    </Stack>
                                </Grid2>
                            </Grid2>
                        }
                    </Box>
                ) : (renaperFound === true && !isInDb) ? (
                    <Box>
                        {fallecido ? (
                            <Box>
                                <Alert severity='error' sx={{ display: 'flex', justifyContent: 'center' }} > 
                                    La persona está fallecida.
                                </Alert>

                                <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
                                    <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                                        <FontAwesomeIcon icon={faUser} size='1x' />
                                    </Box>
                                    
                                    <Typography variant='body1'>
                                        {newPersona.nombre} {newPersona.apellido}
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
                                        <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                                            <FontAwesomeIcon icon={faUser} size='1x' />
                                        </Box>
                                        <Typography variant='body1'>
                                            {newPersona.nombre} {newPersona.apellido}
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
                                onClick={() => setNoRNP(true)}
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

export default SearchPersonaResult;