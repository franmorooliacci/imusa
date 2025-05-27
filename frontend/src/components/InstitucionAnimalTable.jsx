import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faCheck, faCircleInfo, faDog, faXmark } from '@fortawesome/free-solid-svg-icons';

const InstitucionAnimalTable = ({ instAnimalList }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();
    
    const sortedList = instAnimalList.sort((a, b) => {
        return new Date(b.ingreso) - new Date(a.ingreso);
    });
  
    const paginatedList = sortedList.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );
  
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };
    
    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Especie</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Raza</TableCell>
                        <TableCell>Edad</TableCell>
                        <TableCell>Ingreso</TableCell>
                        <TableCell>En Adopción</TableCell>
                        <TableCell>Detalles</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedList.map((instAnimal) => (
                        <TableRow key={instAnimal.id}>
                            <TableCell align='center'>
                                <FontAwesomeIcon icon={instAnimal.animal.id_especie === 1 ? faDog : faCat} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />
                            </TableCell>
                            <TableCell align='center'>{instAnimal.animal.nombre}</TableCell>
                            <TableCell align='center'>{instAnimal.animal.raza_nombre}</TableCell>
                            <TableCell align='center'>{instAnimal.animal.edad}</TableCell>
                            <TableCell align='center'>{formatDate(instAnimal.ingreso)}</TableCell>
                            <TableCell align='center'>
                                <FontAwesomeIcon icon={instAnimal.adopcion === 1 ? faCheck : faXmark} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />
                            </TableCell>
                            <TableCell align='center'>
                                <IconButton 
                                    variant='outlined' 
                                    color='primary'
                                    onClick={() => navigate(
                                        `/responsable/${instAnimal.animal.id_responsable}/${instAnimal.animal.id_especie === 1 ? 'canino' : 'felino'}/${instAnimal.id_animal}`)}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                            transform: 'scale(1.1)',
                                            transition: 'transform 0.2s'
                                        }
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCircleInfo} size='1x' />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <TablePagination
                    component='div'
                    count={instAnimalList.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage='Filas por página:'
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                    }
                />
            </Box>
        </TableContainer>
    );
}

export default InstitucionAnimalTable;