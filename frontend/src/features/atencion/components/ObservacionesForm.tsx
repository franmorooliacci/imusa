import React from 'react';
import { Box, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Setter } from '@common/types';
import type { EstadoEgreso } from '../types';

type Props = {
    observaciones: string;
    setObservaciones: Setter<string>;
    estados: EstadoEgreso[];
    estadoEgreso: EstadoEgreso;
    setEstadoEgreso: Setter<EstadoEgreso>;
};

const ObservacionesForm = ({ observaciones, setObservaciones, estados, estadoEgreso, setEstadoEgreso }: Props) => {

    return (
        <Box sx={{ mb: 2 }}>
            <Divider textAlign='left'>
                <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                        <FontAwesomeIcon icon={faAsterisk} size='1x' />
                    </Box>
                    <Typography variant='subtitle1'>
                        Observaciones
                    </Typography>
                </Stack>
            </Divider>

            <Stack spacing={2}>
                <Stack direction='row' alignItems='center' spacing={2}>
                    <Typography>
                        Estado sanitario al egreso:
                    </Typography>

                    <TextField
                        select
                        value={estadoEgreso.id}
                        size='small'
                        onChange={(e) => {
                            const selected = estados.find(
                                (est) => Number(est.id) === Number(e.target.value)
                            );
                            if (selected) {
                                setEstadoEgreso(selected);
                            }
                        }}
                    >
                        {estados.map((est) => (
                            <MenuItem key={est.id} value={est.id}>
                                {est.nombre}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>

                <TextField
                    label='Observaciones'
                    name='observaciones'
                    value={observaciones}
                    variant='outlined'
                    fullWidth
                    size='small'
                    onChange={(e) => setObservaciones(e.target.value)}
                />
            </Stack>
        </Box>
    );
};

export default ObservacionesForm;