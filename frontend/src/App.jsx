import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import ResponsablePage from './pages/ResponsablePage';
import addPersonaPage from './pages/addPersonaPage';
import React from 'react';
import Layout from './pages/Layout';
import AnimalPage from './pages/AnimalPage';
import CirugiaPDFViewerPage from './pages/CirugiaPDFViewerPage';
import AddCirugiaPage from './pages/AddCirugiaPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import RedirectOnLogout from './components/RedirectOnLogout';
import AtencionesListPage from './pages/AtencionesListPage';
import FinishCirugiaPage from './pages/FinishCirugiaPage';

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
                                <addPersonaPage />
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
                        path='/cirugia/:id' 
                        element={
                            <PrivateRoute>
                                <CirugiaPDFViewerPage />
                            </PrivateRoute>
                        }
                    />
                    <Route 
                        path='/cirugia/agregar/:responsableId/:animalId' 
                        element={
                            <PrivateRoute>
                                <AddCirugiaPage />
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
                        path='/cirugia/finalizar/:cirugiaId/:responsableId/:animalId' 
                        element={
                            <PrivateRoute>
                                <FinishCirugiaPage />
                            </PrivateRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
