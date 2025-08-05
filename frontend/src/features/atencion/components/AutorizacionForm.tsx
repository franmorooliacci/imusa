import React, { useState } from 'react';
import { Box, Divider, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignature } from '@fortawesome/free-solid-svg-icons';
import type { Setter } from '@common/types';
import { SignaturePad } from '@common/components';
import type { Persona } from '@features/persona';
import { SearchPersona } from '@features/persona';

type Props = {
    responsable: Persona;
    setResponsable: Setter<Persona>;
    setFirma: Setter<string>;
};

type Selection = 'current' | 'other';
type Stage = 'sign' | 'search';

const AutorizacionForm = (props: Props) => {
    const { 
        responsable, 
        setResponsable,
        setFirma
    } = props;
    const [selection, setSelection] = useState<Selection>('current');
    const [stage, setStage] = useState<Stage>('sign');

    const onSubmit = async (persona: Persona): Promise<void> => {
        setResponsable(persona);
        setSelection('current');
        setStage('sign');
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Divider textAlign='left'>
                <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ color: (theme) => theme.palette.text.primary }}>
                        <FontAwesomeIcon icon={faSignature} size='1x' />
                    </Box>
                    <Typography variant='subtitle1'>
                        Autorización
                    </Typography>
                </Stack>
            </Divider>

            <Typography variant='subtitle2' sx={{ pl: 1, pr: 1 }}>
                {
                    'Autorizo al Instituto Municipal de Salud Animal (IMuSA) a practicar la intervención' +
                    ' quirúrgica correspondiente. Dejo constancia que me he informado de los riesgos inherentes' +
                    ' (edad avanzada, estado nutricional, enfermedades ocultas) a la anestesia y al acto quirúrgico' +
                    ' en sí, así como de las posibles secuelas que puedan originarse. Firmo la presente y doy' +
                    ' conformidad para la intervención.'
                }
            </Typography>

            <FormControl component='fieldset' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2, pl: 1, pr: 1}}>
                <Typography variant='subtitle2' sx={{ mr: 2 }}>Entrega el animal: </Typography>
                <RadioGroup
                    row
                    name='entrega'
                    value={selection}
                    onChange={e => {
                        const sel = e.target.value as Selection;
                        setSelection(sel); 
                        setFirma('');

                        if(sel === 'current') setStage('sign');
                        if(sel === 'other') setStage('search');
                    }}
                >
                    <FormControlLabel 
                        value='current' 
                        control={<Radio />} 
                        label={<Typography variant='subtitle2'>{responsable.nombre} {responsable.apellido}</Typography>} 
                    />
                    <FormControlLabel 
                        value='other' 
                        control={<Radio />} 
                        label={<Typography variant='subtitle2'>Otra persona</Typography>}
                    />
                </RadioGroup>
            </FormControl>

            {stage === 'search' && (
                <SearchPersona onSubmit={onSubmit} onContinue={onSubmit} />
            )}

            {stage === 'sign' && (
                <SignaturePad onChange={(base64) => setFirma(base64)} />
            )}

        </Box>
    );
}; 

export default AutorizacionForm;