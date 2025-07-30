import http from './axiosClient';

export const getPersona = async (dni, sexo) => {
    try {
        const response = await http.get(`personas/buscar/?dni=${dni}&sexo=${sexo}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addPersona = async (newResponsable) => {
    try {
        const response = await http.post(`personas/`, newResponsable);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPersonaById = async (id) => {
    try {
        const response = await http.get(`personas/${id}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePersona = async (id, data) => {
    try {
        const response = await http.patch(`personas/${id}/`, data);
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

export const addCirugia = async (newCirugia) => {
    try {
        const response = await http.post(`cirugias/`, newCirugia);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addCirugiaInsumo = async (insumos) => {
    try {
        const response = await http.post(`cirugia_insumo/`, insumos);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCirugias = async (params) => {
    try {
        const response = await http.get(`cirugias/buscar/`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCirugiaById = async (id) => {
    try {
        const response = await http.get(`cirugias/${id}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCirugia = async (id, data) => {
    try {
        const response = await http.patch(`cirugias/${id}/`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getInsumosByIdCirugia = async (id_cirugia) => {
    try {
        const response = await http.get(`cirugia_insumo/buscar`, { params: { id_cirugia } });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addConsulta = async (newConsulta) => {
    try {
        const response = await http.post(`consulta/`, newConsulta);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addConsultaInsumo = async (insumos) => {
    try {
        const response = await http.post(`consulta_insumo/`, insumos);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addConsultaMotivoConsulta = async (motivos) => {
    try {
        const response = await http.post(`consulta_motivo_consulta/`, motivos);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getConsultas = async (params) => {
    try {
        const response = await http.get(`consultas/buscar/`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getConsultaById = async (id) => {
    try {
        const response = await http.get(`consultas/${id}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMotivoConsultaById = async () => {
    try {
        await http.get('motivos_consulta/'); 
        return response.data;
    } catch (error){
        throw error;
    };
}

export const getMotivoByIdConsulta = async (id_consulta) => {
    try {
        const response = await http.get(`consulta_motivo_consulta/buscar`, { params: { id_consulta } });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateConsulta = async (id, data) => {
    try {
        const response = await http.patch(`consultas/${id}/`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getInsumosByIdConsulta = async (id_consulta) => {
    try {
        const response = await http.get(`consulta_insumo/buscar`, { params: { id_consulta } });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPersonalById = async (id) => {
    try {
        const response = await http.get(`personal/${id}/`);
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

export const getInforme = async (id_cirugia) => {
    try {
        const response = await http.get('informes/', { params: { id_cirugia }, responseType: 'blob', });
        const url  = URL.createObjectURL(response.data);    
        return url;
    } catch (error) {
        throw error;
    }
};

export const sendInformeEmail = async (params) => {
    try {
        const response = await http.post('informes/email/', params);    
        return response;
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

export const getTiposCirugia = async () => {
    try {
        const response = await http.get('tipos_cirugia/'); 
        return response.data;
    } catch (error){
        throw error;
    };
};

export const getEstadosEgreso = async () => {
    try {
        const response = await http.get('estados_egreso/'); 
        return response.data;
    } catch (error){
        throw error;
    };
}


export const getAtenciones = async () => {
    try {
        const response = await http.get('atenciones/'); 
        return response.data;
    } catch (error){
        throw error;
    };
}


export const getPersonal = async () => {
    try {
        const response = await http.get('pesonal/');
        return response.data;
    } catch (error){
        throw error;
    };
}