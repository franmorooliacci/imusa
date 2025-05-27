import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Divider, Grid2, Menu, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AnimalForm from '../components/AnimalForm';
import { useNavigate } from 'react-router-dom';
import { getInstitucionAnimal } from '../services/api';
import InstitucionAnimalTable from '../components/InstitucionAnimalTable';

const AdopcionPage = () => {
	const [especie, setEspecie] = useState('');
	const [addingAnimal, setAddingAnimal] = useState(false);
	const [instAnimalList, setInstAnimalList] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchInstitucionAnimal = async () => {
			const response = await getInstitucionAnimal(1);
			setInstAnimalList(response);
			// loading
		};

		fetchInstitucionAnimal();
	}, []);

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

	return (
		<Box>
			{addingAnimal ? (
				<AnimalForm
					mode = { 'addToImusa'} 
					initialData = {{ id_especie: especie === 'canino' ? 1 : 2, id_responsable: null}}
					onSuccess = {(path) => navigate(path)}
					onCancel = {() => { setEspecie(''); setAddingAnimal(false) }}
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
							<InstitucionAnimalTable instAnimalList = {instAnimalList} />
						}
						
					</Grid2>
				</Grid2>
			)}
		</Box>
	);
};

export default AdopcionPage;
