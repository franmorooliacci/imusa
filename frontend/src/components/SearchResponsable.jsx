import React from 'react';
import { TextField, Button, Typography, Box, Grid2, MenuItem, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { getCiudadano, getPersona } from '../services/api';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import searchSchema from '../validation/searchSchema';

const SearchResponsable = ({ setResponsable, setIsLoading, setSearched, setIsInDb, setAddingResponsable, setEditDomicilio, setEditContacto, setRenaperFound }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(searchSchema),
        mode: 'onBlur',
        defaultValues: {
            dni: '',
            sexo: ''
        }
    });

    // Realiza la busqueda
    const onSubmit = async ({dni, sexo}) => {
        // Limpia los resultados de la busqueda anterior
        setRenaperFound(null);
        setResponsable({
            id: '',
            nombre: '',
            apellido: '',
            dni: '',
            sexo: '',
            fecha_nacimiento: '',
            id_domicilio_renaper: '',
            id_domicilio_actual: '',
            domicilio_actual: '',
            telefono: '',
            mail: '',
            fallecido: ''
        });
        setIsLoading(true);
        setSearched(true);
        setIsInDb(false);
        setAddingResponsable(false);
        setEditDomicilio(false);
        setEditContacto(false);

        let foundInDb = false;

        try {
            const data = await getPersona(dni, sexo);
            setResponsable(data);
            foundInDb = true;
            setIsInDb(true);
            setRenaperFound(true);

        } catch (error) {

        }

        if(!foundInDb){
            try {
                const response = await getCiudadano(dni, sexo);
                setResponsable({
                    id: '',
                    nombre: response.nombre,
                    apellido: response.apellido,
                    dni: response.nroDocumento,
                    sexo: response.sexo,
                    fecha_nacimiento: response.fechaNacimiento,
                    id_domicilio_renaper: '',
                    id_domicilio_actual: '',
                    domicilio_actual: response.domicilio,
                    telefono: '',
                    mail: '',
                    fallecido: response.fechaFallecido
                });
                setRenaperFound(true);
            } catch (error) {
                setRenaperFound(false);
            }
        }

        setIsLoading(false);
    };
    
    return (
        <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faMagnifyingGlass} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />
                <Typography variant='h4'>Buscar</Typography>
            </Box>

            <Divider sx={{ mb: 2 }}/>

            <Grid2 container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Grid2>
                    <Controller
                        name='dni'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label='DNI'
                                type='text'
                                fullWidth
                                error={!!errors.dni}
                                helperText={errors.dni?.message}
                                slotProps={{ input: { inputMode: 'numeric', pattern: '\\d{1,8}' } }}
                            />
                        )}
                    />
                </Grid2>

                <Grid2>
                    <Controller
                        name='sexo'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label='Sexo'
                                fullWidth
                                error={!!errors.sexo}
                                helperText={errors.sexo?.message}
                                sx={{ minWidth: 245 }}
                            >
                                <MenuItem value='M'>Masculino</MenuItem>
                                <MenuItem value='F'>Femenino</MenuItem>
                            </TextField>
                        )}
                    />
                </Grid2>
            </Grid2>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>Buscar</Button>
            </Box>
        </Box>
    );
};

export default SearchResponsable;
