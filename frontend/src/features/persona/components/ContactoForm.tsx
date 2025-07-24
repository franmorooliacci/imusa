import React from 'react';
import { Box, Divider, Grid2, TextField, Typography } from '@mui/material';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext, Controller } from 'react-hook-form';

const ContactoForm = ({ name }: {name: string}) => {
    const { control } = useFormContext();

    return (
        <Box sx={{ mt: 2 }}>
            <Divider>
                <Box sx={{ display: 'flex', gap: 1 }} >
                    <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                        <FontAwesomeIcon icon={faAddressCard} size='1x' />
                    </Box>

                    <Typography>
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