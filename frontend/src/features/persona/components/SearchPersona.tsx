import React, { useState } from 'react';
import { Box } from '@mui/material';
import type { AlertSeverity } from '@common/types';
import { AlertMessage } from '@common/components';
import { createEmptyPersona, createEmptyPersonaDTO } from '../utils';
import type { Persona, PersonaDTO } from '../types';
import SearchPersonaResult from './SearchPersonaResult';
import SearchPersonaForm from './SearchPersonaForm';
import AddPersona from './AddPersona';
import EditPersona from './EditPersona';
import AddPersonaNoRNP from './AddPersonaNoRNP';

type Props = {
    onSubmitAdd?: (...args: any[]) => void;
    onSubmitAddNR?: (...args: any[]) => void;
    onContinue?: (...args: any[]) => void;
};

const SearchPersona = ({ onSubmitAdd, onSubmitAddNR, onContinue }: Props) => {
    const [newPersona, setNewPersona] = useState<PersonaDTO>(() => createEmptyPersonaDTO());
    const [existingPersona, setExistingPersona] = useState<Persona>(() => createEmptyPersona());
    const [fallecido, setFallecido] = useState<boolean>(false);
    // Indica si se realizó una busqueda
    const [searched, setSearched] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Indica si la persona esta en la db del imusa
    const [isInDb, setIsInDb] = useState<boolean>(false);
    // Indica si la persona esta en renaper
    // null = no se realizo la busqueda
    // true = la persona esta en renaper
    // false = la persona no esta en renaper
    const [renaperFound, setRenaperFound] = useState<boolean | null>(null);
    const [addingResponsable, setAddingResponsable] = useState<boolean>(false);
    const [editDomicilio, setEditDomicilio] = useState<boolean>(false);
    const [editContacto, setEditContacto] = useState<boolean>(false);
    const [domicilioActual, setDomicilioActual] = useState<string>('');
    const [noRNP, setNoRNP] = useState<boolean>(false);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMsg, setAlertMsg] = useState<string>('');
    const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>('info');

    return (
        <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
            <Box sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 4, p: 2 }}>
                <SearchPersonaForm 
                    setNewPersona = {setNewPersona}
                    setExistingPersona = {setExistingPersona}
                    setIsLoading = {setIsLoading}
                    setSearched = {setSearched}
                    setIsInDb = {setIsInDb}
                    setAddingResponsable = {setAddingResponsable}
                    setEditDomicilio = {setEditDomicilio}
                    setEditContacto = {setEditContacto}
                    setRenaperFound = {setRenaperFound}
                    setFallecido = {setFallecido}
                    setDomicilioActual={setDomicilioActual}
                />
                
                <SearchPersonaResult 
                    searched = {searched} 
                    newPersona = {newPersona}
                    existingPersona = {existingPersona} 
                    isLoading = {isLoading} 
                    isInDb = {isInDb}
                    addingResponsable = {addingResponsable}
                    setAddingResponsable = {setAddingResponsable}
                    editDomicilio = {editDomicilio}
                    setEditDomicilio = {setEditDomicilio}
                    editContacto = {editContacto}
                    setEditContacto = {setEditContacto}
                    renaperFound =  {renaperFound}
                    fallecido = {fallecido}
                    setNoRNP = {setNoRNP}
                    onContinue = {onContinue}
                />
                
                {addingResponsable &&
                    <AddPersona 
                        newPersona = {newPersona} 
                        domicilioActual = {domicilioActual} 
                        setAlertOpen = {setAlertOpen}
                        setAlertMsg = {setAlertMsg}
                        setAlertSeverity = {setAlertSeverity}
                        onSubmit = {onSubmitAdd}    
                    />
                }

                {(editContacto || editDomicilio) &&
                    <EditPersona 
                        editDomicilio = {editDomicilio}
                        setEditDomicilio = {setEditDomicilio}
                        editContacto = {editContacto}
                        setEditContacto = {setEditContacto}
                        existingPersona = {existingPersona}
                        setExistingPersona = {setExistingPersona}
                        setAlertOpen = {setAlertOpen}
                        setAlertMsg = {setAlertMsg}
                        setAlertSeverity = {setAlertSeverity}   
                    />
                }

                {noRNP &&
                    <AddPersonaNoRNP 
                        setAlertOpen = {setAlertOpen}
                        setAlertMsg = {setAlertMsg}
                        setAlertSeverity = {setAlertSeverity}
                        onSubmit = {onSubmitAddNR}
                    />
                }

                <AlertMessage
                    open = {alertOpen}
                    handleClose = {() => setAlertOpen(false)}
                    message = {alertMsg}
                    severity = {alertSeverity}
                />

            </Box>
        </Box>
    );
};

export default SearchPersona;