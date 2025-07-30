import React, { useEffect, useState } from 'react';
import { 
    TextField, Button, Box, Divider, 
    Grid2, MenuItem, Typography, CircularProgress, 
    Skeleton, FormControl, InputLabel, Select, 
    Checkbox, ListItemText, FormHelperText 
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faDog } from '@fortawesome/free-solid-svg-icons';
import { useForm, FormProvider, Controller, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { AlertMessage, SkeletonList } from '@common/components';
import type { AlertSeverity } from '@common/types';
import type { Animal, Color, Raza, Tamaño } from '../types';
import { addAnimal, updateAnimal, getRazas, getTamaños, getColores } from '../api';
import { animalSchema, AnimalFormValues } from '../schema';
import { createEmptyAnimal } from '../utils/create-empty-animal';

type Props = {
    mode: string;
    initialData?: Animal;
    onSuccess: (value: any) => void;
    onCancel: (value: any) => void;
};

const AnimalForm = ({ mode, initialData = createEmptyAnimal(), onSuccess, onCancel }: Props) => {
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMsg, setAlertMsg] = useState<string>('');
    const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>('info');
    const [loading, setLoading] = useState<boolean>(true);
    const [razas, setRazas] = useState<Raza[]>([]);
    const [tamaños, setTamaños] = useState<Tamaño[]>([]);
    const [colores, setColores] = useState<Color[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const mapToFormValues = (animal: Animal): AnimalFormValues => {
        return {
            nombre: animal.nombre, 
            sexo: animal.sexo,
            fecha_nacimiento: animal.fecha_nacimiento ? dayjs(animal.fecha_nacimiento).startOf('month').toDate(): undefined,
            id_tamaño: animal.id_tamaño ? animal.id_tamaño : '',
            id_raza: animal.id_raza ? animal.id_raza: '',
            fallecido: animal.fallecido,
            esterilizado: animal.esterilizado,
            adoptado_imusa: animal.adoptado_imusa,
            colores: animal.colores ? animal.colores.map(c => c.id) : []
        } as AnimalFormValues;
    };

    const formatAnimal = (animal: Record<string,any>): Animal => {
        return {
            ...animal,
            id_especie: initialData.id_especie,
            id_responsable: initialData.id_responsable
        } as Animal;
    };

    // React Hook Form
    const methods = useForm<AnimalFormValues>({
        resolver: yupResolver(animalSchema) as Resolver<AnimalFormValues>,
        mode: 'onBlur',
        defaultValues: mapToFormValues(initialData)
    });

    const { control, handleSubmit, reset, formState: { errors } } = methods;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [razasList, tamañosList, coloresList] = await Promise.all([
                    getRazas(initialData.id_especie), 
                    getTamaños(), 
                    getColores()
                ]);

                const razasOrdenadas = razasList.sort((a, b) =>
                    a.nombre.localeCompare(b.nombre, 'es')
                );

                setRazas(razasOrdenadas);
                setTamaños(tamañosList);
                setColores(coloresList);
            } catch (error) {

            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [initialData.id_especie]);

    useEffect(() => {
        if (mode === 'edit') {       
            reset(mapToFormValues(initialData));
        }
    }, [initialData, mode, reset]);

    const onSubmit = async (data: Record<string, any>): Promise<void> => {

        if (submitting) return;
        setSubmitting(true);

        const date = data.fecha_nacimiento;
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        data.fecha_nacimiento = formattedDate;

        try {
            if (mode === 'add') {
                const response: Animal = await addAnimal(formatAnimal(data));

                setAlertSeverity('success');
                setAlertMsg(`${response.id_especie === 1 ? 'Canino' : 'Felino'} agregado con éxito!`);
                setAlertOpen(true);

                setTimeout(() => {
                    onSuccess(`/responsable/${response.id_responsable}/${response.id_especie === 1 ? 'canino' : 'felino'}/${response.id}`);
                }, 3000);
            } else {
                const response = await updateAnimal(initialData.id, data);

                setAlertSeverity('success');
                setAlertMsg(`${data.id_especie === 1 ? 'Canino' : 'Felino'} modificado con éxito!`);
                setAlertOpen(true);
                setTimeout(() => {
                    onSuccess(response);
                }, 3000);
            }
        } catch (error) {
            if (mode === 'add') {
                setAlertSeverity('error');
                setAlertMsg(`No se ha podido agregar ${data.id_especie === 1 ? 'canino' : 'felino'}.`);
                setAlertOpen(true);
                setSubmitting(false);
            } else {
                setAlertSeverity('error');
                setAlertMsg(`No se ha podido modificar ${data.id_especie === 1 ? 'canino' : 'felino'}.`);
                setAlertOpen(true);
                setSubmitting(false);
            }
        }
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormProvider {...methods}>
            <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 4 }} noValidate>

                <Divider>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                    <FontAwesomeIcon icon={initialData.id_especie === 1 ? faDog : faCat} size='2x' />
                    <Typography variant='h5'>
                        {mode === 'add' ? 'Agregar' : 'Editar'} {initialData.id_especie === 1 ? 'Canino' : 'Felino'}
                    </Typography>
                </Box>
                </Divider>

                <Grid2 container spacing={2} sx={{ width: '100%' }}>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <Controller
                            name='nombre'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='Nombre'
                                    error={!!errors.nombre}
                                    helperText={errors.nombre?.message}
                                    fullWidth
                                />
                            )}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <Controller
                            name='sexo'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label='Sexo'
                                    error={!!errors.sexo}
                                    helperText={errors.sexo?.message}
                                    fullWidth
                                >
                                    <MenuItem value='M'>Macho</MenuItem>
                                    <MenuItem value='H'>Hembra</MenuItem>
                                </TextField>
                            )}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <Controller
                            name='fecha_nacimiento'
                            control={control}
                            render={({ field: { ref, value, onChange, ...restField } }) => (
                                <DatePicker
                                    {...restField}
                                    label='Fecha de nacimiento'
                                    views={['year', 'month']}
                                    openTo='year'
                                    format='MM/YYYY'
                                    maxDate={dayjs()}
                                    value={value ? dayjs(value) : null}
                                    onChange={newValue => {
                                        const firstOfMonth = newValue?.startOf('month') ?? null;
                                        onChange(firstOfMonth);
                                    }}
                                    slotProps={{
                                        textField: {
                                            inputRef: ref,
                                            error: !!errors.fecha_nacimiento,
                                            helperText: errors.fecha_nacimiento?.message,
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <TextField
                            label='Especie'
                            value={initialData.id_especie === 1 ? 'Canino' : 'Felino'}
                            slotProps={{ 
                                input: {
                                    readOnly: true 
                                }
                            }}
                            fullWidth
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <Controller
                            name='id_raza'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label='Raza'
                                    error={!!errors.id_raza}
                                    helperText={errors.id_raza?.message}
                                    fullWidth
                                >
                                    {razas.map(r => (
                                        <MenuItem key={r.id} value={r.id}>
                                            {r.nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <Controller
                            name='id_tamaño'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label='Tamaño'
                                    error={!!errors.id_tamaño}
                                    helperText={errors.id_tamaño?.message}
                                    fullWidth
                                >
                                    {tamaños.map(t => (
                                        <MenuItem key={t.id} value={t.id}>
                                            {t.nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                        <FormControl
                            fullWidth
                            error={!!errors.colores}
                        >
                            <InputLabel id='pelaje'>Pelaje (color)</InputLabel>
                            <Controller
                                name='colores'
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId='pelaje'
                                        label='Pelaje (colores)'
                                        multiple
                                        value={Array.isArray(field.value) ? field.value : []}
                                        renderValue={(selected) =>
                                            selected
                                                .map(id => colores.find(c => c.id === id)?.nombre)
                                                .filter(name => !!name)
                                                .join(', ')
                                        }
                                    >
                                        {colores.map(c => (
                                            <MenuItem key={c.id} value={c.id}>
                                                <Checkbox
                                                    checked={Array.isArray(field.value) && field.value.includes(c.id)}
                                                />
                                                <ListItemText primary={c.nombre} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            <FormHelperText>
                                {errors.colores?.message}
                            </FormHelperText>
                        </FormControl>
                    </Grid2>

                    {mode === 'add' && (
                        <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                            <Controller
                                name='esterilizado'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label='Esterilizado'
                                        error={!!errors.esterilizado}
                                        helperText={errors.esterilizado?.message}
                                        fullWidth
                                    >
                                        <MenuItem value={0}>No</MenuItem>
                                        <MenuItem value={1}>Si</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid2>
                    )}
                    
                    {/*
                        <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                            <Controller
                                name='adoptado_imusa'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label='Adoptado en IMuSA'
                                        error={!!errors.adoptado_imusa}
                                        helperText={errors.adoptado_imusa?.message}
                                        fullWidth
                                    >
                                        <MenuItem value={0}>No</MenuItem>
                                        <MenuItem value={1}>Si</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                            <Controller
                                name='fallecido'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label='Fallecido'
                                        error={!!errors.fallecido}
                                        helperText={errors.fallecido?.message}
                                        fullWidth
                                    >
                                        <MenuItem value={0}>No</MenuItem>
                                        <MenuItem value={1}>Si</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid2>
                    */}
                </Grid2>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                    <Button variant='outlined' color='error' onClick={onCancel} disabled={ submitting}>Cancelar</Button>
                    <Button type='submit' variant='contained' disabled={ submitting}>
                        { submitting ? <CircularProgress size={24}/> : mode === 'add' ? 'Agregar' : 'Guardar'}
                    </Button>
                </Box>
            </Box>
            </FormProvider>

            <AlertMessage
                open = {alertOpen}
                handleClose = {() => setAlertOpen(false)}
                message = {alertMsg}
                severity = {alertSeverity}
            />
        </LocalizationProvider>
    );
};

export default AnimalForm;