import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const BackHeader = ({ navigateTo }: { navigateTo: string }) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: '100%',
                bgcolor: 'background.paper',
                p: 1,
                boxShadow: 3,
                borderRadius: 4
            }}
        >
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
                <FontAwesomeIcon icon={faArrowLeft} size="1x" />
            </IconButton>
        </Box>
    );
};

export default BackHeader;
