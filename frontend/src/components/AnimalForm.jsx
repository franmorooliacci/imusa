import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Button, Box, Divider, Grid2, MenuItem, Typography, CircularProgress, Skeleton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faDog } from '@fortawesome/free-solid-svg-icons';
import { animalSchema } from '../validation/animalSchema';
import { addAnimal, updateAnimal, getRazas } from '../services/api';
import AlertMessage from './AlertMessage';
import SkeletonList from './SkeletonList';

/**
 * Props:
 * - mode: 'add' | 'edit'
 * - initialData: object or {}
 * - especie: 'canino' | 'felino'
 * - onSuccess: callback after add/update
 * - onCancel: callback when cancelling
 */

const AnimalForm = ({ mode, initialData = {}, onSuccess, onCancel }) => {
    // React Hook Form
    const methods = useForm({
        resolver: yupResolver(animalSchema),
        mode: 'onBlur',
        defaultValues: {
            nombre: '', 
            sexo: '', 
            año_nacimiento: '',
            pelaje_color: '',
            id_especie: '', 
            id_raza: '',
            fallecido: 0,
            id_responsable: '',
            ...initialData
        }
    });

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = methods;

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [razas, setRazas] = useState([]);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const fetchRazas = async () => {
            try {
                const lista = await getRazas(initialData.id_especie);
                setRazas(lista);
                setLoading(false);
            } catch (error) {
            }
        };
        
        fetchRazas();
    }, [initialData.id_especie]);

    useEffect(() => {
        if (mode === 'edit') reset({ ...initialData });
    }, [initialData, mode, reset]);

    const onSubmit = async (data) => {

        try {
            if (mode === 'add') {
                const response = await addAnimal(data);

                setAlertSuccess(true);
                setAlertMsg(`${data.id_especie === 1 ? 'Canino' : 'Felino'} agregado con éxito!`);
                setAlertOpen(true);

                setTimeout(() => {
                    onSuccess(`/responsable/${data.id_responsable}/${data.id_especie === 1 ? 'canino' : 'felino'}/${response.id_animal}`);
                }, 3000);
            } else {
                const response = await updateAnimal(initialData.id_animal, data);

                setAlertSuccess(true);
                setAlertMsg(`${data.id_especie === 1 ? 'Canino' : 'Felino'} modificado con éxito!`);
                setAlertOpen(true);
                setTimeout(() => {
                    onSuccess(response);
                }, 3000);
            }
        } catch (error) {
            if (mode === 'add') {
                setAlertSuccess(false);
                setAlertMsg(`No se ha podido agregar ${data.id_especie === 1 ? 'canino' : 'felino'}.`);
                setAlertOpen(true);
            } else {
                setAlertSuccess(false);
                setAlertMsg(`No se ha podido modificar ${data.id_especie === 1 ? 'canino' : 'felino'}.`);
                setAlertOpen(true);
            }
        }
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    if (loading) {
        return (
            <Box sx={{ bgcolor: 'background.paper', p: 2, boxShadow: 3, borderRadius: 4, flexGrow: 1 }}>
                <Skeleton variant='rounded' height={60} />
                <Divider sx={{ mt: 2, mb: 2 }}/>
                <SkeletonList length={10} random={false} />
            </Box>
        );
    }

    return (
        <Box>
            <FormProvider {...methods}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 4 }} noValidate>

                <Divider>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                    <FontAwesomeIcon icon={initialData.id_especie === 1 ? faDog : faCat} size="2x" />
                    <Typography variant="h5">
                        {mode === 'add' ? 'Agregar' : 'Editar'} {initialData.id_especie === 1 ? 'Canino' : 'Felino'}
                    </Typography>
                </Box>
                </Divider>

                <Grid2 container spacing={2} sx={{ width: '100%' }}>
                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <Controller
                            name="id_especie"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Especie"
                                    value={initialData.id_especie === 1 ? 'Canino' : 'Felino'}
                                    slotProps={{ readOnly: true }}
                                    fullWidth
                                />
                            )}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <Controller
                            name="id_raza"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Raza"
                                    error={!!errors.id_raza}
                                    helperText={errors.id_raza?.message}
                                    fullWidth
                                >
                                    {razas.map(r => (
                                        <MenuItem key={r.id_raza} value={r.id_raza}>
                                        {r.nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <Controller
                            name="nombre"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nombre"
                                    error={!!errors.nombre}
                                    helperText={errors.nombre?.message}
                                    fullWidth
                                />
                            )}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <Controller
                            name="sexo"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Sexo"
                                    error={!!errors.sexo}
                                    helperText={errors.sexo?.message}
                                    fullWidth
                                >
                                    <MenuItem value="M">Macho</MenuItem>
                                    <MenuItem value="H">Hembra</MenuItem>
                                </TextField>
                            )}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <Controller
                            name="año_nacimiento"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    label="Año de nacimiento"
                                    error={!!errors.año_nacimiento}
                                    helperText={errors.año_nacimiento?.message}
                                    fullWidth
                                    slotProps={{ max: currentYear }}
                                    sx={{
                                        '& input[type=number]': {
                                        MozAppearance: 'textfield',
                                        },
                                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                            WebkitAppearance: 'none',
                                            margin: 0,
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <Controller
                            name="pelaje_color"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Pelaje (color)"
                                    error={!!errors.pelaje_color}
                                    helperText={errors.pelaje_color?.message}
                                    fullWidth
                                />
                            )}
                        />
                    </Grid2>
                </Grid2>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                <Button variant="outlined" color="error" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24}/> : mode === 'add' ? 'Agregar' : 'Guardar'}
                </Button>
                </Box>
            </Box>
            </FormProvider>

            <AlertMessage
                open = {alertOpen}
                handleClose = {handleCloseAlert}
                message = {alertMsg}
                success = {alertSuccess}
            />
        </Box>
    );
}

export default AnimalForm;