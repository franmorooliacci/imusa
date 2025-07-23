import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RedirectOnLogout from '@common/components/RedirectOnLogout';
import AppRoutes from '@common/routes/AppRoutes';

const App = () => {
    return (
        <BrowserRouter>
            <RedirectOnLogout />
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;
