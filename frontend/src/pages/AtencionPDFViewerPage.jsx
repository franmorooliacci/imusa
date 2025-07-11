import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAtencionById, getInforme } from '../services/api';
import { Box, CircularProgress, Grid2 } from '@mui/material';
import BackHeader from '../components/BackHeader';

const AtencionPDFViewerPage = () => {
    const { id } = useParams();
    const [atencion, setAtencion] = useState({});
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAtencion = async () => {
            try{
                const atencion = await getAtencionById(id);
                setAtencion(atencion);

                const url = await getInforme(id);
                setUrl(url);
            } catch(error) {

            } finally {
                setLoading(false);
            }
        };

        fetchAtencion();
    }, [id]);

    return (
        <Grid2 container spacing={1} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                {atencion?.animal && (
                    <BackHeader navigateTo = {`/responsable/${atencion.id_responsable}/${atencion.animal.id_especie === 1 ? 'canino' : 'felino'}/${atencion.id_animal}`} />
                )}
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ bgcolor: 'background.paper', p: 2, boxShadow: 3, borderRadius: 4 }}>
                {!loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100vh', flexGrow: 1 }}>
                        <Box 
                            component='iframe'
                            src={url}
                            width='100%'
                            height='100%'
                        />
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

export default AtencionPDFViewerPage;