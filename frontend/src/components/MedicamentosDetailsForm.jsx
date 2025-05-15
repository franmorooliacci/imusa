import { faSyringe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Checkbox, Divider, FormControlLabel, FormGroup, Grid2, TextField, Typography, Stack } from '@mui/material';

const MedicamentosDetailsForm = ({ options, onOptionChange, formData, onChange }) => {
    
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        onOptionChange(name, {
            ...options[name],
            selected: checked
        });
    };
    
    const handleTextFieldChange = (event, option) => {
        const { name, value } = event.target;
        const normalizedValue = value.replace(',', '.');

        const isValid = /^\d*\.?\d*$/.test(normalizedValue) || value === '';

        if (isValid) {
            if (name.startsWith('ketamina')) {
                onChange(event);
            } else {
                onOptionChange(option, { value });
            }
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Divider textAlign='left'>
                <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
                    <FontAwesomeIcon icon={faSyringe} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />

                    <Typography variant='subtitle2'>
                        Medicamentos - Inyectables generales
                    </Typography>
                </Stack>
            </Divider>

            <Grid2 container spacing={2}>
                {Object.keys(options).map((option) => (
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
                                    onChange={(event) => handleTextFieldChange(event, option)}
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
                    <FontAwesomeIcon icon={faSyringe} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />

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
                        value={formData.ketamina_prequirurgico ?? ''}
                        variant='outlined'
                        fullWidth
                        size='small'
                        onChange={handleTextFieldChange}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
                    <TextField
                        label='Inducción (ml)'
                        name='ketamina_induccion'
                        value={formData.ketamina_induccion ?? ''}
                        variant='outlined'
                        fullWidth
                        size='small'
                        onChange={handleTextFieldChange}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
                    <TextField
                        label='Quirófano (ml)'
                        name='ketamina_quirofano'
                        value={formData.ketamina_quirofano ?? ''}
                        variant='outlined'
                        fullWidth
                        size='small'
                        onChange={handleTextFieldChange}
                    />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default MedicamentosDetailsForm;