import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Divider, Grid2, TextField, Typography, Stack } from '@mui/material';
import React from 'react';

const ResponsableDetailsForm = ({ formData }) => {

    return (
        <Box sx={{ mb: 2 }}>
            <Divider textAlign='left'>
                <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
                    <FontAwesomeIcon icon={faUser} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />

                    <Typography variant='subtitle2'>
                        Datos del responsable
                    </Typography>
                </Stack>
            </Divider>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='Nombre'
                        value={formData.responsable.nombre ?? ''}
                        slotProps={{
                            readOnly: true,
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='Apellido'
                        value={formData.responsable.apellido ?? ''}
                        slotProps={{
                            readOnly: true,
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='Domicilio'
                        value={
                            (`${formData.responsable.domicilio_actual.calle} ${formData.responsable.domicilio_actual.altura}` +
                            `${formData.responsable.domicilio_actual.bis === 0 ? '' : ' BIS'}` +
                            `${formData.responsable.domicilio_actual.letra ? ` ${formData.responsable.domicilio_actual.letra}` : ''}` +
                            `${formData.responsable.domicilio_actual.piso ? ` ${formData.responsable.domicilio_actual.piso}` : ''}` +
                            `${formData.responsable.domicilio_actual.depto ? ` ${formData.responsable.domicilio_actual.depto}` : ''}` +
                            `${formData.responsable.domicilio_actual.monoblock ? ` ${formData.responsable.domicilio_actual.monoblock}` : ''}`) ?? ''
                        }
                        slotProps={{
                            readOnly: true,
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='Teléfono'
                        value={formData.responsable.telefono ?? ''}
                        slotProps={{
                            readOnly: true,
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='DNI'
                        value={formData.responsable.dni ?? ''}
                        slotProps={{
                            readOnly: true,
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='Barrio'
                        value={formData.responsable.domicilio_actual.barrio ?? ''}
                        slotProps={{
                            readOnly: true,
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='Distrito'
                        value={formData.responsable.domicilio_actual.distrito ?? ''}
                        slotProps={{
                            readOnly: true,
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

export default ResponsableDetailsForm;