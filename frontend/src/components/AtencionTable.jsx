import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faCircleInfo, faDog, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const AtencionTable = ({ atenciones, animalDetails, onSendEmail }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();
    
    const sortedAtenciones = atenciones.sort((a, b) => {
        const dateDiff = new Date(b.fecha_ingreso) - new Date(a.fecha_ingreso);
        if (dateDiff !== 0) return dateDiff;
        return b.hora_ingreso.localeCompare(a.hora_ingreso);
    });
  
    const paginatedAtenciones = sortedAtenciones.slice(
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
                        {animalDetails &&
                            <TableCell>Especie</TableCell>
                        }
                        {animalDetails &&
                            <TableCell>Nombre</TableCell>
                        }
                        <TableCell>Fecha</TableCell>
                        <TableCell>Hora</TableCell>
                        <TableCell>Efector</TableCell>
                        <TableCell>Servicio</TableCell>
                        <TableCell>Profesional</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedAtenciones.map((atencion) => (
                        <TableRow key={atencion.id}>
                            {animalDetails &&
                                <TableCell>
                                    <FontAwesomeIcon icon={atencion.animal.id_especie === 1 ? faDog : faCat} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />
                                </TableCell>
                            }

                            {animalDetails &&
                                <TableCell>{atencion.animal.nombre}</TableCell>
                            }

                            <TableCell>{formatDate(atencion.fecha_ingreso)}</TableCell>
                            <TableCell>{formatTime(atencion.hora_ingreso)}</TableCell>
                            <TableCell>{atencion.efector_nombre}</TableCell>
                            <TableCell>{'Esterilización'}</TableCell>
                            <TableCell>{atencion.personal_nombre}</TableCell>
                            <TableCell sx={{ display: 'flex', flexDirection: 'row' }}>
                                <Tooltip title='Ver detalles' arrow>
                                    <IconButton 
                                        variant='outlined' 
                                        color='primary' 
                                        onClick={() => navigate(`/atencion/${atencion.id}`)}
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
                                <Tooltip title='Enviar informe por mail' arrow>
                                    <IconButton
                                        variant='outlined' 
                                        color='success' 
                                        onClick={() => onSendEmail(atencion.id)}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                transform: 'scale(1.1)',
                                                transition: 'transform 0.2s'
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} size='1x' />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <TablePagination
                    component="div"
                    count={atenciones.length}
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

export default AtencionTable;