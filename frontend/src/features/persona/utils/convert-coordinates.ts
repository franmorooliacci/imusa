import proj4 from 'proj4';

// Define EPSG:22185 and WGS84
proj4.defs("EPSG:22185", "+proj=tmerc +lat_0=-90 +lon_0=-60 +k=1 +x_0=5500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");

export const convertCoordinates = (x: number, y: number): { lat: number; lon: number } => {
    const [lon, lat] = proj4('EPSG:22185', 'EPSG:4326', [x, y]);
    return { lat, lon };
};