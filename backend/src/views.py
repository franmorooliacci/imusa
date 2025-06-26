import requests, base64
from decouple import config
from wkhtmltopdf.views import PDFTemplateView
from django.shortcuts import get_object_or_404
from pathlib import Path
from django.conf import settings
from django.db.models import Prefetch, Value, F, CharField
from django.db.models.functions import Concat
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.exceptions import NotFound, APIException
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from .models import (
    Responsable, Especie, Raza, 
    Efector, Animal, Atencion, 
    Insumo, Domicilio, AtencionInsumo, 
    Profesional, Color, Tamaño
)
from .serializers import (
    ResponsableSerializer, AnimalSerializer, RazaSerializer, 
    EfectorSerializer, AtencionSerializer, InsumoSerializer, 
    DomicilioSerializer, AtencionInsumoSerializer, ProfesionalSerializer, 
    CustomTokenObtainPairSerializer, ColorSerializer, TamañoSerializer
)


class ResponsableViewSet(viewsets.ModelViewSet):
    queryset = (
        Responsable.objects
            .select_related('id_domicilio_actual')
            .prefetch_related(
                Prefetch(
                    'animal_set',
                    queryset=Animal.objects.filter(id_especie=2),
                    to_attr='felinos_cache'
                ),
                Prefetch(
                    'animal_set',
                    queryset=Animal.objects.filter(id_especie=1),
                    to_attr='caninos_cache'
                )
            )
    )
    serializer_class = ResponsableSerializer

    @action(detail=False, methods=['get'], url_path='buscar')
    def search(self, request):

        dni = request.query_params.get('dni')
        sexo = request.query_params.get('sexo')

        queryset = self.queryset

        if dni and sexo:
            queryset = queryset.filter(dni=dni, sexo=sexo)
        else:
            return Response(
                {"error": "Para realizar la búsqueda debe proporcionar 'DNI + sexo'."},
                status=400
            )

        if not queryset.exists():
            return Response(
                {"error": "La persona no está registrada en la base de datos."},
                status=404
            )

        serializer = self.get_serializer(queryset.first())
        return Response(serializer.data)


class AnimalViewSet(viewsets.ModelViewSet):
    queryset = (
        Animal.objects
            .select_related('id_responsable')
            .prefetch_related('colores')   
            .all()
    )
    serializer_class = AnimalSerializer

    def update(self, request, pk=None):
        animal = self.get_object()
        serializer = self.get_serializer(
            animal, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        animal = self.get_object()
        animal.delete()
        return Response(status=204)

    def perform_create(self, serializer):
        responsable = Responsable.objects.get(
            id=self.request.data['id_responsable'])
        especie = Especie.objects.get(
            id=self.request.data['id_especie'])
        raza = Raza.objects.get(id=self.request.data['id_raza'])

        serializer.save(id_responsable=responsable,
                        id_especie=especie, id_raza=raza)


class RazaViewSet(viewsets.ModelViewSet):
    queryset = Raza.objects.select_related('id_especie').all()
    serializer_class = RazaSerializer
    lookup_field = 'id_especie'

    def retrieve(self, request, *args, **kwargs):
        id_especie = kwargs.get('id_especie')
        razas = Raza.objects.filter(id_especie=id_especie)
        serializer = self.get_serializer(razas, many=True)
        return Response(serializer.data)


class EfectorViewSet(viewsets.ModelViewSet):
    queryset = Efector.objects.all()
    serializer_class = EfectorSerializer


class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer


class TamañoViewSet(viewsets.ModelViewSet):
    queryset = Tamaño.objects.all()
    serializer_class = TamañoSerializer


class AtencionViewSet(viewsets.ModelViewSet):
    queryset = (
        Atencion.objects
            .select_related('id_efector', 'id_profesional', 'id_animal')
            .prefetch_related('insumos')
            .annotate(
                profesional_full_name=Concat(
                    F('id_profesional__nombre'),
                    Value(' '),
                    F('id_profesional__apellido'),
                    output_field=CharField()
                )
            )
            .all()
    )
    serializer_class = AtencionSerializer

    @action(detail=False, methods=['get'], url_path='buscar')
    def search(self, request):
        id_animal = request.query_params.get('id_animal')
        id_responsable = request.query_params.get('id_responsable')
        id_atencion = request.query_params.get('id_atencion')
        id_efector = request.query_params.get('id_efector')
        estado = request.query_params.get('estado')

        queryset = self.queryset

        if id_animal:
            queryset = queryset.filter(id_animal=id_animal)

        if id_responsable:
            queryset = queryset.filter(id_responsable=id_responsable)

        if id_atencion:
            queryset = queryset.filter(id_atencion=id_atencion)

        if id_efector:
            queryset = queryset.filter(id_efector=id_efector)

        if estado:
            queryset = queryset.filter(estado=estado)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class InsumoViewSet(viewsets.ModelViewSet):
    queryset = Insumo.objects.all()
    serializer_class = InsumoSerializer


class DomicilioViewSet(viewsets.ModelViewSet):
    queryset = Domicilio.objects.all()
    serializer_class = DomicilioSerializer

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False, methods=['get'], url_path='buscar')
    def search(self, request):
        calle = request.query_params.get('calle')
        altura = request.query_params.get('altura')
        localidad = request.query_params.get('localidad')
        bis = request.query_params.get('bis')
        letra = request.query_params.get('letra')
        piso = request.query_params.get('piso')
        depto = request.query_params.get('depto')
        monoblock = request.query_params.get('monoblock')

        filters = {}
        if calle:
            filters['calle__icontains'] = calle
        if altura:
            filters['altura'] = altura
        if localidad:
            filters['localidad__icontains'] = localidad
        if bis:
            filters['bis'] = bis
        if letra:
            filters['letra__iexact'] = letra
        if piso:
            filters['piso'] = piso
        if depto:
            filters['depto__iexact'] = depto
        if monoblock:
            filters['monoblock'] = monoblock

        queryset = self.get_queryset().filter(**filters)

        if not queryset.exists():
            raise NotFound(
                'El domicilio no está registrado en la base de datos.')

        result = queryset.first()
        serializer = DomicilioSerializer(result)
        return Response(serializer.data)


class AtencionInsumoViewSet(viewsets.ModelViewSet):
    queryset = AtencionInsumo.objects.all()
    serializer_class = AtencionInsumoSerializer

    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_bulk_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return super().create(request, *args, **kwargs)

    def perform_bulk_create(self, serializer):
        AtencionInsumo.objects.bulk_create([
            AtencionInsumo(**item) for item in serializer.validated_data
        ])

    @action(detail=False, methods=['get'], url_path='buscar')
    def search(self, request):
        id_atencion = request.query_params.get('id_atencion')

        queryset = self.queryset

        if id_atencion:
            queryset = queryset.filter(id_atencion=id_atencion)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfesionalViewSet(viewsets.ModelViewSet):
    queryset = Profesional.objects.prefetch_related('efectores').all()
    serializer_class = ProfesionalSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ExternalDataViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'], url_path='features')
    def features(self, request):
        domicilio = request.query_params.get('domicilio')

        if not domicilio:
            return Response(
                {'error': '`domicilio` parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        url = f"{config('API_GEO1')}{domicilio}"

        try:
            response = requests.get(url, timeout=10, proxies={
                                    'http': None, 'https': None}, verify=False)
            if response.status_code == 404:
                raise NotFound()
            response.raise_for_status()
            data = response.json()
            result = data.get('features')
            return Response(result)
        except NotFound:
            raise
        except requests.RequestException as exc:
            raise APIException(detail=f'External API error: {str(exc)}')

    @action(detail=False, methods=['get'], url_path='direccion')
    def direccion(self, request):
        codigo_calle = request.query_params.get('codigoCalle')
        altura = request.query_params.get('altura')
        bis = request.query_params.get('bis')
        letra = request.query_params.get('letra')

        if not (codigo_calle and altura and bis):
            return Response(
                {'error': '`codigoCalle`, `altura` are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        url = (
            f"{config('API_GEO2')}?idCalle={codigo_calle}&altura={altura}&bis={bis}"
            f"{f'&letra={letra}' if letra != '' else ''}"
        )

        try:
            response = requests.get(url, timeout=10, proxies={
                                    'http': None, 'https': None}, verify=False)
            if response.status_code == 404:
                raise NotFound()
            response.raise_for_status()
            return Response(response.json())
        except NotFound:
            raise
        except requests.RequestException as exc:
            raise APIException(detail=f'External API error: {str(exc)}')

    @action(detail=False, methods=['get'], url_path='latitud-longitud')
    def latitud_longitud(self, request):
        punto_x = request.query_params.get('punto_x')
        punto_y = request.query_params.get('punto_y')

        if not (punto_x and punto_y):
            return Response(
                {'error': '`punto_x` and `punto_y` are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        url = f"{config('API_GEO3')}{punto_x}/{punto_y}/"

        try:
            response = requests.get(url, timeout=10, proxies={
                                    'http': None, 'https': None}, verify=False)
            if response.status_code == 404:
                raise NotFound()
            response.raise_for_status()
            return Response(response.json())
        except NotFound:
            raise
        except requests.RequestException as exc:
            raise APIException(detail=f'External API error: {str(exc)}')

    @action(detail=False, methods=['get'], url_path='ciudadano')
    def ciudadano(self, request):
        dni = request.query_params.get('dni')
        sexo = request.query_params.get('sexo')

        if not (dni and sexo):
            return Response(
                {'error': '`dni` and `sexo` are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        url = f"{config('API_CIUDADANO')}?dni={dni}&sexo={sexo}&api_key={config('CIUDADANO_KEY')}"

        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 404:
                raise NotFound()
            response.raise_for_status()
            data = response.json()
            result = data.get('ciudadano')
            return Response(result)
        except NotFound:
            raise
        except requests.RequestException as exc:
            raise APIException(detail=f'External API error: {str(exc)}')


class PDFAPIView(APIView):

    def get(self, request, *args, **kwargs):
        id_atencion = request.GET.get('id_atencion')
        if not id_atencion:
            return Response({'error': 'id_atencion parameter is required'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Busca la atencion por id, 404 if not found
        atencion = get_object_or_404(Atencion, pk=id_atencion)

        # Construye los objetos
        animal      = atencion.id_animal
        responsable = atencion.id_responsable
        medicamentos = AtencionInsumo.objects.filter(id_atencion=atencion)
        veterinario = atencion.id_profesional
        efector = atencion.id_efector

        # Obtiene los colores del animal
        colores = animal.colores.all()
        colores_nombres = ', '.join(c.nombre for c in colores)

        # Calcula la edad
        birth = animal.fecha_nacimiento
        if not birth:
            edad = None
        else:
            from datetime import date
            today  = date.today()
            years  = today.year  - birth.year
            months = today.month - birth.month
            if months < 0:
                years  -= 1
                months += 12
            edad = f"{years} años {months} meses"

        # Arma el domicilio
        dom = responsable.id_domicilio_actual
        if dom:
            parts = []

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

            localidad = dom.localidad
            domicilio_actual = ' '.join(parts) + f", {localidad}"


        # Arma el path para los archivos estaticos
        base_static = Path(settings.BASE_DIR) / 'src' / 'static'
        css_file   = base_static / 'css'    / 'esterilizacion.css'
        logo_file  = base_static / 'images' / 'logo.jpeg'

        # Convierte css a string
        try:
            css_content = css_file.read_text(encoding='utf-8')
        except FileNotFoundError:
            return Response({'error': 'CSS file not found.'}, status=500)

        # Convierte el logo de base64 a imagen
        try:
            logo_data = logo_file.read_bytes()
        except FileNotFoundError:
            return Response({'error': 'Logo file not found.'}, status=500)
        logo_b64 = base64.b64encode(logo_data).decode('ascii')
        logo_data_uri = f"data:image/jpeg;base64,{logo_b64}"

        # Convierte las firmas de base64 a imagen
        def make_data_uri(b64_string, mime='image/png'):
            if not b64_string:
                return None
            if b64_string.startswith('data:'):
                return b64_string
            return f'data:{mime};base64,{b64_string}'

        responsable_uri = make_data_uri(responsable.firma, mime='image/png')
        veterinario_uri = make_data_uri(veterinario.firma, mime='image/png')

        extra_context = {
            'animal'          : animal,
            'atencion'        : atencion,
            'responsable'     : responsable,
            'domicilio_actual': domicilio_actual,
            'medicamentos'    : medicamentos,
            'veterinario'     : veterinario,
            'efector'         : efector,
            'colores_nombres' : colores_nombres,
            'edad'            : edad,
            'css_content'     : css_content,
            'logo_data_uri'   : logo_data_uri,
            'responsable_firma_uri': responsable_uri,
            'veterinario_firma_uri': veterinario_uri
        }

        return PDFTemplateView.as_view(
            template_name='esterilizacion.html',
            extra_context=extra_context
        )(request._request, *args, **kwargs)

