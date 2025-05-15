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
                        value={formData.animal.raza_nombre ?? ''}
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
                        value={(formData.animal.edad === 1 ? `${formData.animal.edad} año` : `${formData.animal.edad} años`) ?? ''}
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
                        value={formData.animal.pelaje_color ?? ''}
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
                        value={(formData.animal.raza_tamaño.charAt(0).toUpperCase() + formData.animal.raza_tamaño.slice(1)) ?? ''}
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
                        label='Señas particulares'
                        name='señas_particulares'
                        value={formData.atencion.señas_particulares ?? ''}
                        slotProps={{
                            input: {
                                readOnly: readOnly,
                            }
                        }}
                        variant='outlined'
                        fullWidth
                        size='small'
                        onChange={onChange}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                    <TextField
                        label='Observaciones'
                        placeholder='Observaciones del animal'
                        name='observaciones_reseña'
                        value={formData.atencion.observaciones_animal ?? ''}
                        slotProps={{
                            input: {
                                readOnly: readOnly,
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