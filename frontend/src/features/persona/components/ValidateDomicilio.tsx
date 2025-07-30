import React, { ChangeEvent, useMemo, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Grid2, List, ListItemButton, ListItemText, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useFormContext } from 'react-hook-form';
import { MapView } from '@common/components';
import type { AlertSeverity, APIResponseList, Setter } from '@common/types';
import { convertCoordinates } from '@common/utils';
import { getDireccion, getFeatures } from '../api';
import type { DomicilioBuffer } from '../types';

type Props = {
    name: string;
    setDone: Setter<boolean>;
    domicilioRenaper: string;
    setAlertOpen: Setter<boolean>;
    setAlertMsg: Setter<string>;
    setAlertSeverity: Setter<AlertSeverity>;
};

const ValidateDomicilio = (props: Props) => {
    const { name, setDone, domicilioRenaper, setAlertOpen, setAlertMsg, setAlertSeverity } = props;
    const [toValidate, setToValidate] = useState<string>(domicilioRenaper);
    const [features, setFeatures] = useState<APIResponseList>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [domicilioBuffer, setDomicilioBuffer] = useState<DomicilioBuffer>({ piso: '', depto: '', monoblock: '' });
    const { setValue, getValues, trigger, formState: { errors, isSubmitted } } = useFormContext();
    const domicilioErrors = errors[name] || {};
    const [loading, setLoading] = useState<boolean>(false);

    const mapCoordinates = useMemo(() => {
        if (selectedIndex === null || features.length === 0) return null;

        const [xRaw, yRaw] = (features[selectedIndex] as {
            geometry: { coordinates: [number, number] };
        }).geometry.coordinates;

        return convertCoordinates(xRaw, yRaw);
    }, [selectedIndex, features]);

    const validate = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await getFeatures(toValidate);
            setFeatures(response);
            setSelectedIndex(null);

        } catch(error){
            setAlertSeverity('error');
            setAlertMsg('No se ha podido validar el domicilio.');
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setDomicilioBuffer((prev) => ({ ...prev, [name]: value }));
    };

    const setDomicilioData = async (): Promise<void> => {
        if (selectedIndex === null) return;
        const feature: Record<string, any> = features[selectedIndex];
        // Guardo los datos de la primer api y domicilioBuffer
        const domicilioData: Record<string, any> = {
            ...domicilioBuffer,
            coordenada_x: feature.geometry.coordinates[0],
            coordenada_y: feature.geometry.coordinates[1],
            codigo_calle: feature.properties.codigoCalle
        };

        // Llamo a la segunda api
        const response2: Record<string, any> = await getDireccion(
            feature.properties.codigoCalle,
            feature.properties.altura,
            feature.properties.bis,
            feature.properties.letra
        );

        // Guardo los datos de la segunda api
        Object.assign(domicilioData, {
            calle: response2.calle.nombre,
            altura: response2.altura,
            bis: response2.bis === null ? '' : response2.bis,
            letra: response2.letra,
            barrio: response2.divsAdmins[2].valor,
            vecinal: response2.divsAdmins[1].valor,
            distrito: response2.divsAdmins[0].valor,
            seccional_policial: response2.divsAdmins[3].valor,
            localidad: response2.localidad,
            lineas_tup: response2.lineasTup.join(','),
            fraccion_censal: response2.divsAdmins[4].valor,
            radio_censal: response2.divsAdmins[5].valor        
        });
        
        const previous = getValues(name) || {};
        setValue(name, { ...previous, ...domicilioData }, { shouldValidate: true });
    };

    const handleSeleccionar = async () => {
        try {
            await setDomicilioData();
            const valid = await trigger(name);
            if (valid) setDone(true);

        } catch (error) {
        
        }
    };

    return (
        <Box>
            <Grid2 container spacing={2} sx={{ mt: 1, gap: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Grid2>
                    <TextField
                        label='Domicilio'
                        name='domicilio'
                        value={toValidate}
                        onChange={(e) => setToValidate(e.target.value)}
                        variant='outlined'
                        size='small'
                        error={isSubmitted && Boolean(domicilioErrors)}
                        helperText={isSubmitted && domicilioErrors ? 'Valide el domicilio' : ' '}
                    />
                </Grid2>
                
                <Grid2>
                    <Button 
                        variant='outlined' 
                        color='primary' 
                        onClick={validate}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        {loading ?  'Buscando…' : 'Validar'}
                    </Button>
                </Grid2>
            </Grid2>

            {features.length > 0 &&
                <Grid2 container spacing={1} sx={{ mb: 1, display: 'flex', flexDirection: 'column' }}>
                    <Grid2 container sx={{ justifyContent: 'center', width: { xs: '100%', sm: '50%' }, mx: 'auto' }}>
                        {selectedIndex === null ? (
                            <Alert severity='info' sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                Seleccione una opción.  
                            </Alert>
                        ) : (
                            <MapView x={mapCoordinates!.lon} y={mapCoordinates!.lat} />
                        )}

                        <List sx={{ width: '100%' }}>
                            {features.map((feature, index) => {
                                const { nombreCalle, altura, letra, bis } = feature.properties as Record<string, any>;
                                const displayText = `${nombreCalle} ${altura}${letra !== '' ? ' ' + letra : ''}${bis ? ' BIS' : ''}`;

                                return (
                                    <ListItemButton 
                                        key={index}  
                                        selected={selectedIndex === index}
                                        onClick={() => setSelectedIndex(index)}
                                        sx={{
                                            '&.Mui-selected': {
                                            backgroundColor: '#eeeeee'
                                            }
                                        }}
                                    >
                                        <ListItemText primary={displayText} />
                                        {selectedIndex === index &&
                                            <FontAwesomeIcon icon={faCheck} size='2x' style={{ color: '#1976d2' }} />
                                        }
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </Grid2>
                    {selectedIndex !== null &&
                        <Grid2 container sx={{ justifyContent: 'center' }} >
                            <Grid2>
                                <TextField
                                    label='Piso'
                                    name='piso'
                                    variant='outlined'
                                    size='small'
                                    value={domicilioBuffer.piso}
                                    onChange={handleChange}
                                    sx={{ width: '12ch' }}
                                />
                            </Grid2>
                            <Grid2>
                                <TextField
                                    label='Departamento'
                                    name='depto'
                                    variant='outlined'
                                    size='small'
                                    value={domicilioBuffer.depto}
                                    onChange={handleChange}
                                    sx={{ width: '12ch' }}
                                />
                            </Grid2>
                            <Grid2>
                                <TextField
                                    label='Monoblock'
                                    name='monoblock'
                                    variant='outlined'
                                    size='small'
                                    value={domicilioBuffer.monoblock}
                                    onChange={handleChange}
                                    sx={{ width: '12ch' }}
                                />
                            </Grid2>
                        </Grid2>
                    }
                    {selectedIndex !== null &&
                        <Grid2 container sx={{ justifyContent: 'center', mt: 1 }}>
                            <Button onClick={handleSeleccionar} variant='outlined' color='primary' size='small'>Seleccionar</Button>
                        </Grid2>
                    }
                </Grid2>
            }
        </Box>
    );
};

export default ValidateDomicilio;
