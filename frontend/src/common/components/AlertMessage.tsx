import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import type { AlertSeverity } from '@common/types';

type Props = {
    open: boolean;
    handleClose: () => void;
    message: string;
    severity: AlertSeverity;
};

const AlertMessage = ({ open, handleClose, message, severity }: Props) => {

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
};

export default AlertMessage;