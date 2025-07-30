import type { Atencion, AtencionInsumo, InsumoOptions } from '../types';

export const buildAtencionInsumos = (options: InsumoOptions, ketamina: Record<string, string>, atencion: Atencion): AtencionInsumo[] => {
    const insumos: AtencionInsumo[] = (
        Object.entries(options) as [keyof InsumoOptions, { selected: boolean; value: string; id: number }][]
    )
        .filter(([, insumo]) => insumo.selected && Number(insumo.value) > 0)
        .map(([, insumo]) => ({
            id_atencion: atencion.id,
            id_insumo: insumo.id,
            cant_ml: Number(insumo.value),
        }));

    const keta_preq = Number(ketamina.prequirurgico);
    const keta_indu = Number(ketamina.induccion);
    const keta_quirof = Number(ketamina.quirofano);
    const totalKetamina = keta_preq + keta_indu + keta_quirof;

    if (totalKetamina > 0) {
        insumos.push({
            id_atencion: atencion.id,
            id_insumo: 13,
            cant_ml: totalKetamina,
            cant_ml_prequirurgico: keta_preq  === 0 ? null : keta_preq,
            cant_ml_induccion: keta_indu  === 0 ? null : keta_indu,
            cant_ml_quirofano: keta_quirof === 0 ? null : keta_quirof,
        });
    }

    return insumos;
};
