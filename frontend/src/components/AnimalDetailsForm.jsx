import { faCat, faDog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Divider, Grid2, TextField, Typography, Stack } from '@mui/material';
import React from 'react';

const AnimalDetailsForm = ({ formData, onChange = () => {}, readOnly }) => {

    return (
        <Box sx={{ mb: 2 }}>
            <Divider textAlign='left'>
                <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
                    <FontAwesomeIcon icon={formData.animal.id_especie === 1 ? faDog : faCat} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />

                    <Typography variant='subtitle2'>
                        Datos del animal
                    </Typography>
                </Stack>
            </Divider>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label='Especie'
                        value={(formData.animal.id_especie === 1 ? 'Canino' : 'Felino') ?? ''}
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
                        label='Raza'
                        value={formData.animal.raza ?? ''}
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
                        label='Nombre'
                        value={formData.animal.nombre ?? ''}
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
                        label='Sexo'
                        value={(formData.animal.sexo === 'M' ? 'Macho' : 'Hembra') ?? ''}
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
                        label='Edad'
                        value={formData.animal.edad ?? ''}
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
                        label='Pelaje(color)'
                        value={
                            Array.isArray(formData.animal.colores)
                                ? formData.animal.colores.map(c => c.nombre).join(', ')
                                :''
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
                        label='Tamaño'
                        value={formData.animal.tamaño ?? ''}
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
                        label='Peso(kg)'
                        name='peso_kg'
                        value={formData.atencion.peso_kg ?? ''}
                        slotProps={{
                            input: {
                                readOnly: readOnly,
                                inputMode: 'decimal'
                            }
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                        onChange={onChange}
                    />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default AnimalDetailsForm;