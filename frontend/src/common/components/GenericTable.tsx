import React, { useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import type { Column } from '@common/types';

type Props<T> = {
    columns: Column<T>[];
    data: T[];
    getRowKey: (row: T) => string | number;
    initialRowsPerPage?: number;
    rowsPerPageOptions?: number[];
}

const GenericTable = <T,>(props: Props<T>) => {
    const {
        columns,
        data,
        getRowKey,
        initialRowsPerPage = 5,
        rowsPerPageOptions = [5, 10, 25],
    } = props;
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(initialRowsPerPage);

    const handleChangePage = (_: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const sliceStart = page * rowsPerPage;
    const sliceEnd = sliceStart + rowsPerPage;
    const paginatedData = data.slice(sliceStart, sliceEnd);

    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map(col => (
                            <TableCell
                                key={col.id}
                                align={col.align}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {paginatedData.map(row => (
                        <TableRow key={getRowKey(row)}>
                            {columns.map(col => {
                                const rawValue = (row as any)[col.id];
                                return (
                                    <TableCell key={col.id} align={col.align}>
                                        {col.render ? col.render(rawValue, row) : rawValue}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <TablePagination
                    component="div"
                    count={data.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={rowsPerPageOptions}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                    }
                />
            </Box>
        </TableContainer>
    );
};

export default GenericTable;
