import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RedirectOnLogout from './components/RedirectOnLogout';
import AppRoutes from './routes/AppRoutes';

const App = () => {
    return (
        <BrowserRouter>
            <RedirectOnLogout />
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;
