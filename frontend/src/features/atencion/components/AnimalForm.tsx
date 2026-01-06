import { useState } from 'react';
import {
    Box,
    Divider,
    Grid2,
    TextField,
    Typography,
    Stack,
} from '@mui/material';
import { faCat, faDog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Animal } from '@features/animal';

type Props = {
    animal: Animal;
    peso?: string;
    pesoError?: string | null;
    onPesoChange?: (text: string) => void;
};

const AnimalForm = ({
    animal,
    peso = '',
    pesoError = null,
    onPesoChange = () => {},
}: Props) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Divider textAlign="left">
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                >
                    <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                        <FontAwesomeIcon
                            icon={animal.id_especie === 1 ? faDog : faCat}
                            size="1x"
                        />
                    </Box>
                    <Typography variant="subtitle1">
                        Datos del animal
                    </Typography>
                </Stack>
            </Divider>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label="Especie"
                        value={animal.id_especie === 1 ? 'Canino' : 'Felino'}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                        variant="outlined"
                        fullWidth
                        size="small"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label="Raza"
                        value={animal.raza ?? ''}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                        variant="outlined"
                        fullWidth
                        size="small"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label="Nombre"
                        value={animal.nombre ?? ''}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                        variant="outlined"
                        fullWidth
                        size="small"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label="Sexo"
                        value={animal.sexo === 'M' ? 'Macho' : 'Hembra'}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                        variant="outlined"
                        fullWidth
                        size="small"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label="Edad"
                        value={animal.edad ?? ''}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                        variant="outlined"
                        fullWidth
                        size="small"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label="Pelaje(color)"
                        value={
                            Array.isArray(animal.colores)
                                ? animal.colores.map((c) => c.nombre).join(', ')
                                : ''
                        }
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                        variant="outlined"
                        fullWidth
                        size="small"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label="Tamaño"
                        value={animal.tamaño ?? ''}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                        variant="outlined"
                        fullWidth
                        size="small"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        label="Peso(kg)"
                        value={peso}
                        variant="outlined"
                        fullWidth
                        size="small"
                        onChange={(e) => onPesoChange(e.target.value)}
                        error={Boolean(pesoError)}
                        helperText={pesoError ?? ' '}
                        type="text"
                        inputProps={{ inputMode: 'decimal' }}
                    />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default AnimalForm;
