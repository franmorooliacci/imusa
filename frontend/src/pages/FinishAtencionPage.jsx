import { faAsterisk, faFileMedical, faPersonWalkingArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Divider, Skeleton, TextField, Typography, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addAtencionInsumo, getAnimalById, getAtencionById, getResponsableById, updateAtencion } from '../services/api';
import ResponsableDetailsForm from '../components/ResponsableDetailsForm';
import AnimalDetailsForm from '../components/AnimalDetailsForm';
import MedicamentosDetailsForm from '../components/MedicamentosDetailsForm';
import AlertMessage from '../components/AlertMessage';
import SkeletonList from '../components/SkeletonList';
import BackHeader from '../components/BackHeader';

const FinishAtencionPage = () => {
    const { atencionId, responsableId, animalId } = useParams();
    const [formData, setFormData] = useState({
        atencion: {},
        responsable: {},
        animal: {},
        estado_egreso: '',
        ketamina_prequirurgico: '',
        ketamina_induccion: '',
        ketamina_quirofano: '',
        observaciones: ''
    });
    const [options, setOptions] = useState({
        acepromacina: {selected: false, value: '', id: 1},
        triancinolona: {selected: false, value: '', id: 2},
        atropina: {selected: false, value: '', id: 3},
        dexametasona: {selected: false, value: '', id: 4},
        diazepan: {selected: false, value: '', id: 5},
        antibiotico: {selected: false, value: '', id: 6},
        doxapram: {selected: false, value: '', id: 7},
        coagulante: {selected: false, value: '', id: 8},
        ivermectina: {selected: false, value: '', id: 9},
        complejoVitB: {selected: false, value: '', id: 10},
        mezcla: {selected: false, value: '', id: 11},
        dipirona: {selected: false, value: '', id: 12}
    });
    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertSuccess, setAlertSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAtencion = async () => {
            try{
                const response = await getAtencionById(atencionId);
                setFormData(prev => ({
                    ...prev,
                    atencion: response
                }));

            } catch(error){

            }
        };

        const fetchResponsable = async () => {
            try{
                const response = await getResponsableById(responsableId);
                setFormData(prev => ({
                    ...prev,
                    responsable: response
                }));

            } catch(error){

            }
        };

        const fetchAnimal = async () => {
            try{
                const response = await getAnimalById(animalId);
                setFormData(prev => ({
                    ...prev,
                    animal: response
                }));

            } catch(error){

            }
        };

        const fetchData = async () => {
            await Promise.all([fetchAtencion(), fetchResponsable(), fetchAnimal()]);
            setLoading(false);
        };

        fetchData();
        // setTimeout(() => {
        //     fetchData();
        // }, 3000);
    }, [atencionId, responsableId, animalId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (option, newValue) => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            [option]: {
                ...prevOptions[option],
                ...newValue
            }
        }));
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const now = new Date();

        try{ 
            const finishedAtencion = {
                ...formData.atencion,
                fecha_egreso: now.toISOString().split('T')[0],
                hora_egreso: now.toTimeString().slice(0, 5),
                estado_sanitario_egreso: formData.estado_egreso === '' ? null : formData.estado_egreso,
                observaciones_atencion: formData.observaciones === '' ? null : formData.observaciones,
                estado: 1
            };
                
            await updateAtencion(formData.atencion.id, finishedAtencion);

            const insumos = Object.entries(options)
                .filter(([_, insumo]) => insumo.selected && Number(insumo.value) > 0)
                .map(([_, insumo]) => ({
                    id_atencion: formData.atencion.id,
                    id_insumo: insumo.id,
                    cant_ml: Number(insumo.value)
                }))
            ;

            const keta_induccion = Number(formData.ketamina_induccion);
            const keta_prequirurgico = Number(formData.ketamina_prequirurgico);
            const keta_quirofano = Number(formData.ketamina_quirofano);

            if(keta_induccion > 0 || keta_prequirurgico > 0 || keta_quirofano > 0){
                insumos.push({
                    id_atencion: formData.atencion.id,
                    id_insumo: 13,
                    cant_ml: keta_induccion + keta_prequirurgico + keta_quirofano,
                    cant_ml_prequirurgico: keta_prequirurgico === 0 ? null : keta_prequirurgico,
                    cant_ml_induccion: keta_induccion === 0 ? null : keta_induccion,
                    cant_ml_quirofano: keta_quirofano === 0 ? null : keta_quirofano
                });
            }

            await addAtencionInsumo(insumos);

            setAlertSuccess(true);
            setAlertMsg('Atención finalizada con éxito!');
            setAlertOpen(true);

            setTimeout(() => {
                navigate('/atenciones');
            }, 3000); // Timeout para que se muestre la alerta

        } catch(error) {
            setAlertSuccess(false);
            setAlertMsg('No se ha podido finalizar la atención.');
            setAlertOpen(true);
        }

    };

    if(loading){
        return (
            <Box sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 4 }}>
                <Skeleton variant='rounded' height={60} />
                <Divider sx={{ mt: 2, mb: 1 }}/>
                <SkeletonList length={10} random={false} />

                <Divider variant='middle' sx={{ mt: 1, mb: 1 }}/>
                <SkeletonList length={10} random={false} />

                <Divider variant='middle' sx={{ mt: 1, mb: 1 }}/>
                <SkeletonList length={2} random={false} />

                <Divider variant='middle' sx={{ mt: 1, mb: 1 }}/>
                <SkeletonList length={20} random={false} />

                <Divider variant='middle' sx={{ mt: 1, mb: 1 }}/>
                <SkeletonList length={5} random={false} />

                <Divider variant='middle' sx={{ mt: 1, mb: 1 }}/>
                <SkeletonList length={2} random={false} />

            </Box>
        );
    };

    return (
        <Box>
            <BackHeader navigateTo = {'/atenciones'} />

            <Box
                component='form'
                onSubmit={handleSubmit}
                sx={{
                    p: 2, 
                    bgcolor: 'background.paper', 
                    boxShadow: 3, 
                    borderRadius: 4,
                    display: 'flex', 
                    flexDirection: 'column',
                    mt: 2
                }}
            >
                <Divider>
                    <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 1 }}>
                        <FontAwesomeIcon icon={faFileMedical} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />

                        <Typography variant='h5'>
                            Finalizar atención
                        </Typography>
                    </Stack>
                </Divider>

                <ResponsableDetailsForm formData = {formData} />

                <AnimalDetailsForm formData = {formData} readOnly={true} />

                {/* Egreso */}
                <Box sx={{ mb: 2 }}>
                    <Divider textAlign='left'>
                        <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
                            <FontAwesomeIcon icon={faPersonWalkingArrowRight} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />
        
                            <Typography variant='subtitle2'>
                                Egreso
                            </Typography>
                        </Stack>
                    </Divider>

                    <TextField
                        label='Estado sanitario'
                        name='estado_egreso'
                        value={formData.estado_egreso ?? ''}
                        onChange={handleChange}
                        variant='outlined'
                        fullWidth
                        size='small'
                    />
                </Box>

                <MedicamentosDetailsForm 
                    options = {options} 
                    onOptionChange = {handleOptionChange} 
                    formData = {formData}
                    onChange = {handleChange}
                />

                {/* Observaciones */}
                <Box sx={{ mb: 2 }}>
                    <Divider textAlign='left'>
                        <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
                            <FontAwesomeIcon icon={faAsterisk} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />
        
                            <Typography variant='subtitle2'>
                                Observaciones
                            </Typography>
                        </Stack>
                    </Divider>
        
                    <TextField
                        label='Observaciones'
                        placeholder='Observaciones de la atención'
                        name='observaciones'
                        value={formData.observaciones ?? ''}
                        variant='outlined'
                        fullWidth
                        size='small'
                        onChange={handleChange}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button 
                        variant='outlined' 
                        color='error' 
                        onClick={() => navigate('/atenciones')}
                    >
                        Cancelar
                    </Button>
                    <Button type='submit' variant='contained' color='primary'>
                        Finalizar
                    </Button>
                </Box>
            </Box>

            <AlertMessage 
                open = {alertOpen}
                handleClose = {handleCloseAlert}
                message = {alertMsg}
                success = {alertSuccess}
            />
        </Box>
    );
};

export default FinishAtencionPage;