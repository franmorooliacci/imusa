import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import PrivateRoute from '../components/PrivateRoute';
import Layout from '../layouts/Layout';
import SearchPage from '../pages/SearchPage';
import AddResponsablePage from '../pages/AddResponsablePage';
import ResponsablePage from '../pages/ResponsablePage';
import AnimalPage from '../pages/AnimalPage';
import AtencionPDFViewerPage from '../pages/AtencionPDFViewerPage';
import AddAtencionPage from '../pages/AddAtencionPage';
import AtencionesListPage from '../pages/AtencionesListPage';
import FinishAtencionPage from '../pages/FinishAtencionPage';

const AppRoutes = () => {
    return (
        <>
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
                                <AtencionPDFViewerPage />
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
                                <FinishAtencionPage />
                            </PrivateRoute>
                        }
                    />
                </Route>
            </Routes>
        </>
    );
}

export default AppRoutes;