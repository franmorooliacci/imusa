import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Box, Divider, Typography, Button, FormHelperText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSignature } from '@fortawesome/free-solid-svg-icons';
import { useFormContext } from 'react-hook-form';

const FirmaForm = ({ name }) => {
    const sigCanvas = useRef(null);
    const containerRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 300, height: 150 });
    const [done, setDone] = useState(false);
    const {register, setValue, formState: { errors }} = useFormContext();

    useEffect(() => {
        register(name, { required: 'La firma es obligatoria' });
    }, [name, register]);

    // height hardcodeada 150px
    // width responsive
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                setCanvasSize({ width: containerWidth, height: 150 });
            }
        };

        updateSize();

        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const clearSignature = () => {
        setValue(name, '', { shouldValidate: true });
        setDone(false);
        if (sigCanvas.current) sigCanvas.current.clear();
    };

    const saveSignature = () => {
        if (sigCanvas.current.isEmpty()) {
            setValue(name, '');
            return;
        }
        const trimmed = sigCanvas.current.getTrimmedCanvas();
        const dataUrl = trimmed.toDataURL('image/png');
        const base64 = dataUrl.replace(/^data:image\/.+;base64,/, '');
        setValue(name, base64, { shouldValidate: true });
        setDone(true);
    };

    const error = errors[name]?.message;

    return (
        <Box sx={{ mt: 2 }}>
            <Divider>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faSignature} size="1x" />
                    <Typography variant="h7">Firma</Typography>
                </Box>
            </Divider>
            
            {!done ? (
                <Box>
                    <Box
                        ref={containerRef}
                        sx={{
                            width: '100%',
                            maxWidth: '600px',
                            height: canvasSize.height,
                            border: '1px solid #ccc',
                            mx: 'auto',
                            mt: 2,
                            borderRadius: 4,
                            backgroundColor: 'white',
                            overflow: 'hidden',
                            p: 0
                        }}
                    >
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{
                                width: canvasSize.width,
                                height: canvasSize.height,
                                style: { display: 'block' }
                            }}
                        />
                    </Box>

                    {error && (
                        <FormHelperText error sx={{ textAlign: 'center' }}>
                            {error}
                        </FormHelperText>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
                        <Button variant="outlined" onClick={clearSignature} size='small'>
                            Limpiar
                        </Button>
                        <Button variant="outlined" onClick={saveSignature} size='small'>
                            Guardar
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', mt: 2 }}>
                    <FontAwesomeIcon icon={faCheck} size='4x' style={{ color: '#1976d2' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button 
                            onClick={() => clearSignature()}
                            variant='outlined' 
                            color='primary'
                            size='small'  
                        >
                            Editar
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default FirmaForm;
