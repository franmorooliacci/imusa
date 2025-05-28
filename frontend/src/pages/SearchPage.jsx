import React, { useState } from 'react';
import { Box } from '@mui/material';
import SearchResponsableResults from '../components/SearchResponsableResults';
import SearchResponsable from '../components/SearchResponsable';
import AddResponsable from '../components/AddResponsable';
import EditResponsable from '../components/EditResponsable';

const SearchPage = () => {
    const [responsable, setResponsable] = useState({
        id: '',
        nombre: '',
        apellido: '',
        dni: '',
        sexo: '',
        fecha_nacimiento: '',
        id_domicilio_renaper: '',
        id_domicilio_actual: '',
        domicilio_actual: '',
        telefono: '',
        mail: '',
        firma: '',
        fallecido: ''
    });
    // Indica si se realizó una busqueda
    const [searched, setSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // Indica si la persona esta en la db del imusa
    const [isInDb, setIsInDb] = useState(false);
    // Indica si la persona esta en renaper
    // null = no se realizo la busqueda
    // true = la persona esta en renaper
    // false = la persona no esta en renaper
    const [renaperFound, setRenaperFound] = useState(null)
    const [addingResponsable, setAddingResponsable] = useState(false);
    const [editDomicilio, setEditDomicilio] = useState(false);
    const [editContacto, setEditContacto] = useState(false);
    
    return (
        <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
            <Box sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 4, p: 2 }}>
                <SearchResponsable 
                    setResponsable = {setResponsable}
                    setIsLoading = {setIsLoading}
                    setSearched = {setSearched}
                    isInDb = {isInDb}
                    setIsInDb = {setIsInDb}
                    setAddingResponsable = {setAddingResponsable}
                    setEditDomicilio = {setEditDomicilio}
                    setEditContacto = {setEditContacto}
                    setRenaperFound = {setRenaperFound}
                />
                
                <SearchResponsableResults 
                    searched = {searched} 
                    responsable = {responsable} 
                    isLoading = {isLoading} 
                    isInDb = {isInDb}
                    addingResponsable = {addingResponsable}
                    setAddingResponsable = {setAddingResponsable}
                    editDomicilio = {editDomicilio}
                    setEditDomicilio = {setEditDomicilio}
                    editContacto = {editContacto}
                    setEditContacto = {setEditContacto}
                    renaperFound =  {renaperFound}
                />
                
                {addingResponsable &&
                    <AddResponsable responsable = {responsable} />
                }

                {(editContacto || editDomicilio) &&
                    <EditResponsable 
                        editDomicilio = {editDomicilio}
                        setEditDomicilio = {setEditDomicilio}
                        editContacto = {editContacto}
                        setEditContacto = {setEditContacto}
                        responsable = {responsable}
                        setResponsable = {setResponsable}
                    />
                }

            </Box>
        </Box>
    );
};

export default SearchPage;
