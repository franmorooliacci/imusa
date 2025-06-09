// ImageUploaderWithMeta.jsx
import React from 'react'
import ImageUploading from 'react-images-uploading'
import { Box, Button, Card, CardContent, CardMedia, Grid2, IconButton, TextField, Typography, Badge, styled } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt, faTrash, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const DropZone = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: 'transparent',
    cursor: 'pointer',
}));

const SortableCard = ({ id, index, image, imgMeta, onImageUpdate, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Grid2
            size={{ xs: 12, sm: 6, md: 4 }}
            ref={setNodeRef}
			{...attributes}
			{...listeners}
            style={style}
			sx={{ cursor: 'grab' }}
        >
            <Badge
                badgeContent={imgMeta.orden}
                color='primary'
                sx={{
                    position: 'absolute',
                    zIndex: 1,
                    mt: 1,
                    ml: 1,
					'& .MuiBadge-badge': {
						fontSize: '1rem',
						color: '#fff',
						backgroundColor: 'primary.main',
						width: 28,
						height: 28,
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}
                }}
            >
                <Box />
            </Badge>
            <Card
                sx={{
                    position: 'relative',
                    '&:hover .overlay': { opacity: 1 },
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: 6 },
                }}
            >
                <CardMedia
                    component='img'
                    height='180'
                    image={image.data_url}
                    alt={`preview-${index}`}
                />
                <Box
                    className='overlay'
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                    }}
                >
                    <IconButton
                        size='small'
                        color='primary'
						onPointerDown={e => e.stopPropagation()}
                        onClick={() => onImageUpdate(index)}
                        sx={{ 
							bgcolor: 'background.paper',
							width: 28,
							height: 28,
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: 1,
							'&:hover': {
								bgcolor: 'background.paper.dark',
							}
						}}
                    >
                        <FontAwesomeIcon icon={faSyncAlt} />
                    </IconButton>
                    <IconButton
                        size='small'
                        color='error'
						onPointerDown={e => e.stopPropagation()}
                        onClick={() => onRemove(index)}
                        sx={{ 
							bgcolor: 'background.paper',
							width: 28,
							height: 28,
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: 1,
							'&:hover': {
								bgcolor: 'background.paper.dark',
							}
						}}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                </Box>

                <CardContent>
                    <TextField
                        label='Descripción'
                        variant='outlined'
                        fullWidth
                        multiline
                        size='small'
                        value={imgMeta.descripcion}
                        onChange={e =>
                            imgMeta.onDescripcionChange(index, e.target.value)
                        }
                    />
                </CardContent>
            </Card>
        </Grid2>
    );
};

const ImageUploader = ({ imagesValue, onImagesChange }) => {
    const maxNumber = 10;

    // react-images-uploading espera [{ file, data_url }]
    const valueForUploader = imagesValue.map(img => ({
        file: img.file,
        data_url: img.data_url,
    }));

    const onChange = imageList => {
        const hydrated = imageList.map((imgItem, idx) => {
            const existing = imagesValue.find(
                x =>
                    x.existingUrl &&
                    window.location.origin + x.existingUrl === imgItem.data_url
            );
            return {
                file: imgItem.file || null,
                data_url: imgItem.data_url,
                descripcion: existing ? existing.descripcion : '',
                orden: existing ? existing.orden : idx + 1,
                existingId: existing ? existing.existingId : null,
                existingUrl: existing ? existing.existingUrl : null,
            };
        });
        onImagesChange(hydrated);
    };

    const handleRemoveOne = index => {
        onImagesChange(imagesValue.filter((_, i) => i !== index));
    };

    const handleDescripcionChange = (index, text) => {
        const copy = [...imagesValue];
        copy[index] = { ...copy[index], descripcion: text };
        onImagesChange(copy);
    };

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = event => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = imagesValue.findIndex((_, i) => `item-${i}` === active.id);
            const newIndex = imagesValue.findIndex((_, i) => `item-${i}` === over.id);
            const reordered = arrayMove(imagesValue, oldIndex, newIndex)
                .map((it, i) => ({ ...it, orden: i + 1 }));
            onImagesChange(reordered);
        };
    };

    return (
        <Box>
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
                    dragProps,
                }) => (
                    <>
                        <DropZone onClick={onImageUpload} {...dragProps}>
                            <FontAwesomeIcon
                                icon={faCloudUploadAlt}
                                size='3x'
                                style={{ marginBottom: 8 }}
                            />
                            <Typography
                                variant='h6'
                                color={isDragging ? 'primary.main' : 'textSecondary'}
                            >
                                Arrastrar o hacer click para subir imágenes
                            </Typography>
                            <Typography variant='body2' color='textSecondary'>
                                (Máximo {maxNumber} archivos)
                            </Typography>
                        </DropZone>

                        {imageList.length > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Button
                                    variant='outlined'
                                    startIcon={<FontAwesomeIcon icon={faTrash} />}
                                    color='error'
                                    onClick={() => {
                                        onImageRemoveAll()
                                        onImagesChange([])
                                    }}
                                >
                                    Eliminar todas
                                </Button>
                            </Box>
                        )}

                        {imageList.length === 0 && (
							<Typography
								variant='body2'
								color='textSecondary'
								sx={{ mt: 4, textAlign: 'center' }}
							>
								No hay imágenes seleccionadas.
							</Typography>
                        )}

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={imagesValue.map((_, i) => `item-${i}`)}
                                strategy={rectSortingStrategy}
                            >
                                <Grid2 container spacing={2} sx={{ mt: 1 }}>
                                    {imagesValue.map((imgMeta, index) => (
										<SortableCard
											key={index}
											id={`item-${index}`}
											index={index}
											image={{
												data_url: imgMeta.data_url,
											}}
											imgMeta={{
												...imgMeta,
												onDescripcionChange: handleDescripcionChange,
											}}
											onImageUpdate={onImageUpdate}
											onRemove={handleRemoveOne}
										/>
									))}
                                </Grid2>
                            </SortableContext>
                        </DndContext>
                    </>
                )}
            </ImageUploading>
        </Box>
    );
};

export default ImageUploader;
