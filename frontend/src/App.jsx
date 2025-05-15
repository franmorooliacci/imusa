import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import ResponsablePage from './pages/ResponsablePage';
import AddResponsablePage from './pages/AddResponsablePage';
import React from 'react';
import Layout from './pages/Layout';
import AnimalPage from './pages/AnimalPage';
import AtencionDetailsPage from './pages/AtencionDetailsPage';
import AddAtencionPage from './pages/AddAtencionPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import RedirectOnLogout from './components/RedirectOnLogout';
import AtencionesListPage from './pages/AtencionesListPage';
import AtencionPage from './pages/AtencionPage';

const App = () => {

    return (
        <BrowserRouter>
            <RedirectOnLogout />
            <Routes>
                <Route path='/login' element={<LoginPage />} />
                
                <Route 
                    element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }
                >
                    <Route path='/' element={<Navigate to='/buscar' />} />
                    <Route 
                        path='/buscar' 
                        element={
                            <PrivateRoute>
                                <SearchPage />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path='/responsable/agregar' 
                        element={
                            <PrivateRoute>        
                                <AddResponsablePage />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path='/responsable/:id' 
                        element={
                            <PrivateRoute>
                                <ResponsablePage />
                            </PrivateRoute>
                        }
                    />
                    <Route 
                        path='/responsable/:responsableId/:especie/:animalId' 
                        element={
                            <PrivateRoute>            
                                <AnimalPage />
                            </PrivateRoute>
                        }
                    />
                    <Route 
                        path='/atencion/:id' 
                        element={
                            <PrivateRoute>
                                <AtencionDetailsPage />
                            </PrivateRoute>
                        }
                    />
                    <Route 
                        path='/atencion/agregar/:responsableId/:animalId' 
                        element={
                            <PrivateRoute>
                                <AddAtencionPage />
                            </PrivateRoute>
                        }
                    />
                    <Route 
                        path='/atenciones' 
                        element={
                            <PrivateRoute>
                                <AtencionesListPage />
                            </PrivateRoute>
                        }
                    />
                    <Route 
                        path='/atencion/finalizar/:atencionId/:responsableId/:animalId' 
                        element={
                            <PrivateRoute>
                                <AtencionPage />
                            </PrivateRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
