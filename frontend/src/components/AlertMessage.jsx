import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const AlertMessage = ({ open, handleClose, message, severity }) => {

    return (
        <Snackbar 
            open={open} 
            autoHideDuration={3000} 
            onClose={handleClose} 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                sx={{ 
                    width: '100%', 
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    boxShadow: 3
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}

export default AlertMessage;
