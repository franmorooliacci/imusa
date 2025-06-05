// ImageUploaderWithMeta.jsx
import React from 'react';
import ImageUploading from 'react-images-uploading';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid2, IconButton, TextField, Typography } from '@mui/material';

const ImageUploader = ({ imagesValue, onImagesChange }) => {
	const maxNumber = 10;

	// Convierte imagesValue en el formato que react-images-uploading espera
	// [{ file: File|null, data_url: string }, …]
	const valueForUploader = imagesValue.map((img) => ({
		file: img.file,
		data_url: img.data_url
	}));

	// Cuando el usuario selecciona/reemplaza/elimina una foto, 
	// react‐images‐uploading devuelve ==> new imageList: [{ file, data_url }, …] 
	// Esta funcion hace un merge entre la lista nueva y la metadata existente
	// de imagesValue (descripcion, orden, existingId, existingUrl).
	const onChange = (imageList) => {
		const hydrated = imageList.map((imgItem, idx) => {
			const existing = imagesValue.find(
				(x) =>
					x.existingUrl &&
					window.location.origin + x.existingUrl === imgItem.data_url
			);
			return {
				file: imgItem.file || null,
				data_url: imgItem.data_url,
				descripcion: existing ? existing.descripcion : '',
				orden: existing ? existing.orden : idx + 1,
				existingId: existing ? existing.existingId : null,
				existingUrl: existing ? existing.existingUrl : null
			};
		});

		onImagesChange(hydrated);
	};

	const handleFieldChange = (index, field, value) => {
		const copy = [...imagesValue];
		copy[index] = {
			...copy[index],
			[field]: field === 'orden' ? Number(value) : value
		};
		onImagesChange(copy);
	};

	const handleRemoveOne = (index) => {
		const filtered = imagesValue.filter((_, i) => i !== index);
		onImagesChange(filtered);
	};

	return (
		<Box sx={{ p: 2 }}>
			<ImageUploading
				multiple
				value={valueForUploader}
				onChange={onChange}
				maxNumber={maxNumber}
				dataURLKey='data_url'
				acceptType={['jpg', 'jpeg', 'png', 'gif']}
			>
				{({
					imageList,
					onImageUpload,
					onImageRemoveAll,
					onImageUpdate,
					isDragging,
					dragProps
				}) => (
					<Box>
						<Button
							variant='contained'
							onClick={onImageUpload}
							sx={{
							mb: 2,
							backgroundColor: isDragging ? 'secondary.main' : 'primary.main'
							}}
							{...dragProps}
						>
							Seleccionar imágenes
						</Button>
						<Button
							variant='outlined'
							color='error'
							onClick={() => {
								onImageRemoveAll();
								onImagesChange([]); 
							}}
							sx={{ ml: 2, mb: 2 }}
						>
							Eliminar todas
						</Button>

						<Grid2 container spacing={2}>
							{imageList.map((image, index) => (
								<Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
									<Card>
										<CardMedia
											component='img'
											height='140'
											image={image.data_url}
											alt={`preview-${index}`}
										/>
										<CardContent>
											<Typography variant='subtitle2'>
												Foto {index + 1}
											</Typography>

											<TextField
												label='Descripción'
												variant='outlined'
												fullWidth
												size='small'
												value={imagesValue[index].descripcion}
												onChange={(e) =>
													handleFieldChange(index, 'descripcion', e.target.value)
												}
												sx={{ my: 1 }}
											/>

											<TextField
												label='Orden'
												type='number'
												variant='outlined'
												fullWidth
												size='small'
												slotProps={{ 
													input: {
														min: 1 
													}
												}}
												value={imagesValue[index].orden}
												onChange={(e) =>
													handleFieldChange(index, 'orden', e.target.value)
												}
											/>
										</CardContent>
										<CardActions>
											<IconButton
												edge='end'
												color='error'
												onClick={() => handleRemoveOne(index)}
											>
												❌
											</IconButton>
											<Button size='small' onClick={() => onImageUpdate(index)}>
												Reemplazar
											</Button>
										</CardActions>
									</Card>
								</Grid2>
							))}
						</Grid2>
					</Box>
				)}
			</ImageUploading>
		</Box>
	);
};

export default ImageUploader;
