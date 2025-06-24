import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';


const AnimalTable = ({animalList}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Sexo</TableCell>
                        <TableCell>Edad</TableCell>
                        <TableCell>Raza</TableCell>
                        <TableCell>Detalles</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {animalList.map((animal) => (
                        <TableRow key={animal.id}>
                            <TableCell>{animal.nombre}</TableCell>
                            <TableCell>{animal.sexo}</TableCell>
                            <TableCell>{animal.edad}</TableCell>
                            <TableCell>{animal.raza}</TableCell>
                            <TableCell>
                                <IconButton 
                                    variant="outlined" 
                                    color="primary" 
                                    onClick={() => navigate(`/responsable/${animal.id_responsable}/${animal.id_especie === 1 ? 'canino' : 'felino'}/${animal.id}`)}
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
                    component="div"
                    count={animalList.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                    }
                />
            </Box>
        </TableContainer>
    );
}

export default AnimalTable;