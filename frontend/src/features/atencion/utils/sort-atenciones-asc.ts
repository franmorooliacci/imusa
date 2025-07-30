import type { Atencion } from '../types';

export const sortAtencionesAsc = (atenciones: Atencion[]): Atencion[] => {
    return [...atenciones].sort((a, b) => {
        const dateDiff = new Date(a.fecha_ingreso!).getTime() - new Date(b.fecha_ingreso!).getTime();
        if (dateDiff !== 0) return dateDiff;
        return a.hora_ingreso!.localeCompare(b.hora_ingreso!);
    });
};