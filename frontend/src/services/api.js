import http from './axiosClient';

export const getResponsable = async (dni, sexo) => {
    try {
        const response = await http.get(`responsables/buscar/?dni=${dni}&sexo=${sexo}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addResponsable = async (newResponsable) => {
    try {
        const response = await http.post(`responsables/`, newResponsable);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getResponsableById = async (id) => {
    try {
        const response = await http.get(`responsables/${id}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateResponsable = async (id, data) => {
    try {
        const response = await http.patch(`responsables/${id}/`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addAnimal = async (newAnimal) => {
    try {
        const response = await http.post(`animales/`, newAnimal);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAnimalById = async (id) => {
    try {
        const response = await http.get(`animales/${id}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateAnimal = async (id, data) => {
    try {
        const response = await http.put(`animales/${id}/`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRazas = async (id_especie) => {
    try {
        const response = await http.get(`razas/${id_especie}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addAtencion = async (newAtencion) => {
    try {
        const response = await http.post(`atenciones/`, newAtencion);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addAtencionInsumo = async (insumos) => {
    try {
        const response = await http.post(`atencion_insumo/`, insumos);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAtenciones = async (params) => {
    try {
        const response = await http.get(`atenciones/buscar/`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAtencionById = async (id) => {
    try {
        const response = await http.get(`atenciones/${id}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateAtencion = async (id, data) => {
    try {
        const response = await http.patch(`atenciones/${id}/`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getInsumosByIdAtencion = async (id_atencion) => {
    try {
        const response = await http.get(`atencion_insumo/buscar`, { params: { id_atencion } });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProfesionalById = async (id) => {
    try {
        const response = await http.get(`profesionales/${id}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getEfectores = async () => {
    try {
        const response = await http.get(`efectores/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addDomicilio = async (domicilio) => {
    try {
        const response = await http.post(`domicilios/`, domicilio);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDomicilio = async (params) => {
    try {
        const queryParams = new URLSearchParams();

        if (params.calle) queryParams.append('calle', params.calle);
        if (params.altura) queryParams.append('altura', params.altura);
        if (params.localidad) queryParams.append('localidad', params.localidad);
        if (params.bis) queryParams.append('bis', params.bis);
        if (params.letra) queryParams.append('letra', params.letra);
        if (params.piso) queryParams.append('piso', params.piso);
        if (params.depto) queryParams.append('depto', params.depto);
        if (params.monoblock) queryParams.append('monoblock', params.monoblock);

        const response = await http.get(`domicilios/buscar/`, {
            params: queryParams
        });

        return response.data;

    } catch (error) {
        throw error;
    }
};

export const loginUser = async (username, password) => {
    try {
        const response = await http.post(`token/`, { username, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCiudadano = async (dni, sexo) => {
    try {
        const response = await http.get('external_data/ciudadano/', { params: { dni, sexo } });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getFeatures = async (domicilio) => {
    try {
        const response = await http.get('external_data/features/', { params: { domicilio } });
        return response.data;
    } catch (error) {
        throw error
    }
};

export const getDireccion = async (codigoCalle, altura, bis, letra) => {
    try {
        const response = await http.get('external_data/direccion/', { params: { codigoCalle, altura, bis, letra } });
        return response.data;
    } catch (error) {
        throw error
    }
};

export const getLatitudLongitud = async (punto_x, punto_y) => {
    try {
        const response = await http.get('external_data/latitud-longitud/', { params: { punto_x, punto_y } });
        return response.data;
    } catch (error) {
        throw error
    }
};

export const getInforme = async (id_atencion) => {
    try {
        const response = await http.get('informes/', { params: { id_atencion }, responseType: 'blob', });
        const url  = URL.createObjectURL(response.data);    
        return url;
    } catch (error) {
        throw error;
    }
};

export const getTamaños = async () => {
    try {
        const response = await http.get('tamaños/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getColores = async () => {
    try {
        const response = await http.get('colores/');
        return response.data;
    } catch (error) {
        throw error;
    }
};