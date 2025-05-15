import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAtencionById, getInsumosByIdAtencion, getProfesionalById, getResponsableById } from '../services/api';
import { Box, CircularProgress, Grid2, Typography } from '@mui/material';
import PdfViewer from '../components/PdfViewer';
import BackHeader from '../components/BackHeader';

const AtencionDetailsPage = () => {
    const { id } = useParams();
    const [ids, setIds] = useState({ id_responsable: '', id_animal: '', id_especie: ''});
    const [pdfData, setPdfData] = useState(null);
    const [efector, setEfector] = useState('');
    const [loading, setLoading] = useState(true);

    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };
    
    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        // Variable auxiliar para mapear los nombres de los campos de insumos del pdf
        // con el id que le corresponde a cada insumo en la db
        const insumoMap = {
            1: 'acepromacina',
            2: 'triancinolona',
            3: 'atropina',
            4: 'dexametasona',
            5: 'diazepan',
            6: 'antibiotico',
            7: 'doxapram',
            8: 'coagulante',
            9: 'ivermectina',
            10: 'complejo_vitb',
            11: 'mezcla',
            12: 'dipirona',
            13: 'ketamina'
        };

        const fetchData = async () => {
            try{
                // Traigo la atencion a mostrar
                const atencion = await getAtencionById(id);
                setEfector(atencion.efector_nombre);

                // Guardo los ids para navegar a la pagina anterior
                setIds({
                    id_responsable: atencion.id_responsable, 
                    id_animal: atencion.id_animal,
                    id_especie: atencion.id_especie
                });

                // Traigo datos del responsable, profesional e insumos para completar al pdf
                const responsable = await getResponsableById(atencion.id_responsable);
                const profesional = await getProfesionalById(atencion.id_profesional);
                const insumos = await getInsumosByIdAtencion({id_atencion: id});

                // Mapeo los valores de los insumos usados en la atencion
                const newState = {
                    acepromacina: '',
                    triancinolona: '',
                    atropina: '',
                    dexametasona: '',
                    diazepan: '',
                    antibiotico: '',
                    doxapram: '',
                    coagulante: '',
                    ivermectina: '',
                    complejo_vitb: '',
                    mezcla: '',
                    dipirona: '',
                    ketamina_prequirurgico: '',
                    ketamina_induccion: '',
                    ketamina_quirofano: '',
                };

                insumos.forEach((insumo) => {
                    const name = insumoMap[insumo.id_insumo];
                
                    if (!name) return;
                
                    if (name.startsWith('ketamina')) {
                        newState.ketamina_prequirurgico = String(insumo.cant_ml_prequirurgico ?? '');
                        newState.ketamina_induccion = String(insumo.cant_ml_induccion ?? '');
                        newState.ketamina_quirofano = String(insumo.cant_ml_quirofano ?? '');
                    } else {
                        newState[name] = String(insumo.cant_ml ?? '');
                    }
                });

                // Seteo los valores del pdf
                setPdfData(prev => ({
                    ...prev,
                    recogido_imusa: 'NO',
                    nombre_completo: responsable.nombre + ' ' + responsable.apellido,
                    domicilio: `${responsable.domicilio_actual.calle} ${responsable.domicilio_actual.altura}${responsable.domicilio_actual.bis === 0 ? '' : ' BIS'}${responsable.domicilio_actual.letra ? ` ${responsable.domicilio_actual.letra}` : ''}${responsable.domicilio_actual.piso ? ` ${responsable.domicilio_actual.piso}` : ''}${responsable.domicilio_actual.depto ? ` ${responsable.domicilio_actual.depto}` : ''}${responsable.domicilio_actual.monoblock ? ` ${responsable.domicilio_actual.monoblock}` : ''}`,
                    telefono: responsable.telefono,
                    dni: String(responsable.dni),
                    barrio: responsable.domicilio_actual.barrio,
                    distrito: responsable.domicilio_actual.distrito,
                    especie: atencion.id_especie === 1 ? 'Canino' : 'Felino',
                    edad: atencion.animal.edad === 1 ? `${atencion.animal.edad} año` : `${atencion.animal.edad} años`,
                    raza: atencion.animal.raza_nombre,
                    señas_particulares: atencion.señas_particulares,
                    observaciones_reseña: atencion.observaciones_animal,
                    sexo: atencion.animal.sexo === 'M' ? 'Macho' : 'Hembra',
                    pelaje: atencion.animal.pelaje_color,
                    tamaño: atencion.animal.raza_tamaño.charAt(0).toUpperCase() + atencion.animal.raza_tamaño.slice(1),
                    nombre_animal: atencion.animal.nombre,
                    firma_responsable_autorizacion: responsable.firma,
                    aclaracion: responsable.nombre + ' ' + responsable.apellido,
                    fecha_autorizacion: formatDate(atencion.fecha_ingreso),
                    hora_autorizacion: formatTime(atencion.hora_ingreso),
                    nombre_autorizacion: responsable.nombre + ' ' + responsable.apellido,
                    fecha_egreso: formatDate(atencion.fecha_egreso),
                    hora_egreso: formatTime(atencion.hora_egreso),
                    firma_responsable_egreso: responsable.firma,
                    estado_egreso: atencion.estado_sanitario_egreso,
                    firma_veterinario_egreso: profesional.firma,
                    observaciones: atencion.observaciones_atencion,
                    veterinario_nombre: profesional.nombre + ' ' + profesional.apellido,
                    firma_veterinario: profesional.firma,
                    ...newState
                }));

            } catch(error) {

            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // setTimeout(() => {
        //     fetchData();
        // }, 3000);
    }, [id]);

    return (
        <Grid2 container spacing={1} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <BackHeader navigateTo = {`/responsable/${ids.id_responsable}/${ids.id_especie === 1 ? 'canino' : 'felino'}/${ids.id_animal}`} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ bgcolor: 'background.paper', p: 2, boxShadow: 3, borderRadius: 4 }}>
                {!loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100vh', flexGrow: 1 }}>
                        <Typography variant='body1' sx={{ display: 'flex', justifyContent: 'center' }}>
                            <strong>Efector:</strong>{` ${efector}`}
                        </Typography>
                        <PdfViewer formData = {pdfData} />
                    </Box>
                    
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress size={60} />
                    </Box>
                )}
            </Grid2>
        </Grid2>
    );
};

export default AtencionDetailsPage;