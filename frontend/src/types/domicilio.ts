export interface Domicilio {
    id: number;
    calle: string;
    codigo_calle?: number | null;
    altura: number;
    bis?: number | null;
    letra?: string | null;
    piso?: number | null;
    depto?: string | null;
    monoblock?: number | null;
    barrio?: string | null;
    vecinal?: string | null;
    distrito?: string | null;
    seccional_policial?: string | null;
    localidad: string;
    lineas_tup?: string | null;
    coordenada_x?: string | null;
    coordenada_y?: string | null;
    fraccion_censal?: string | null;
    radio_censal?: string | null;
}
