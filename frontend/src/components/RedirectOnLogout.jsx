import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const RedirectOnLogout = () => {
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authTokens) {
            navigate('/login');
        }
    }, [authTokens, navigate]);

    return null;
};

export default RedirectOnLogout;
