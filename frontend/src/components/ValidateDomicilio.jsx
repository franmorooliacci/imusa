import { Alert, Box, Button, CircularProgress, Grid2, List, ListItemButton, ListItemText, TextField } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { getDireccion, getFeatures, getLatitudLongitud } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import AlertMessage from './AlertMessage';
import { useFormContext } from 'react-hook-form';
import MapView from './MapView';
import proj4 from 'proj4';

// Define EPSG:22185 and WGS84
proj4.defs("EPSG:22185", "+proj=tmerc +lat_0=-90 +lon_0=-60 +k=1 +x_0=5500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");

const ValidateDomicilio = ({ name, setDone, domicilioRenaper }) => {
    const [toValidate, setToValidate] = useState(domicilioRenaper);
    const [features, setFeatures] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState('');
    const [domicilioBuffer, setDomicilioBuffer] = useState({ piso: '', depto: '', monoblock: '' });
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const { setValue, getValues, trigger, formState: { errors, isSubmitted } } = useFormContext();
    const domicilioErrors = errors[name] || {};
    const [loading, setLoading] = useState(false);

    const convertCoordinates = (x, y) => {
        const [lon, lat] = proj4('EPSG:22185', 'EPSG:4326', [x, y]);
        return { lat, lon };
    };

    const mapCoordinates = useMemo(() => {
        if (selectedIndex === '' || features.length === 0) return null;
        const [xRaw, yRaw] = features[selectedIndex].geometry.coordinates;
        return convertCoordinates(xRaw, yRaw);
    }, [selectedIndex, features]);

    const validate = async () => {
        setLoading(true);
        try {
            const response = await getFeatures(toValidate);
            setFeatures(response);
            setSelectedIndex('');

        } catch(error){
            setAlertSeverity('error');
            setAlertMsg('No se ha podido validar el domicilio.');
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDomicilioBuffer((prev) => ({ ...prev, [name]: value }));
    };

    const setDomicilioData = async () => {
        // Guardo los datos de la primer api y domicilioBuffer
        const domicilioData = {
            ...domicilioBuffer,
            coordenada_x: features[selectedIndex].geometry.coordinates[0],
            coordenada_y: features[selectedIndex].geometry.coordinates[1],
            codigo_calle: features[selectedIndex].properties.codigoCalle
        };

        // Llamo a la segunda api
        const response2 = await getDireccion(
            features[selectedIndex].properties.codigoCalle, 
            features[selectedIndex].properties.altura, 
            features[selectedIndex].properties.bis,
            features[selectedIndex].properties.letra
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
                        {selectedIndex === '' ? (
                            <Alert severity='info' sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                Seleccione una opción.  
                            </Alert>
                        ) : (
                            <MapView x={mapCoordinates.lon} y={mapCoordinates.lat} />
                        )}

                        <List sx={{ width: '100%' }}>
                            {features.map((feature, index) => {
                                const { nombreCalle, altura, letra, bis } = feature.properties;
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
                    {selectedIndex !== '' &&
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
                    {selectedIndex !== '' &&
                        <Grid2 container sx={{ justifyContent: 'center', mt: 1 }}>
                            <Button onClick={handleSeleccionar} variant='outlined' color='primary' size='small'>Seleccionar</Button>
                        </Grid2>
                    }
                </Grid2>
            }

            <AlertMessage
                open = {alertOpen}
                handleClose = {() => setAlertOpen(false)}
                message = {alertMsg}
                severity = {alertSeverity}
            />
        </Box>
    );
};

export default ValidateDomicilio;
