import { getInforme } from '../api';

export const printAtencion = async (id_atencion: number): Promise<void> => {
    const pdfUrl = await getInforme(id_atencion);
    const res = await fetch(pdfUrl, { credentials: 'include' });
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.src = blobUrl;
    Object.assign(iframe.style, {
        position: 'absolute',
        top: '-100vh',
        left: '-100vw',
        width: '1px',
        height: '1px',
        visibility: 'hidden',
        border: 'none',
    });
    document.body.appendChild(iframe);

    iframe.onload = () => {
        const win = iframe.contentWindow;
        if (win) {
            win.focus();
            win.print();
        }

        setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(blobUrl);
        }, 500);
    };
};