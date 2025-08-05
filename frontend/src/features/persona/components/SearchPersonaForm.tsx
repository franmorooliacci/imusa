import React from 'react';
import { TextField, Button, Typography, Box, Grid2, MenuItem, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useForm, Controller, Resolver, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { Setter } from '@common/types';
import { createEmptyPersona, createEmptyPersonaDTO } from '../utils';
import { getCiudadano, getPersona } from '../api';
import { search, SearchFormInputs } from '../schemas';
import { Persona, PersonaDTO } from '../types';

type Props = {
    setNewPersona: Setter<PersonaDTO>;
    setExistingPersona: Setter<Persona>;
    setIsLoading: Setter<boolean>;
    setSearched: Setter<boolean>;
    setIsInDb: Setter<boolean>;
    setAddingResponsable: Setter<boolean>;
    setEditDomicilio: Setter<boolean>;
    setEditContacto: Setter<boolean>;
    setRenaperFound: Setter<boolean | null>;
    setFallecido: Setter<boolean>;
    setDomicilioActual: Setter<string>;
};

const SearchPersonaForm = (props: Props) => {
    const {
        setNewPersona,
        setExistingPersona,
        setIsLoading, 
        setSearched,
        setIsInDb,
        setAddingResponsable,
        setEditDomicilio,
        setEditContacto,
        setRenaperFound,
        setFallecido,
        setDomicilioActual
    } = props;
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<SearchFormInputs>({
        resolver: yupResolver(search)as Resolver<SearchFormInputs>,
        mode: 'onBlur',
        defaultValues: {
            dni: '',
            sexo: ''
        }
    });

    // Realiza la busqueda
    const onSubmit: SubmitHandler<SearchFormInputs> = async ({ dni, sexo }) => {
        // Limpia los resultados de la busqueda anterior
        setRenaperFound(null);
        setNewPersona(() => createEmptyPersonaDTO());
        setExistingPersona(() => createEmptyPersona());
        setIsLoading(true);
        setSearched(true);
        setIsInDb(false);
        setAddingResponsable(false);
        setEditDomicilio(false);
        setEditContacto(false);
        setDomicilioActual('');
        setFallecido(false);

        let foundInDb = false;

        try {
            const data = await getPersona(dni, sexo);
            setExistingPersona(data);
            foundInDb = true;
            setIsInDb(true);
            setRenaperFound(true);

        } catch (error) {
            console.warn('La persona no esta en la base de datos del IMuSA');
        }

        if(!foundInDb){
            try {
                const response = await getCiudadano(dni, sexo);
                setNewPersona({
                    nombre: response.nombre as string,
                    apellido: response.apellido as string,
                    dni: response.nroDocumento as number,
                    sexo: response.sexo as string,
                    fecha_nacimiento: response.fechaNacimiento as string,
                    id_domicilio_renaper: 0,
                    id_domicilio_actual: 0,
                    telefono: '',
                    mail: ''
                });
                if (response.fechaFallecido) setFallecido(true);
                setDomicilioActual(response.domicilio as string);
                setRenaperFound(true);
            } catch (error) {
                setRenaperFound(false);
            }
        }

        setIsLoading(false);
    };
    
    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Box sx={{ color: theme => theme.palette.text.primary }}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} size='2x' />
                </Box>
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
                                slotProps={{ input: { inputMode: 'numeric', pattern: '\\d{1,8}' } as any }}
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
                <Button 
                    variant='contained' 
                    color='primary' 
                    disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                >
                    Buscar
                </Button>
            </Box>
        </Box>
    );
};

export default SearchPersonaForm;