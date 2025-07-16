import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import type { Theme } from '@mui/material/styles';

const NAVBAR_HEIGHT = 64;
const DRAWER_WIDTH = 200;

const Layout = () => {
    const [open, setOpen] = useState<boolean>(false);

    const toggleSidebar = (open: boolean): void => {
        setOpen(open);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Navbar toggleSidebar={() => toggleSidebar(!open)} />
            <Sidebar open={open} toggleSidebar={toggleSidebar} />
            <Box 
                sx={(theme: Theme) => ({
                    flexGrow: 1, 
                    pt: 2,
                    pr: 1,
                    pb: 2,
                    pl: 1,
                    mt: `${NAVBAR_HEIGHT}px`,
                    transition: (theme) => theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    marginLeft: open ? `${DRAWER_WIDTH}px` : 0,
                    width: open ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
                    [theme.breakpoints.down('sm')]: {
                        marginLeft: 0,
                        width: '100%'
                    },
                })}
            >
                <Outlet />
            </Box>
        </Box>
    );
}

export default Layout;
