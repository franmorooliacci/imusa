import { faCheck, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Checkbox, Divider, FormControlLabel, Grid2, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ValidateDomicilio from './ValidateDomicilio';
import { useFormContext, Controller } from 'react-hook-form';

const DomicilioForm = ({ name, title, domicilioRenaper = '', setDomicilioDone}) => {
    const [option, setOption] = useState('rosario');
    const [done, setDone] = useState(false);
    const { control, trigger, setValue } = useFormContext();

    useEffect(() => {
        setDomicilioDone(done);
    }, [done, setDomicilioDone]);
    
    return (
        <Box sx={{ mt: 2 }}>
            <Divider>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <FontAwesomeIcon icon={faLocationDot} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />

                    <Typography variant='h7'>
                        {title}
                    </Typography>
                </Box>
            </Divider>
            
            {!done &&
                <Grid2 container spacing={1} sx={{ mt: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Grid2>
                        <Typography variant='body1'> Localidad: </Typography>
                    </Grid2>
                    <Grid2>
                        <RadioGroup 
                            row 
                            value={option} 
                            onChange={e => {
                                const selected = e.target.value;
                                setOption(selected);
                                if(selected === 'otra'){
                                    setValue(`${name}.localidad`, '');
                                    setValue(`${name}.calle`, '');
                                    setValue(`${name}.altura`, '');
                                    setValue(`${name}.bis`, false);
                                    setValue(`${name}.letra`, '');
                                    setValue(`${name}.piso`, '');
                                    setValue(`${name}.depto`, '');
                                    setValue(`${name}.monoblock`, '');
                                }
                            }}
                        >
                            <FormControlLabel
                                value='rosario'
                                control={<Radio />}
                                label='Rosario'
                            />
                            <FormControlLabel
                                value='otra'
                                control={<Radio />}
                                label='Otra'
                            />
                        </RadioGroup>
                    </Grid2>
                    {option === 'otra' &&
                        <Grid2>
                            <Controller
                                name = {`${name}.localidad`}
                                control = {control}
                                defaultValue={''}
                                render = {({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        label='Localidad'
                                        variant='outlined'
                                        size='small'
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Grid2>
                    }
                </Grid2>
            }

            {option === 'rosario' ? (
                <>
                    {!done ? (
                        <ValidateDomicilio name = {name} setDone = {setDone} domicilioRenaper = {domicilioRenaper} />
                    ): (
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', mt: 2 }}>
                            <FontAwesomeIcon icon={faCheck} size='4x' style={{ color: '#1976d2' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button 
                                    onClick={() => setDone(false)} 
                                    variant='outlined' 
                                    color='primary'
                                    size='small'
                                >
                                    Editar
                                </Button>
                            </Box>
                        </Box>
                    )}
                </>
                
            ) : (
                <>
                    {!done ? (
                        <>
                            <Grid2 container spacing={2} sx={{ mt: 2, mb: 2, justifyContent: 'center' }}>
                                <Grid2 container sx={{ justifyContent: 'center' }}>
                                    <Grid2>
                                        <Controller
                                            name = {`${name}.calle`}
                                            control = {control}
                                            defaultValue={''}
                                            render = {({field, fieldState}) => (
                                                <TextField
                                                    {...field}
                                                    label='Calle'
                                                    variant='outlined'
                                                    size='small'
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </Grid2>
                                    <Grid2>
                                        <Controller
                                            name = {`${name}.altura`}
                                            control = {control}
                                            defaultValue={''}
                                            render = {({field, fieldState}) => (
                                                <TextField
                                                    {...field}
                                                    label='Altura'
                                                    variant='outlined'
                                                    size='small'
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    sx={{ 
                                                        '& input[type=number]': {
                                                            MozAppearance: 'textfield',
                                                        },
                                                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                                            WebkitAppearance: 'none',
                                                            margin: 0,
                                                        },
                                                        width: '12ch'
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid2>
                                    <Grid2>
                                        <Controller
                                            name = {`${name}.bis`}
                                            control = {control}
                                            defaultValue = {false}
                                            render = {({ field }) => (
                                                <FormControlLabel
                                                    control = {<Checkbox {...field} checked={field.value} />}
                                                    label = 'Bis'
                                                />
                                            )}
                                        />
                                    </Grid2>
                                </Grid2>
                                <Grid2 container sx={{ justifyContent: 'center' }}>
                                    <Grid2>
                                        <Controller
                                            name = {`${name}.letra`}
                                            control = {control}
                                            defaultValue={''}
                                            render = {({field, fieldState}) => (
                                                <TextField
                                                    {...field}
                                                    label='Letra'
                                                    variant='outlined'
                                                    size='small'
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    sx={{width: '12ch'}}
                                                />
                                            )}
                                        />
                                    </Grid2>
                                    <Grid2>
                                        <Controller
                                            name = {`${name}.piso`}
                                            control = {control}
                                            defaultValue={''}
                                            render = {({field, fieldState}) => (
                                                <TextField
                                                    {...field}
                                                    label='Piso'
                                                    variant='outlined'
                                                    size='small'
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    sx={{width: '12ch'}}
                                                />
                                            )}
                                        />
                                    </Grid2>
                                    <Grid2>
                                        <Controller
                                            name = {`${name}.depto`}
                                            control = {control}
                                            defaultValue={''}
                                            render = {({field, fieldState}) => (
                                                <TextField
                                                    {...field}
                                                    label='Departamento'
                                                    variant='outlined'
                                                    size='small'
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    sx={{width: '12ch'}}
                                                />
                                            )}
                                        />
                                    </Grid2>
                                    <Grid2>
                                        <Controller
                                            name = {`${name}.monoblock`}
                                            control = {control}
                                            defaultValue={''}
                                            render = {({field, fieldState}) => (
                                                <TextField
                                                    {...field}
                                                    label='Monoblock'
                                                    variant='outlined'
                                                    size='small'
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    sx={{width: '12ch'}}
                                                />
                                            )}
                                        />
                                    </Grid2>
                                </Grid2>
                            </Grid2>
                        
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button 
                                    variant='outlined' 
                                    color='primary'
                                    size='small'
                                    onClick={async () => {
                                        const valid = await trigger(name);
                                        if (valid) setDone(true);
                                    }}
                                >
                                    Seleccionar
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', mt: 2 }}>
                            <FontAwesomeIcon icon={faCheck} size='4x' style={{ color: '#1976d2' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button 
                                    onClick={() => setDone(false)} 
                                    variant='outlined' 
                                    color='primary'
                                    size='small'  
                                >
                                    Editar
                                </Button>
                            </Box>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default DomicilioForm;