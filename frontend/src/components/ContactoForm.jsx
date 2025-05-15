import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Divider, Grid2, TextField, Typography } from '@mui/material';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

const ContactoForm = ({ name }) => {
    const { control } = useFormContext();

    return (
        <Box sx={{ mt: 2 }}>
            <Divider>
                <Box sx={{ display: 'flex', gap: 1 }} >
                    <FontAwesomeIcon icon={faAddressCard} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />

                    <Typography variant='h7'>
                        Contacto
                    </Typography>
                </Box>
            </Divider>

            <Grid2 container spacing={2} sx={{ mt: 1, mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Grid2>
                    <Controller
                        name={`${name}.telefono`}
                        control={control}
                        defaultValue=""
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Teléfono"
                                size="small"
                                helperText={fieldState.error?.message || 'Característica sin 0, número sin 15'}
                                error={!!fieldState.error}
                            />
                        )}
                    />
                </Grid2>
                <Grid2>
                    <Controller
                        name={`${name}.mail`}
                        control={control}
                        defaultValue=""
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Mail"
                                type="email"
                                size="small"
                                helperText={fieldState.error?.message}
                                error={!!fieldState.error}
                            />
                        )}
                    />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default ContactoForm;