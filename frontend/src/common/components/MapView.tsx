import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const Recenter = ({ lat, lon }: {lat: number, lon: number}): null => {
    const map = useMap();
    useEffect(() => {
        if (lat != null && lon != null) {
            map.setView([lat, lon], map.getZoom());
        }
    }, [lat, lon, map]);
    return null;
};

type Props = {
    x: number;
    y: number;
    zoom?: number;
    height?: number;
};

const MapView = ({ x, y, zoom = 17, height = 300 }: Props) => {

    return (
        <Box sx={{ height: `${height}px`, width: '100%' }}>
            <MapContainer
                center={[y, x]}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Marker position={[y, x]}>
                    <Popup>
                        Coordinates: {y.toFixed(4)}, {x.toFixed(4)}
                    </Popup>
                </Marker>

                <Recenter lat={y} lon={x} />
            </MapContainer>
        </Box>
    );
};

export default MapView;
