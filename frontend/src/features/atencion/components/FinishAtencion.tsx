import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, Skeleton, TextField, Typography, Stack, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import { faAsterisk, faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertMessage, SkeletonList, BackHeader, SignaturePad } from '@common/components';
import type { AlertSeverity } from '@common/types';
import { Animal, createEmptyAnimal, getAnimalById, updateAnimal } from '@features/animal';
import { createEmptyPersona, getResponsableById, Persona } from '@features/persona';
import { addAtencionInsumo, getAtencionById, sendInformeEmail, updateAtencion } from '../api';
import ResponsableForm from './ResponsableForm';
import AnimalForm from './AnimalForm';
import MedicamentosForm from './MedicamentosForm';
import { Atencion, AtencionInsumo, InsumoOption, KetaminaState, type InsumoOptions } from '../types';
import { createEmptyAtencion } from '../utils/create-empty-atencion';
import { buildAtencionInsumos } from '../utils/build-atencion-insumos';

const initialOptions: InsumoOptions = {
    acepromacina: { selected: false, value: '', id: 1 },
    triancinolona: { selected: false, value: '', id: 2 },
    atropina: { selected: false, value: '', id: 3 },
    dexametasona: { selected: false, value: '', id: 4 },
    diazepan: { selected: false, value: '', id: 5 },
    antibiotico: { selected: false, value: '', id: 6 },
    doxapram: { selected: false, value: '', id: 7 },
    coagulante: { selected: false, value: '', id: 8 },
    ivermectina: { selected: false, value: '', id: 9 },
    complejoVitB: { selected: false, value: '', id: 10 },
    mezcla: { selected: false, value: '', id: 11 },
    dipirona: { selected: false, value: '', id: 12 }
};

const FinishAtencion = () => {
    const { atencionId, responsableId, animalId } = useParams();
    const [atencion, setAtencion] = useState<Atencion>(() => createEmptyAtencion());
    const [responsable, setResponsable] = useState<Persona>(() => createEmptyPersona());
    const [animal, setAnimal] = useState<Animal>(() => createEmptyAnimal());
    const [ketamina, setKetamina] = useState<KetaminaState>({
        prequirurgico: '',
        induccion: '',
        quirofano: ''
    });
    const [firma, setFirma] = useState<string>('');
    const [observaciones, setObservaciones] = useState<string>('');
    const [sendEmail, setSendEmail] = useState<boolean>(false);
    const [options, setOptions] = useState<InsumoOptions>(initialOptions);
    const [loading, setLoading] = useState<boolean>(true);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMsg, setAlertMsg] = useState<string>('');
    const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>('info');
    const [submitting, setSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const email = responsable.mail;
    const emailValid = typeof email === 'string' && isValidEmail(email);


    useEffect(() => {
        const fetchAtencion = async () => {
            const response: Atencion = await getAtencionById(Number(atencionId));
            setAtencion(response);
        };

        const fetchResponsable = async () => {
            const response: Persona = await getResponsableById(Number(responsableId));
            setResponsable(response);
        };

        const fetchAnimal = async () => {
            const response: Animal = await getAnimalById(Number(animalId));
            setAnimal(response);
        };

        const fetchData = async () => {
            try {
                await Promise.all([fetchAtencion(), fetchResponsable(), fetchAnimal()]);
                setLoading(false);
            } catch(error) {
                setAlertSeverity('error');
                setAlertMsg('No se pudo cargar la información. Por favor, inténtalo de nuevo más tarde.');
                setAlertOpen(true);
            }
        };

        fetchData();
        // setTimeout(() => {
        //     fetchData();
        // }, 3000);
    }, [atencionId, responsableId, animalId]);

    const handleOptionChange = (option: keyof InsumoOptions, newValue: Partial<InsumoOption>): void => {
        setOptions(prevOptions => ({
            ...prevOptions,
            [option]: {
                ...prevOptions[option],
                ...newValue
            }
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        if (submitting) return;
        setSubmitting(true);

        const now = new Date();

        try{ 
            const finishedAtencion: Atencion = {
                ...atencion,
                fecha_egreso: now.toISOString().split('T')[0],
                hora_egreso: now.toTimeString().slice(0, 5),
                firma_egreso: firma === '' ? null : firma,
                observaciones: observaciones === '' ? null : observaciones,
                finalizada: 1
            };
                
            await updateAtencion(atencion.id, finishedAtencion);

            const insumos: AtencionInsumo[] = buildAtencionInsumos(options, ketamina, atencion);

            await addAtencionInsumo(insumos);

            await updateAnimal(Number(animalId), { esterilizado: 1 });

            if(sendEmail)
                await sendInformeEmail({ id_atencion: finishedAtencion.id, to_emails: [email] });

            setAlertSeverity('success');
            setAlertMsg('Atención finalizada con éxito!');
            setAlertOpen(true);

            setTimeout(() => {
                navigate('/atenciones');
            }, 3000); // Timeout para que se muestre la alerta

        } catch(error) {
            setAlertSeverity('error');
            setAlertMsg('No se pudo finalizar la atención. Por favor, inténtalo de nuevo más tarde.');
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
    }

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
                        <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                            <FontAwesomeIcon icon={faFileMedical} size='2x' />
                        </Box>
                        <Typography variant='h5'>
                            Finalizar atención
                        </Typography>
                    </Stack>
                </Divider>

                <ResponsableForm responsable = {responsable} />

                <AnimalForm animal = {animal} />

                <MedicamentosForm 
                    options = {options} 
                    onOptionChange = {handleOptionChange} 
                    ketamina = {ketamina}
                    onChange = {setKetamina}
                />

                {/* Observaciones */}
                <Box sx={{ mb: 2 }}>
                    <Divider textAlign='left'>
                        <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
                            <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                                <FontAwesomeIcon icon={faAsterisk} size='1x' />
                            </Box>
                            <Typography variant='subtitle1'>
                                Observaciones
                            </Typography>
                        </Stack>
                    </Divider>
        
                    <TextField
                        label='Observaciones'
                        name='observaciones'
                        value={observaciones}
                        variant='outlined'
                        fullWidth
                        size='small'
                        onChange={(e) => setObservaciones(e.target.value)}
                    />
                </Box>

                <SignaturePad onChange={(base64) => setFirma(base64)} />

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name='sendEmail'
                                checked={sendEmail}
                                onChange={(e) => setSendEmail(e.target.checked)}
                                disabled={!emailValid}
                            />
                        }
                        label={
                            !emailValid
                                ? 'Correo inválido – no se puede enviar el informe'
                                : sendEmail
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
                        type='submit'
                        variant='contained'
                        color='primary'
                        disabled={!firma || submitting}
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

export default FinishAtencion;