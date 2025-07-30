import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Box, InputAdornment, Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext, loginUser } from '@common/context/auth';

const LoginPage = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const { initializeAuth } = useContext(AuthContext);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const data = await loginUser(username, password);
            initializeAuth(data);
            navigate('/');
        } catch (error) {
            setAlertOpen(true);
        }
    };

    return (
        <Box
            component="main"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh'
            }}
        >
            <Box 
                component='form'
                onSubmit={handleSubmit}
                sx={{
                    p: 2,
                    bgcolor: 'background.paper', 
                    boxShadow: 3, 
                    borderRadius: 4,
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '444px',
                    gap: 2
                }}
            >
                <Typography variant='h4'>
                    Iniciar sesión
                </Typography>

                <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column', width: '100%', pl: 1, pr: 1 }}>
                    <TextField
                        fullWidth
                        label='Usuario'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Usuario'
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ mb: 1 }}>
                                        <FontAwesomeIcon icon={faAddressCard} size='1x' />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    <TextField
                        fullWidth
                        label='Contraseña'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Contraseña'
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ mb: 1 }}>
                                        <FontAwesomeIcon icon={faLock} size='1x' />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </Box>

                <Box>
                    <Button
                        type='submit'
                        variant='contained'
                        fullWidth
                    >
                        Ingresar
                    </Button>
                </Box>

                {alertOpen && (
                    <Alert severity="error" sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        Usuario o contraseña incorrectos.
                    </Alert>
                )}
            </Box>
        </Box>
    );
};

export default LoginPage;