import { faAsterisk, faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Divider, Skeleton, TextField, Typography, Stack, FormControlLabel, Checkbox } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addCirugiaInsumo, getAnimalById, getCirugiaById, getPersonaById, sendInformeEmail, updateAnimal, updateCirugia, getEstadosEgreso } from '../services/api';
import ResponsableDetailsForm from '../components/ResponsableDetailsForm';
import AnimalDetailsForm from '../components/AnimalDetailsForm';
import MedicamentosDetailsForm from '../components/MedicamentosDetailsForm';
import AlertMessage from '../components/AlertMessage';
import SkeletonList from '../components/SkeletonList';
import BackHeader from '../components/BackHeader';
import FirmaForm from '../components/FirmaForm';
import { CircularProgress, Select, MenuItem } from '@mui/material';


const FinishCirugiaPage = () => {
    const { cirugiaId, responsableId, animalId } = useParams();
    const [formData, setFormData] = useState({
        cirugia: {},
        responsable: {},
        animal: {},
        ketamina_prequirurgico: '',
        ketamina_induccion: '',
        ketamina_quirofano: '',
        firma_egreso: '',
        observaciones: '',
        id_estado_egreso: '',
        sendEmail: false
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
    const [submitting, setSubmitting] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [estadosEgreso, setEstadosEgreso] = useState([]); 
    
    const navigate = useNavigate();

    const isValidEmail = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const email = formData.responsable.mail;
    const emailValid = isValidEmail(email);

    useEffect(() => {
        const fetchCirugia = async () => {
            try{
                const response = await getCirugiaById(cirugiaId);
                setFormData(prev => ({
                    ...prev,
                    cirugia: response
                }));

            } catch(error){

            }
        };

        const fetchResponsable = async () => {
            try{
                const response = await getPersonaById(responsableId);
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
            await Promise.all([fetchCirugia(), fetchResponsable(), fetchAnimal()]);
            setLoading(false);
        };

        fetchData();
        // setTimeout(() => {
        //     fetchData();
        // }, 3000);
    }, [cirugiaId, responsableId, animalId]);

    useEffect(() => {
        const fetchEstados = async () => {
            try {
                const estados = await getEstadosEgreso();
                setEstadosEgreso(estados);

            } catch (error) {

            }
        };

        fetchEstados();
    }, []);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (submitting) return;
        setSubmitting(true);

        const now = new Date();

        try{ 
            const finishedCirugia = {
                ...formData.cirugia,
                hora_egreso: now.toTimeString().slice(0, 5),
                firma_egreso: formData.firma_egreso === '' ? null : formData.firma_egreso,
                observaciones: formData.observaciones === '' ? null : formData.observaciones,
                id_estado_egreso: formData.id_estado_egreso,
                finalizada: 1
            };
                
            await updateCirugia(formData.cirugia.id, finishedCirugia);

            const insumos = Object.entries(options)
                .filter(([_, insumo]) => insumo.selected && Number(insumo.value) > 0)
                .map(([_, insumo]) => ({
                    id_cirugia: formData.cirugia.id,
                    id_insumo: insumo.id,
                    cant_ml: Number(insumo.value)
                }))
            ;

            const keta_induccion = Number(formData.ketamina_induccion);
            const keta_prequirurgico = Number(formData.ketamina_prequirurgico);
            const keta_quirofano = Number(formData.ketamina_quirofano);

            if(keta_induccion > 0 || keta_prequirurgico > 0 || keta_quirofano > 0){
                insumos.push({
                    id_cirugia: formData.cirugia.id,
                    id_insumo: 13,
                    cant_ml: keta_induccion + keta_prequirurgico + keta_quirofano,
                    cant_ml_prequirurgico: keta_prequirurgico === 0 ? null : keta_prequirurgico,
                    cant_ml_induccion: keta_induccion === 0 ? null : keta_induccion,
                    cant_ml_quirofano: keta_quirofano === 0 ? null : keta_quirofano
                });
            }
            await addCirugiaInsumo(insumos);

            await updateAnimal(animalId, { esterilizado: 1 });

            if(formData.sendEmail)
                await sendInformeEmail({ id_cirugia: finishedCirugia.id, to_emails: [email] });

            setAlertSeverity('success');
            setAlertMsg('Atención finalizada con éxito!');
            setAlertOpen(true);

            setTimeout(() => {
                navigate('/atenciones');
            }, 3000); // Timeout para que se muestre la alerta

        } catch(error) {
            setAlertSeverity('error');
            setAlertMsg('No se ha podido finalizar la atención.');
            setAlertOpen(true);
            setSubmitting(false);
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
                        name='observaciones'
                        value={formData.observaciones ?? ''}
                        variant='outlined'
                        fullWidth
                        size='small'
                        onChange={handleChange}
                    />
                </Box>

                                <Box sx={{ mb: 2 }}>
                    <Divider textAlign='left'>
                        <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
                            <FontAwesomeIcon icon={faAsterisk} size='1x' sx={{ color: (theme) => theme.palette.text.primary }} />
        
                            <Typography variant='subtitle2'>
                                Estado Egreso
                            </Typography>
                        </Stack>
                    </Divider>
                    <Select
                        labelId="estado-egreso-label"
                        id="estado-egreso"
                        value={formData.cirugia?.id_estado_egreso || ''}
                        label="Estado egreso"
                        onChange={(e) =>
                            setFormData(prev => ({
                                ...prev,
                                cirugia: {
                                    ...prev.cirugia,
                                    id_estado_egreso: e.target.value
                                }
                            }))
                        }
                    >
                        {estadosEgreso.map((tipo) => (
                            <MenuItem key={tipo.id} value={tipo.id}>
                                {tipo.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                <FirmaForm
                    onChange={(base64) =>
                        setFormData(prev => ({
                            ...prev,
                            firma_egreso: base64
                        }))
                    }
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name='sendEmail'
                                checked={formData.sendEmail}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        sendEmail: e.target.checked
                                    }))
                                }
                                disabled={!emailValid}
                            />
                        }
                        label={
                            !emailValid
                                ? 'Correo inválido – no se puede enviar el informe'
                                : formData.sendEmail
                                    ? `Enviar a ${email}`
                                    : 'Enviar informe por correo'
                        }
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <Button 
                        variant='outlined' 
                        color='error' 
                        onClick={() => navigate('/atenciones')}
                    >
                        Cancelar
                    </Button>
                    
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!formData.firma_egreso || !formData.cirugia.id_estado_egreso || submitting}
                        >
                         { submitting ? <CircularProgress size={24}  /> : 'Finalizar'}
                        </Button>
                </Box>
            </Box>

            <AlertMessage 
                open = {alertOpen}
                handleClose = {() => setAlertOpen(false)}
                message = {alertMsg}
                severity = {alertSeverity}
            />
        </Box>
    );

};

export default FinishCirugiaPage;