import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const AlertMessage = ({ open, handleClose, message, success }) => {

    return (
        <Snackbar 
            open={open} 
            autoHideDuration={3000} 
            onClose={handleClose} 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={handleClose}
                severity={success ? 'success' : 'error' }
                variant='filled'
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
);
}

export default AlertMessage;
