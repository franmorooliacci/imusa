import base64
import subprocess
import tempfile
from pathlib import Path
from datetime import date
from django.conf import settings
from django.template.loader import render_to_string
from typing import Any, cast
from .models import Atencion, AtencionInsumo


def build_atencion_context(id_atencion: int) -> dict[str, Any]:
    atencion = (
        Atencion.objects
            .select_related(
                'id_animal',
                'id_responsable__id_domicilio_actual',
                'id_personal__id_persona',
                'id_efector',
            )
            .prefetch_related('id_animal__colores')
            .get(pk=id_atencion)
    )

    animal      = atencion.id_animal
    responsable = atencion.id_responsable
    medicamentos = AtencionInsumo.objects.filter(id_atencion=atencion)
    personal = atencion.id_personal
    veterinario = personal.id_persona
    efector     = atencion.id_efector
    #estado_sanitario = atencion.estado_sanitario_egreso

    # Acomodo medicamentos
    medicamentos_queryset = AtencionInsumo.objects.filter(id_atencion=atencion)
    medicamentos = []
    ketamina_partes = []

    for med in medicamentos_queryset:
        if med.id_insumo.nombre == "Ketamina":
            if med.cant_ml_prequirurgico:
                ketamina_partes.append({
                    'nombre': 'Ketamina (Prequirúrgico)',
                    'cantidad': med.cant_ml_prequirurgico
                })
            if med.cant_ml_induccion:
                ketamina_partes.append({
                    'nombre': 'Ketamina (Inducción)',
                    'cantidad': med.cant_ml_induccion
                })
            if med.cant_ml_quirofano:
                ketamina_partes.append({
                    'nombre': 'Ketamina (Quirófano)',
                    'cantidad': med.cant_ml_quirofano
                })
        else:
            medicamentos.append({
                'nombre': med.id_insumo.nombre,
                'cantidad': med.cant_ml
            })

    # Unificamos todo en una sola lista
    medicamentos_completos = medicamentos + ketamina_partes

    # colores
    colores: list[str] = [c.nombre for c in animal.colores.all()]
    colores_nombres: str = ', '.join(colores)

    # edad
    birth: date | None = animal.fecha_nacimiento
    if birth:
        today  = date.today()
        years  = today.year  - birth.year
        months = today.month - birth.month
        if months < 0:
            years  -= 1
            months += 12
        edad: str | None = f"{years} años {months} meses"
    else:
        edad= None

    # domicilio
    dom = responsable.id_domicilio_actual
    domicilio_actual: str | None = None
    if dom:
        parts: list[str] = []
        calle_altura = f"{dom.calle} {dom.altura}"
        if dom.bis:
            calle_altura += " bis"
        if dom.letra:
            calle_altura += f" {dom.letra}"
        parts.append(calle_altura)
        if dom.piso is not None:
            parts.append(f"piso {dom.piso}")
        if dom.depto:
            parts.append(f"depto {dom.depto}")
        if dom.monoblock is not None:
            parts.append(f"monoblock {dom.monoblock}")
        domicilio_actual = ' '.join(parts) + f", {dom.localidad}"

    # carga de CSS y logo
    base_static = Path(settings.BASE_DIR) / 'src' / 'static'
    css_path    = base_static / 'css'    / 'esterilizacion.css'
    logo_path   = base_static / 'images' / 'logo.jpeg'

    css_content: str = css_path.read_text(encoding='utf-8')
    logo_b64: str    = base64.b64encode(logo_path.read_bytes()).decode('ascii')
    logo_data_uri: str = f"data:image/jpeg;base64,{logo_b64}"

    def make_data_uri(b64_string: str | None, mime: str ='image/png') -> str | None:
        if not b64_string:
            return None
        if b64_string.startswith('data:'):
            return b64_string
        return f'data:{mime};base64,{b64_string}'

    ctx: dict[str, Any] = {
        'animal'                : animal,
        'atencion'              : atencion,
        'responsable'           : responsable,
        'domicilio_actual'      : domicilio_actual,
        'medicamentos'          : medicamentos_completos,
        #'estado_sanitario'      : estado_sanitario,
        'personal'              : personal,
        'veterinario'           : veterinario,
        'efector'               : efector,
        'colores_nombres'       : colores_nombres,
        'edad'                  : edad,
        'css_content'           : css_content,
        'logo_data_uri'         : logo_data_uri,
        'firma_ingreso_uri'     : make_data_uri(cast(str | None, atencion.firma_ingreso)),
        'firma_egreso_uri'      : make_data_uri(cast(str | None, atencion.firma_egreso)),
        'veterinario_firma_uri' : make_data_uri(cast(str | None, personal.firma)),
    }

    return ctx


def generate_pdf_bytes(template_name: str, context: dict[str, Any]) -> bytes:
    html = render_to_string(template_name, context)

    with tempfile.NamedTemporaryFile(suffix='.pdf') as pdf_tmp:
        subprocess.run(
            ['wkhtmltopdf', '--enable-local-file-access', '-', pdf_tmp.name],
            input=html.encode('utf-8'),
            check=True
        )
        pdf_tmp.seek(0)
        return pdf_tmp.read()
