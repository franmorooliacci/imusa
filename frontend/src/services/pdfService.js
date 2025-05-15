import { PDFDocument } from 'pdf-lib';

export const fillPdf = async (templateBytes, formData) => {
    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    // Completa los text fields del pdf
    Object.entries(formData).forEach(([key, value]) => {
        if (![
            'firma_responsable_autorizacion', 
            'firma_responsable_egreso', 
            'firma_veterinario_egreso', 
            'firma_veterinario'
        ].includes(key)) {
            try {
                const field = form.getTextField(key);
                field.setText(value);
            } catch (error) {
            }
        }
    });

    // Campos de firma
    const signatureKeys = [
        'firma_responsable_autorizacion',
        'firma_responsable_egreso',
        'firma_veterinario_egreso',
        'firma_veterinario'
    ];

    for (const key of signatureKeys) {
        const base64Data = formData[key];

        try {
            // Se obtienen los campos de firma como botones, 
            // pdf-lib les cambia la apariencia
            const button = form.getButton(key);

            // Carga la imagen .png en formato base64
            const pngImage = await pdfDoc.embedPng(base64Data);

            // Escala la imagen
            const imageWidth = pngImage.width;
            const imageHeight = pngImage.height;
            const scale = 1.0;

            const scaledWidth = imageWidth * scale;
            const scaledHeight = imageHeight * scale;

            const appearance = pdfDoc.context.register(
                pdfDoc.context.stream(
                    `q
                    ${scaledWidth} 0 0 ${scaledHeight} 0 0 cm
                    /Im0 Do
                    Q`,
                    {
                        Resources: {
                            XObject: pdfDoc.context.obj({
                                Im0: pngImage.ref,
                            }),
                        },
                        BBox: [0, 0, scaledWidth, scaledHeight],
                    }
                )
            );

            const widgets = button.acroField.getWidgets();
            for (const widget of widgets) {
                widget.setNormalAppearance(appearance);
            }
        } catch (error) {
        }
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};
