import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const DeleteButton = ({ onDelete }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleConfirmDelete = () => {
        onDelete();
        handleClose();
    };

    return (
        <Box>
            <Button size='small' variant='contained' color='error' onClick={handleOpen}>
                Eliminar
            </Button>

            <Dialog 
                open={open} 
                onClose={handleClose} 
                aria-labelledby='delete-dialog-title'
                sx={{
                    '& .MuiPaper-root': { borderRadius: '12px', p: 1 }
                }}
            >
                <DialogTitle id='delete-dialog-title' color='error'>Confirmar</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='primary' variant='outlined' size='small'>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color='error' variant='contained' size='small' autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default DeleteButton;
