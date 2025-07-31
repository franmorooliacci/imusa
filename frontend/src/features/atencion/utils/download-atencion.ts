import { getInforme } from '../api';

export const downloadAtencion = async (id_atencion: number): Promise<void> => {
    const pdfUrl = await getInforme(id_atencion);

    const res = await fetch(pdfUrl, { credentials: 'include' });
    if (!res.ok) throw new Error(res.statusText);
    const blob = await res.blob();

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;

    link.download = `informe-${id_atencion}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
};