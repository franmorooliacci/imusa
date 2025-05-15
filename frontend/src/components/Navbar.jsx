import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, IconButton, FormControl, InputLabel, Select, MenuItem, Button, Typography, Menu } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
    const { efectores, selectedEfectorId, setSelectedEfectorId, username, logout } = useContext(AuthContext);
    const [menu, setMenu] = useState(null);

    const handleMenuOpen = (event) => {
        setMenu(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenu(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    const handleChange = (event) => {
        setSelectedEfectorId(event.target.value);
    };

    return (
        <AppBar
            position='fixed'
            sx={{
                backgroundColor: (theme) => theme.palette.background.default,
                color:           (theme) => theme.palette.text.primary,
                boxShadow:       (theme) => theme.shadows[4],
                borderBottom:    (theme) => `1px solid ${theme.palette.divider}`
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

                <IconButton
                    edge='start'
                    onClick={() => toggleSidebar(true)}
                    sx={{ color: (theme) => theme.palette.text.primary }}
                >
                    <FontAwesomeIcon icon={faBars} size='1x' />
                </IconButton>

                <FormControl size='small'sx={{ mt: 1, maxWidth: '50vw' }}>
                    <InputLabel id='efector-select-label'>Efector</InputLabel>
                    <Select
                        labelId='efector-select-label'
                        value={selectedEfectorId}
                        label='Efector'
                        onChange={handleChange}
                    >
                        {efectores.map((e) => (
                            <MenuItem key={e.id_efector} value={e.id_efector}>
                                {e.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    onClick={handleMenuOpen}
                    sx={{
                        textTransform: 'none',
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': {
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faUser} size='1x' />
                    <Typography variant='body1'>
                        {username}
                    </Typography>
                </Button>

                <Menu
                    anchorEl={menu}
                    open={Boolean(menu)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleLogout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ marginRight: 8 }} size='1x' />
                        Cerrar sesión
                    </MenuItem>
                </Menu>

            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
