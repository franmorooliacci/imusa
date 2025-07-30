import requests
from decouple import config
from wkhtmltopdf.views import PDFTemplateView
from django.db.models import Prefetch, Value, F, CharField
from django.db.models.functions import Concat
from django.http import HttpResponseBase
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.exceptions import NotFound, APIException
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.serializers import BaseSerializer, ListSerializer
from typing import Any, cast
from .utils import build_cirugia_context, generate_pdf_bytes
from .models import (
    Persona, Especie, Raza, 
    Efector, Animal, Cirugia, 
    Insumo, Domicilio, CirugiaInsumo, 
    Personal, Color, Tamaño, TipoCirugia,
    EstadoEgreso, Consulta, ConsultaInsumo, 
    MotivoConsulta, ConsultaMotivoConsulta
)
from .serializers import (
    PersonaSerializer, AnimalSerializer, RazaSerializer, 
    EfectorSerializer, CirugiaSerializer, InsumoSerializer, 
    DomicilioSerializer, CirugiaInsumoSerializer, PersonalSerializer, 
    CustomTokenObtainPairSerializer, ColorSerializer, TamañoSerializer,
    TipoCirugiaSerializer, EstadoEgresoSerializer, ConsultaSerializer,
    ConsultaInsumoSerializer, MotivoConsultaSerializer
)


class PersonaViewSet(viewsets.ModelViewSet):
    queryset = (
        Persona.objects
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
    serializer_class = PersonaSerializer

    @action(detail=False, methods=['get'], url_path='buscar')
    def search(self, request: Request) -> Response:

        dni: str | None = request.query_params.get('dni')
        sexo: str | None = request.query_params.get('sexo')

        queryset = self.get_queryset()

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

    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        animal = self.get_object()
        serializer = self.get_serializer(
            animal, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        animal = self.get_object()
        animal.delete()
        return Response(status=204)

    def perform_create(self, serializer: BaseSerializer[Any]) -> None:
        animal_serializer = cast(AnimalSerializer, serializer)

        responsable = Persona.objects.get(
            id=self.request.data['id_responsable'])
        especie = Especie.objects.get(
            id=self.request.data['id_especie'])
        raza = Raza.objects.get(id=self.request.data['id_raza'])

        animal_serializer.save(id_responsable=responsable,
                        id_especie=especie, id_raza=raza)


class RazaViewSet(viewsets.ModelViewSet):
    queryset = Raza.objects.select_related('id_especie').all()
    serializer_class = RazaSerializer
    lookup_field = 'id_especie'

    def retrieve(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        id_especie: str | None = kwargs.get('id_especie')
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


class CirugiaViewSet(viewsets.ModelViewSet):
    queryset = (
        Cirugia.objects
            .select_related('id_efector', 'id_personal__id_persona', 'id_animal')
            .prefetch_related('insumos')
            .annotate(
                personal_full_name=Concat(
                    F('id_personal__id_persona__nombre'),
                    Value(' '),
                    F('id_personal__id_persona__apellido'),
                    output_field=CharField()
                )
            )
            .all()
    )
    serializer_class = CirugiaSerializer

    @action(detail=False, methods=['get'], url_path='buscar')
    def search(self, request: Request) -> Response:
        id_animal: str | None = request.query_params.get('id_animal')
        id_responsable: str | None = request.query_params.get('id_responsable')
        id_cirugia: str | None = request.query_params.get('id_cirugia')
        id_efector: str | None = request.query_params.get('id_efector')
        finalizada: str | None = request.query_params.get('finalizada')

        queryset = self.get_queryset()

        if id_animal:
            queryset = queryset.filter(id_animal=id_animal)

        if id_responsable:
            queryset = queryset.filter(id_responsable=id_responsable)

        if id_cirugia:
            queryset = queryset.filter(id_cirugia=id_cirugia)

        if id_efector:
            queryset = queryset.filter(id_efector=id_efector)

        if finalizada:
            queryset = queryset.filter(finalizada=finalizada)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class InsumoViewSet(viewsets.ModelViewSet):
    queryset = Insumo.objects.all()
    serializer_class = InsumoSerializer


class DomicilioViewSet(viewsets.ModelViewSet):
    queryset = Domicilio.objects.all()
    serializer_class = DomicilioSerializer

    def perform_create(self, serializer: BaseSerializer[Any]) -> None:
        domicilio_serializer = cast(DomicilioSerializer, serializer)
        domicilio_serializer.save()

    @action(detail=False, methods=['get'], url_path='buscar')
    def search(self, request: Request) -> Response:
        calle: str | None = request.query_params.get('calle')
        altura: str | None = request.query_params.get('altura')
        localidad: str | None = request.query_params.get('localidad')
        bis: str | None = request.query_params.get('bis')
        letra: str | None = request.query_params.get('letra')
        piso: str | None = request.query_params.get('piso')
        depto: str | None = request.query_params.get('depto')
        monoblock: str | None = request.query_params.get('monoblock')

        filters: dict[str, Any] = {}
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

        result: Domicilio = cast(Domicilio, queryset.first())
        serializer = DomicilioSerializer(result)
        return Response(serializer.data)


class CirugiaInsumoViewSet(viewsets.ModelViewSet):
    queryset = CirugiaInsumo.objects.all()
    serializer_class = CirugiaInsumoSerializer

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            list_serializer = cast(ListSerializer[Any], serializer)
            self.perform_bulk_create(list_serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return super().create(request, *args, **kwargs)

    def perform_bulk_create(self, serializer: ListSerializer[Any]) -> None:
        CirugiaInsumo.objects.bulk_create([
            CirugiaInsumo(**item) for item in serializer.validated_data
        ])

    @action(detail=False, methods=['get'], url_path='buscar')
    def search(self, request: Request) -> Response:
        id_cirugia: str | None = request.query_params.get('id_cirugia')

        queryset = self.get_queryset()

        if id_cirugia:
            queryset = queryset.filter(id=id_cirugia)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TipoCirugiaViewSet(viewsets.ModelViewSet):
    queryset = TipoCirugia.objects.all()
    serializer_class = TipoCirugiaSerializer


class EstadoEgresoViewSet(viewsets.ModelViewSet):
    queryset = EstadoEgreso.objects.all()
    serializer_class = EstadoEgresoSerializer



class ConsultaViewSet(viewsets.ModelViewSet):
    queryset = (
        Consulta.objects
            .select_related('id_efector', 'id_personal__id_persona', 'id_animal')
            .prefetch_related('insumos')
            .annotate(
                personal_full_name=Concat(
                    F('id_personal__id_persona__nombre'),
                    Value(' '),
                    F('id_personal__id_persona__apellido'),
                    output_field=CharField()
                )
            )
            .all()
    )
    serializer_class = ConsultaSerializer

    @action(detail=False, methods=['get'], url_path='buscar')
    def search(self, request: Request) -> Response:
        id_animal: str | None = request.query_params.get('id_animal')
        id_responsable: str | None = request.query_params.get('id_responsable')
        id_consulta: str | None = request.query_params.get('id_consulta')
        id_efector: str | None = request.query_params.get('id_efector')
        finalizada: str | None = request.query_params.get('finalizada')

        queryset = self.get_queryset()

        if id_animal:
            queryset = queryset.filter(id_animal=id_animal)

        if id_responsable:
            queryset = queryset.filter(id_responsable=id_responsable)

        if id_consulta:
            queryset = queryset.filter(id_consulta=id_consulta)

        if id_efector:
            queryset = queryset.filter(id_efector=id_efector)

        if finalizada:
            queryset = queryset.filter(finalizada=finalizada)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConsultaInsumoViewSet(viewsets.ModelViewSet):
    queryset = ConsultaInsumo.objects.all()
    serializer_class = ConsultaInsumoSerializer

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            list_serializer = cast(ListSerializer[Any], serializer)
            self.perform_bulk_create(list_serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return super().create(request, *args, **kwargs)

    def perform_bulk_create(self, serializer: ListSerializer[Any]) -> None:
        ConsultaInsumo.objects.bulk_create([
            ConsultaInsumo(**item) for item in serializer.validated_data
        ])

    @action(detail=False, methods=['get'], url_path='buscar')
    def search(self, request: Request) -> Response:
        id_consulta: str | None = request.query_params.get('id_consulta')

        queryset = self.get_queryset()

        if id_consulta:
            queryset = queryset.filter(id=id_consulta)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MotivoConsultaViewSet(viewsets.ModelViewSet):
    queryset = MotivoConsulta.objects.all()
    serializer_class = MotivoConsultaSerializer


class ConsultaMotivoConsultaViewSet(viewsets.ModelViewSet):
    queryset = ConsultaMotivoConsulta.objects.all()
    serializer_class = ConsultaMotivoConsulta

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            list_serializer = cast(ListSerializer[Any], serializer)
            self.perform_bulk_create(list_serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return super().create(request, *args, **kwargs)

    def perform_bulk_create(self, serializer: ListSerializer[Any]) -> None:
        ConsultaMotivoConsulta.objects.bulk_create([
            ConsultaMotivoConsulta(**item) for item in serializer.validated_data
        ])

    @action(detail=False, methods=['get'], url_path='buscar')
    def search(self, request: Request) -> Response:
        id_consulta: str | None = request.query_params.get('id_consulta')

        queryset = self.get_queryset()

        if id_consulta:
            queryset = queryset.filter(id=id_consulta)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PersonalViewSet(viewsets.ModelViewSet):
    queryset = Personal.objects.prefetch_related('efectores').all()
    serializer_class = PersonalSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ExternalDataViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'], url_path='features')
    def features(self, request: Request) -> Response:
        domicilio: str | None = request.query_params.get('domicilio')

        if not domicilio:
            return Response(
                {'error': '`domicilio` parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        url = f"{config('API_GEO1')}{domicilio}"

        try:
            response = requests.get(
                url, 
                timeout=10, 
                proxies={'http': None, 'https': None}, # type: ignore[arg-type]
                verify=True
            )
            if response.status_code == 404:
                raise NotFound()
            response.raise_for_status()
            data = response.json()
            result = data.get('features')
            result = [ f for f in result if (
                    f.get("geometry") is not None and
                    f["geometry"].get("type") == "Point" and
                    "nombreCalle" in f.get("properties", {}))]
            return Response(result)
        except NotFound:
            raise
        except requests.RequestException as exc:
            raise APIException(detail=f'External API error: {str(exc)}')

    @action(detail=False, methods=['get'], url_path='direccion')
    def direccion(self, request: Request) -> Response:
        codigo_calle: str | None = request.query_params.get('codigoCalle')
        altura: str | None = request.query_params.get('altura')
        bis: str | None = request.query_params.get('bis')
        letra: str | None = request.query_params.get('letra')

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
            response = requests.get(
                url, 
                timeout=10, 
                proxies={'http': None, 'https': None}, # type: ignore[arg-type]
                verify=True
            )
            if response.status_code == 404:
                raise NotFound()
            response.raise_for_status()
            return Response(response.json())
        except NotFound:
            raise
        except requests.RequestException as exc:
            raise APIException(detail=f'External API error: {str(exc)}')

    @action(detail=False, methods=['get'], url_path='latitud-longitud')
    def latitud_longitud(self, request: Request) -> Response:
        punto_x: str | None = request.query_params.get('punto_x')
        punto_y: str | None = request.query_params.get('punto_y')

        if not (punto_x and punto_y):
            return Response(
                {'error': '`punto_x` and `punto_y` are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        url = f"{config('API_GEO3')}{punto_x}/{punto_y}/"

        try:
            response = requests.get(
                url, 
                timeout=10, 
                proxies={'http': None, 'https': None}, # type: ignore[arg-type] 
                verify=True
            )
            if response.status_code == 404:
                raise NotFound()
            response.raise_for_status()
            return Response(response.json())
        except NotFound:
            raise
        except requests.RequestException as exc:
            raise APIException(detail=f'External API error: {str(exc)}')

    @action(detail=False, methods=['get'], url_path='ciudadano')
    def ciudadano(self, request: Request) -> Response:
        dni: str | None = request.query_params.get('dni')
        sexo: str | None = request.query_params.get('sexo')

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


class InformeAPIView(APIView):
    def get(self, request: Request, *args: Any, **kwargs: Any) -> HttpResponseBase:
        id_cirugia: str | None = request.GET.get('id_cirugia')
        if not id_cirugia:
            return Response({'error': 'id_cirugia parameter is required'},
                            status=status.HTTP_400_BAD_REQUEST)

        ctx = build_cirugia_context(int(id_cirugia))
        return PDFTemplateView.as_view(
            template_name='esterilizacion.html',
            extra_context=ctx
        )(request._request, *args, **kwargs)


class SendInformeEmailAPIView(APIView):
    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        try:
            id_cirugia: int = cast(int,request.data.get('id_cirugia'))
        except (TypeError, ValueError):
            return Response(
                {'error': 'id_cirugia (integer) is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            ctx       = build_cirugia_context(id_cirugia)
            pdf_bytes: bytes = generate_pdf_bytes('esterilizacion.html', ctx)
        except Exception as e:
            return Response(
                {'error': 'PDF generation failed', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        to_emails: list[str] = list(request.data.get('to_emails', []))
        if not to_emails:
            return Response(
                {'error': 'No recipient found for this cirugia'},
                status=status.HTTP_400_BAD_REQUEST
            )

        subject: str = cast(str, config('EMAIL_SUBJECT')).format(id_cirugia=id_cirugia)

        data: dict[str, Any] = {
            'from_email': config('EMAIL_SENDER'),
            'subject':    subject,
            'body':       config('EMAIL_BODY'),
            'to_emails':  to_emails,
        }
        files = {
            'attachment': (
                f'esterilizacion-{id_cirugia}.pdf',
                pdf_bytes,
                'application/pdf'
            )
        }

        session = requests.Session()
        session.trust_env = False  # ignore HTTP(S)_PROXY

        try:
            resp = session.post(
                cast(str, config('API_EMAIL')),
                data=data,
                files=files,
                timeout=15
            )
            resp.raise_for_status()
        except requests.RequestException as e:
            return Response(
                {'error': 'External mail API error', 'details': str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )

        try:
            payload: dict[str, Any] = resp.json()
        except ValueError:
            payload = {'text': resp.text}

        return Response(payload, status=resp.status_code)
    

class AtencionesView(APIView):
    def get(self, request):
        id_animal = request.query_params.get('id_animal')
        id_responsable = request.query_params.get('id_responsable')
        id_consulta = request.query_params.get('id_consulta')
        id_efector = request.query_params.get('id_efector')
        finalizada = request.query_params.get('finalizada')

        # Empezamos con todos los objetos
        consultas = Consulta.objects.all()
        cirugias = Cirugia.objects.all()

        # Aplicamos filtros si se pasan parámetros
        if id_animal:
            consultas = consultas.filter(id_animal=id_animal)
            cirugias = cirugias.filter(id_animal=id_animal)

        if id_responsable:
            consultas = consultas.filter(id_responsable=id_responsable)
            cirugias = cirugias.filter(id_responsable=id_responsable)

        if id_consulta:
            consultas = consultas.filter(id=id_consulta)

        if id_efector:
            consultas = consultas.filter(id_efector=id_efector)
            cirugias = cirugias.filter(id_efector=id_efector)

        if finalizada is not None:
            # Convertir a booleano si es necesario
            finalizada_bool = finalizada.lower() == 'true'
            consultas = consultas.filter(finalizada=finalizada_bool)
            cirugias = cirugias.filter(finalizada=finalizada_bool)

        consultas_serializadas = ConsultaSerializer(consultas, many=True).data
        cirugias_serializadas = CirugiaSerializer(cirugias, many=True).data

        atenciones = (
            [{"tipo": "consulta", "data": c} for c in consultas_serializadas] +
            [{"tipo": "cirugia", "data": c} for c in cirugias_serializadas]
        )

        return Response(atenciones)