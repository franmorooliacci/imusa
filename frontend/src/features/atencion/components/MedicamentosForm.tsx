import React from 'react';
import { Box, Checkbox, Divider, FormControlLabel, FormGroup, Grid2, TextField, Typography, Stack } from '@mui/material';
import { faSyringe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Setter } from '@common/types';
import type { InsumoOption, InsumoOptions, KetaminaState } from '../types';

type Props = {
    options: InsumoOptions;
    onOptionChange: (option: keyof InsumoOptions, newValue: Partial<InsumoOption>) => void;
    ketamina: KetaminaState;
    onChange: Setter<KetaminaState>;
};

const MedicamentosForm = ({ options, onOptionChange, ketamina, onChange }: Props) => {

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const key = event.target.name as keyof InsumoOptions;
        const checked = event.target.checked;

        onOptionChange(key, { selected: checked });
    };

    const handleOptionValueChange = (option: keyof InsumoOptions): React.ChangeEventHandler<HTMLInputElement> => (e) => {
        const raw = e.target.value.replace(',', '.');
        if (!/^\d*\.?\d*$/.test(raw) && raw !== '') return;
        onOptionChange(option, { value: raw });
    };

    const handleKetaminaChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const { name, value } = e.target;
        const raw = value.replace(',', '.');
        if (!/^\d*\.?\d*$/.test(raw) && raw !== '') return;

        const [, field] = name.split('_');
        onChange(prev => ({ ...prev, [field]: raw }));
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Divider textAlign='left'>
                <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                        <FontAwesomeIcon icon={faSyringe} size='1x' />
                    </Box>

                    <Typography variant='subtitle2'>
                        Medicamentos - Inyectables generales
                    </Typography>
                </Stack>
            </Divider>

            <Grid2 container spacing={2}>
                {(Object.keys(options) as Array<keyof InsumoOptions>).map(option => (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={option}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={options[option].selected}
                                        onChange={handleCheckboxChange}
                                        name={option}
                                    />
                                }
                                label={option === 'mezcla' ? 'Mezcla (keta-diazep.) 2+1' : option.charAt(0).toUpperCase() + option.slice(1)}
                            />
                            {options[option].selected && (
                                <TextField
                                    label={'Cantidad consumida (ml)'}
                                    value={options[option].value ?? ''}
                                    onChange={handleOptionValueChange(option)}
                                    variant='outlined'
                                    fullWidth
                                    size='small'
                                />
                            )}
                        </FormGroup>
                    </Grid2>
                ))}
            </Grid2>

            <Divider textAlign='left' sx={{ mt: 2 }}>
                <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
                    <Box>
                        <FontAwesomeIcon icon={faSyringe} size='1x' />
                    </Box>
                    <Typography variant='subtitle2'>
                        Medicamentos - Inyectables trazables
                    </Typography>
                </Stack>
            </Divider>

            <Typography variant='body1' sx={{ mb: 1 }}>
                Ketamina:
            </Typography>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
                    <TextField
                        label='Prequirúrgico (ml)'
                        name='ketamina_prequirurgico'
                        value={ketamina.prequirurgico ?? ''}
                        variant='outlined'
                        fullWidth
                        size='small'
                        onChange={handleKetaminaChange}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
                    <TextField
                        label='Inducción (ml)'
                        name='ketamina_induccion'
                        value={ketamina.induccion ?? ''}
                        variant='outlined'
                        fullWidth
                        size='small'
                        onChange={handleKetaminaChange}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
                    <TextField
                        label='Quirófano (ml)'
                        name='ketamina_quirofano'
                        value={ketamina.quirofano ?? ''}
                        variant='outlined'
                        fullWidth
                        size='small'
                        onChange={handleKetaminaChange}
                    />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default MedicamentosForm;