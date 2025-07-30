import React from 'react';
import { Box, Divider, Grid2, TextField, Typography, Stack } from '@mui/material';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Persona } from '@features/persona';
import { domicilioToString } from '@features/persona';

const ResponsableForm = ({ responsable }: { responsable: Persona }) => {

    return (
        <Box sx={{ mb: 2 }}>
            <Divider textAlign='left'>
                <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                        <FontAwesomeIcon icon={faUser} size='1x' />
                    </Box>
                    <Typography variant='subtitle2'>
                        Datos del responsable
                    </Typography>
                </Stack>
            </Divider>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='Nombre'
                        value={responsable.nombre ?? ''}
                        slotProps={{
                            input: {
                                readOnly: true,
                            }
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='Apellido'
                        value={responsable.apellido ?? ''}
                        slotProps={{
                            input: {
                                readOnly: true,
                            }
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='Domicilio'
                        value={domicilioToString(responsable.domicilio_actual) ?? ''}
                        slotProps={{
                            input: {
                                readOnly: true,
                            }
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='Teléfono'
                        value={responsable.telefono ?? ''}
                        slotProps={{
                            input: {
                                readOnly: true,
                            }
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='DNI'
                        value={responsable.dni ?? ''}
                        slotProps={{
                            input: {
                                readOnly: true,
                            }
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='Barrio'
                        value={responsable.domicilio_actual.barrio ?? ''}
                        slotProps={{
                            input: {
                                readOnly: true,
                            }
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='Distrito'
                        value={responsable.domicilio_actual.distrito ?? ''}
                        slotProps={{
                            input: {
                                readOnly: true,
                            }
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default ResponsableForm;