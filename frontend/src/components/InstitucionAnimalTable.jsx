import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faCheck, faCircleInfo, faDog, faFloppyDisk, faHandHoldingHeart, faXmark } from '@fortawesome/free-solid-svg-icons';

const InstitucionAnimalTable = ({ instAnimalList, onSave, setAdopcionMode, setRowData }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    
    const sortedList = rows.sort((a, b) => {
        return new Date(b.ingreso) - new Date(a.ingreso);
    });

    const handleObservacionChange = (id, value) => {
        setRows(rs => rs.map(r => r.id === id ? { ...r, observaciones: value } : r));
    };

    useEffect(() => {
        setRows(instAnimalList.map(r => ({ ...r })));
    }, [instAnimalList]);
  
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

    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>Especie</TableCell>
                        <TableCell align='center'>Nombre</TableCell>
                        <TableCell align='center'>Raza</TableCell>
                        <TableCell align='center'>Edad</TableCell>
                        <TableCell align='center'>Ingreso</TableCell>
                        <TableCell align='center'>Observaciones</TableCell>
                        <TableCell align='center'>En Adopción</TableCell>
                        <TableCell align='center'>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedList.map((row) => {
                        return (
                            <TableRow key={row.id}>
                                <TableCell align='center'>
                                    <FontAwesomeIcon icon={row.animal.id_especie === 1 ? faDog : faCat} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />
                                </TableCell>
                                <TableCell align='center'>{row.animal.nombre}</TableCell>
                                <TableCell align='center'>{row.animal.raza_nombre}</TableCell>
                                <TableCell align='center'>{row.animal.edad}</TableCell>
                                <TableCell align='center'>{formatDate(row.ingreso)}</TableCell>
                                <TableCell align='center'>
                                    <TextField
                                        variant='standard'
                                        multiline
                                        size='small'
                                        fullWidth
                                        value={row.observaciones || ''}
                                        onChange={e => handleObservacionChange(row.id, e.target.value)}
                                    />
                                </TableCell>
                                <TableCell align='center'>
                                    <FontAwesomeIcon 
                                        icon={Number(row.adopcion) === 1 ? faCheck : faXmark} 
                                        size='2x' 
                                        color={Number(row.adopcion) === 1 ? 'green' : 'red'}
                                    />
                                </TableCell>
                                <TableCell align='center'>
                                    <Box sx={{ display: 'flex' }}>
                                        <Tooltip title='Ver detalles' arrow>
                                            <IconButton 
                                                variant='outlined' 
                                                color='primary'
                                                onClick={() => navigate(
                                                    `/responsable/${row.animal.id_responsable}/${row.animal.id_especie === 1 ? 'canino' : 'felino'}/${row.id_animal}`)}
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
                                        </Tooltip>

                                        {Number(row.adopcion) === 0 &&
                                            <Tooltip title='Poner en adopción' arrow>
                                                <IconButton 
                                                    variant='outlined' 
                                                    color='primary'
                                                    onClick={() => {setRowData(row); setAdopcionMode(true);}}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                            transform: 'scale(1.1)',
                                                            transition: 'transform 0.2s'
                                                        }
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faHandHoldingHeart} size='1x' />
                                                </IconButton>
                                            </Tooltip>
                                        }

                                        <Tooltip title='Guardar cambios' arrow>
                                            <span>
                                                <IconButton
                                                    variant='outlined'
                                                    color='primary'
                                                    onClick={() => onSave(row)}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                            transform: 'scale(1.1)',
                                                            transition: 'transform 0.2s'
                                                        }
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faFloppyDisk} size='1x' />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <TablePagination
                    component='div'
                    count={rows.length}
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