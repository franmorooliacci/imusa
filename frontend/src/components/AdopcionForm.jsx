// AdopcionForm.jsx
import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import ImageUploader from './ImageUploader';

const AdopcionForm = ({ mode, rowData, setRowData, setAdopcionMode, imagesValue, onImagesChange, onFormSubmit }) => {
    const [descripcion, setDescripcion] = useState(
        rowData.descripcion_adopcion || ''
    );

    const handleDescripcionChange = (e) => {
        setDescripcion(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFormSubmit({
            idInstitucionAnimal: rowData.id,
            descripcion,
            images: imagesValue
        });
    };

    return (
        <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{
                bgcolor: 'background.paper',
                p: 4,
                borderRadius: 4,
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            <ImageUploader
                imagesValue={imagesValue}
                onImagesChange={onImagesChange}
            />

            <TextField
                label='Descripción'
                value={descripcion}
                onChange={handleDescripcionChange}
                fullWidth
                size='small'
                multiline
                sx={{ mt: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: -2 }}>
                <Button
                    variant='outlined'
                    color='error'
                    onClick={() => {
                        setRowData({});
                        setAdopcionMode(false);
                    }}
                >
                    Cancelar
                </Button>

                <Button type='submit' variant='contained' color='primary'>
                    {mode === 'edit' ? 'Actualizar' : 'Agregar'}
                </Button>
            </Box>
        </Box>
    );
};

export default AdopcionForm;
