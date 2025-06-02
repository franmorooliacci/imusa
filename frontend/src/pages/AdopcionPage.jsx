import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Divider, Grid2, Menu, MenuItem, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import AnimalForm from '../components/AnimalForm';
import { getInstitucionAnimal, updateInstitucionAnimal } from '../services/api';
import InstitucionAnimalTable from '../components/InstitucionAnimalTable';
import AlertMessage from '../components/AlertMessage';
import AdopcionForm from '../components/AdopcionForm';

const AdopcionPage = () => {
	const [especie, setEspecie] = useState('');
	const [addingAnimal, setAddingAnimal] = useState(false);
	const [instAnimalList, setInstAnimalList] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const [alertOpen, setAlertOpen] = useState(false);
	const [alertMsg, setAlertMsg] = useState('');
	const [alertSuccess, setAlertSuccess] = useState(false);
	const [adopcionMode, setAdopcionMode] = useState(false);
	const [rowData, setRowData] = useState(null);

	const fetchInstitucionAnimal = useCallback(async () => {
		// loading true
		// try
		const response = await getInstitucionAnimal(1);
		setInstAnimalList(response);
		// finally loading false
	}, []);

	useEffect(() => {
		fetchInstitucionAnimal();
	}, [fetchInstitucionAnimal]);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleSelect = (especie) => {
		setEspecie(especie);
		setAddingAnimal(true);
		setAnchorEl(null);
	};

	const handleAddAnimal = () => {
		setEspecie(''); 
		setAddingAnimal(false);
		fetchInstitucionAnimal();
	};

	const handleCloseAlert = () => {
        setAlertOpen(false);
    };

	const handleSave = async (row) => {
        try {
            await updateInstitucionAnimal(row.id, row);

            setAlertSuccess(true);
            setAlertMsg('Cambios guardados con éxito!');
            setAlertOpen(true);
        } catch (error) {
			console.error('Failed to save row:', error);
            setAlertSuccess(false);
            setAlertMsg('No se han podido guardar los cambios.');
            setAlertOpen(true);
        } 
    };

	return (
		<Box>
			{addingAnimal ? (
				<AnimalForm
					mode = { 'addToImusa'} 
					initialData = {{ id_especie: especie === 'canino' ? 1 : 2, id_responsable: null}}
					onSuccess = {handleAddAnimal}
					onCancel = {() => { setEspecie(''); setAddingAnimal(false) }}
				/>
			) : adopcionMode ? (
				<AdopcionForm
					mode = {'add'}
					rowData = {rowData}
					setRowData = {setRowData}
					setAdopcionMode = {setAdopcionMode}
				/>
			) : (
				<Grid2 container spacing={2} sx={{ width: '100%' }}>
					<Grid2
						size={{ xs: 12, sm: 12, md: 12, lg: 4 }}
						sx={{
							bgcolor: 'background.paper',
							p: 2,
							borderRadius: 4,
							boxShadow: 3,
						}}
					>
						<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
							<Box sx={{ display: 'flex', gap: 1 }}>
								<FontAwesomeIcon icon={faPaw} size='2x' sx={{ color: (theme) => theme.palette.text.primary }} />

								<Typography variant='h5'>Animales en IMuSA</Typography>
							</Box>

							<Button
								size='small'
								variant='outlined'
								color='primary'
								onClick={handleMenuOpen}
							>
								Agregar
							</Button>

							<Menu
								anchorEl={anchorEl}
								open={open}
								onClose={handleMenuClose}
								anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
							>
								<MenuItem onClick={() => handleSelect('canino')}>Canino</MenuItem>
								<MenuItem onClick={() => handleSelect('felino')}>Felino</MenuItem>
							</Menu>
						</Box>

						<Divider sx={{ mt: 2, mb: 2 }} />
						
						{instAnimalList.length > 0 &&
							<InstitucionAnimalTable 
								instAnimalList = {instAnimalList}
								onSave={(row) => handleSave(row)}
								setAdopcionMode = {setAdopcionMode}
								setRow = {setRowData}
							/>
						}
						
					</Grid2>
				</Grid2>
			)}

			<AlertMessage
				open = {alertOpen}
				handleClose = {handleCloseAlert}
				message = {alertMsg}
				success = {alertSuccess}
			/>
		</Box>
	);
};

export default AdopcionPage;
