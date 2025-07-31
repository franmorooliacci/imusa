import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const BackHeader = ({ navigateTo, actions = [] }: { navigateTo: string, actions?: React.ReactNode[] }) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                bgcolor: 'background.paper',
                p: 1,
                boxShadow: 3,
                borderRadius: 4
            }}
        >
            <Tooltip title='Volver' arrow>
                <IconButton
                    onClick={() => navigate(navigateTo)}
                    sx={{
                        ml: 1,
                        color: (theme) => theme.palette.text.primary,
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            transform: 'scale(1.1)',
                            transition: 'transform 0.2s',
                        },
                    }}
                >
                    <FontAwesomeIcon icon={faArrowLeft} size='1x' />
                </IconButton>
            </Tooltip>

            <Box sx={{ flexGrow: 1 }} />

            {actions.map((btn, i) => (
                <Box key={i} sx={{ mr: 1 }}>
                    {btn}
                </Box>
            ))}
        </Box>
    );
};

export default BackHeader;
