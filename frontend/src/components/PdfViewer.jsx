import React, { useEffect, useState } from 'react';
import { fillPdf } from '../services/pdfService';
import { Box } from '@mui/material';

const PdfViewer = ({ formData }) => {
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const showPdf = async () => {
            try {
                const response = await fetch('/pdfs/esterilizacion.pdf');
                const arrayBuffer = await response.arrayBuffer();
                const pdfBytes = await fillPdf(arrayBuffer, formData);
        
                // Create a Blob and generate a URL for the PDF
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);
                setPdfUrl(blobUrl);
            } catch (error) {
                console.error('Error loading or filling the PDF:', error);
            }
        };
    
        if(formData){
            showPdf();
        }

    }, [formData]);

    return (
        <Box 
            component='iframe'
            src={pdfUrl}
            width='100%'
            height='100%'
        />
    );
}

export default PdfViewer;
