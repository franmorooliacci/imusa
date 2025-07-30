import React from 'react';
import { Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFileMedical, faHouse, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
const NAVBAR_HEIGHT = 64;
const DRAWER_WIDTH = 200;

const Sidebar = ({ open, toggleSidebar }) => {

    return (
        <Drawer 
            anchor='left' 
            open={open}
            variant='persistent'
            PaperProps={{
                sx: {
                    // '& .MuiDrawer-paper': {
                    //     width: { xs: 200, sm: 240, md: 280 },
                    //     backgroundColor: (theme) => theme.palette.background.default,
                    //     color: (theme) => theme.palette.text.primary
                    // },
                    width: DRAWER_WIDTH,
                    backgroundColor: (theme) => theme.palette.background.default,
                    color: (theme) => theme.palette.text.primary,
                    borderRight: (theme) => `1px solid ${theme.palette.divider}`, 
                    boxShadow: (theme) => theme.shadows[4]
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, height: NAVBAR_HEIGHT}}>
                <IconButton onClick={() => toggleSidebar(false)} sx={{ color: (theme) => theme.palette.text.primary }}>
                    <FontAwesomeIcon icon={faChevronLeft} size='1x' />
                </IconButton>
            </Box>

            <Divider />

            <List>
                <ListItemButton 
                    component={Link} 
                    to='/' 
                    sx={{ 
                        color: (theme) => theme.palette.text.primary, 
                        mt: -1,
                        gap: 2
                    }}
                >
                    <FontAwesomeIcon icon={faHouse} size='1x' />
                    <ListItemText primary='Inicio' />
                </ListItemButton>

                <Divider variant='middle' />

                <ListItemButton 
                    component={Link} 
                    to='/buscar' 
                    sx={{ 
                        color: (theme) => theme.palette.text.primary, 
                        gap: 2
                    }}
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} size='1x' />
                    <ListItemText primary='Buscar' />
                </ListItemButton>

                <Divider variant='middle' />

                <ListItemButton 
                    component={Link} 
                    to='/atenciones' 
                    sx={{ 
                        color: (theme) => theme.palette.text.primary, 
                        gap: 2
                    }}
                >
                    <FontAwesomeIcon icon={faFileMedical} size='1x' />
                    <ListItemText primary='Atenciones' />
                </ListItemButton>

                <Divider variant='middle' />

                <ListItemButton 
                    component={Link} 
                    to='/usuarios' 
                    sx={{ 
                        color: (theme) => theme.palette.text.primary, 
                        gap: 2
                    }}
                >
                    <FontAwesomeIcon icon={faFileMedical} size='1x' />
                    <ListItemText primary='Usuarios' />
                </ListItemButton>





            </List>
        </Drawer>
    );
}

export default Sidebar;
