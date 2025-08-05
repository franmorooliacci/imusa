import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Box, Button, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const SignaturePad = ({ onChange }: { onChange: (base64: string) => void }) => {
    const sigCanvas = useRef<SignatureCanvas | null>(null);
    const [done, setDone] = useState<boolean>(false);

    const clearSignature = (): void => {
        if (sigCanvas.current) {
            sigCanvas.current.clear();
        }
        onChange('');
        setDone(false);
    };

    const saveSignature = (): void => {
        if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
            clearSignature();
            return;
        }
        const trimmedCanvas = sigCanvas.current.getTrimmedCanvas();
        const dataUrl = trimmedCanvas.toDataURL('image/png');
        const base64 = dataUrl.replace(/^data:image\/.+;base64,/, '');
        onChange(base64);
        setDone(true);
    };

    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 600,
                    aspectRatio: '2 / 1',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    mx: 'auto',
                }}
            >
                <SignatureCanvas
                    ref={sigCanvas}
                    penColor='black'
                    canvasProps={{
                        style: {
                            width: '100%',
                            height: '100%',
                            display: 'block',
                        },
                    }}
                />

                {done && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            bgcolor: 'rgba(255,255,255,0.85)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <FontAwesomeIcon icon={faCheck} size='4x' style={{ color: '#1976d2' }} />
                    </Box>
                )}
            </Box>

            <Stack direction='row' spacing={2} justifyContent='center' sx={{ mt: 2 }}>
                {!done ? (
                    <>
                        <Button size='small' variant='outlined' onClick={clearSignature}>
                            Limpiar
                        </Button>
                        <Button size='small' variant='outlined' onClick={saveSignature}>
                            Guardar
                        </Button>
                    </>
                ) : (
                    <Button size='small' variant='outlined' onClick={clearSignature}>
                        Editar
                    </Button>
                )}
            </Stack>
        </>
    );
};

export default SignaturePad;
