import React, { ReactElement, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@common/context/auth';

const PrivateRoute = ({ children }: { children: ReactElement }): ReactElement | null => {
    const { authTokens } = useContext(AuthContext);

    return authTokens ? children : <Navigate to='/login' />;
};

export default PrivateRoute;
