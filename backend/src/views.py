import requests, re
from .models import (
    Responsable, Especie, Raza,
    Efector, Animal, Atencion,
    Insumo, Domicilio, AtencionInsumo,
    Profesional, Candidato, Institucion,
    InstitucionAnimal, PeticionAdopcion, Adopcion,
    AdopcionFoto
)
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.exceptions import NotFound, APIException
from .serializers import (
    ResponsableSerializer, AnimalSerializer, RazaSerializer,
    EfectorSerializer, AtencionSerializer, InsumoSerializer,
    DomicilioSerializer, AtencionInsumoSerializer, ProfesionalSerializer,
    CustomTokenObtainPairSerializer, CandidatoSerializer, InstitucionSerializer,
    InstitucionAnimalSerializer, PeticionAdopcionSerializer, AdopcionSerializer,
    AdopcionFotoSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView
from decouple import config
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction


class ResponsableViewSet(viewsets.ModelViewSet):
    queryset = Responsable.objects.prefetch_related('animal_set').all()
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
    queryset = Animal.objects.select_related(
        'id_responsable', 'id_especie', 'id_raza').all()
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
        id_responsable = self.request.data.get('id_responsable')
        responsable = None
        if id_responsable:
            responsable = Responsable.objects.get(id=id_responsable)
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


class AtencionViewSet(viewsets.ModelViewSet):
    queryset = Atencion.objects.select_related(
        'id_animal__id_especie', 'id_responsable', 'id_efector', 'id_profesional').all()
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
    queryset = Profesional.objects.all()
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


class CandidatoViewSet(viewsets.ModelViewSet):
    queryset = Candidato.objects.all()
    serializer_class = CandidatoSerializer


class InstitucionViewSet(viewsets.ModelViewSet):
    queryset = Institucion.objects.all()
    serializer_class = InstitucionSerializer


class PeticionAdopcionViewSet(viewsets.ModelViewSet):
    queryset = PeticionAdopcion.objects.all()
    serializer_class = PeticionAdopcionSerializer


class InstitucionAnimalViewSet(viewsets.ModelViewSet):
    queryset = InstitucionAnimal.objects.select_related('id_animal')
    serializer_class = InstitucionAnimalSerializer

    @action(detail=False, methods=['get'], url_path='institucion')
    def search(self, request):
        id_institucion = request.query_params.get('id_institucion')

        queryset = self.queryset

        if id_institucion:
            queryset = queryset.filter(id_institucion=id_institucion, estado=1)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdopcionFotoViewSet(viewsets.ModelViewSet):
    """
    GET    /api/adopcion_foto/?id_institucion_animal=5  → filtra por publicación
    POST   /api/adopcion_foto/                         → agrega UNA o VARIAS fotos
    PUT    /api/adopcion_foto/{id}/                    → actualizar descripción/orden (o reemplazar file)
    """
    queryset = AdopcionFoto.objects.all().order_by('orden')
    serializer_class = AdopcionFotoSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        qs = super().get_queryset()
        id_ia = self.request.query_params.get('id_institucion_animal')
        if id_ia:
            return qs.filter(id_institucion_animal_id=id_ia).order_by('orden')
        return qs
    
    def perform_save(self, foto, file_obj):
        foto.image_data = file_obj.read()
        foto.mime_type  = file_obj.content_type
        foto.save()

    def create(self, request, *args, **kwargs):
        """
        Soporta dos modos de POST:
          1) BULK: si vienen múltiples archivos, 
                junta todas las keys con los índices, los ordena
                por <índice>, y hace bulk_create().

          2) SINGLE: si viene un solo archivo, crea una sola instancia.
        """
        data = request.data

        # 1) Extrae el id_institucion_animal (si no existe → 400)
        id_ia = data.get('id_institucion_animal')
        if not id_ia:
            return Response(
                {'detail': "Falta 'id_institucion_animal' en el request."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2) Verifica si vienen múltiples archivos bajo "files"
        all_files = request.FILES.getlist('files')
        if all_files:
            desc_pattern = re.compile(r"^descripciones\[(\d+)\]$")
            orden_pattern = re.compile(r"^ordenes\[(\d+)\]$")

            indexed_desc = []
            indexed_ord = []

            # Recorre todos los campos de request.data
            for key, val in data.items():
                m1 = desc_pattern.match(key)
                if m1:
                    idx = int(m1.group(1))
                    indexed_desc.append((idx, val))
                    continue

                m2 = orden_pattern.match(key)
                if m2:
                    idx = int(m2.group(1))
                    # “val” puede venir como string; convertimos a int si es posible
                    try:
                        idx_ord = int(val)
                    except (TypeError, ValueError):
                        idx_ord = 0
                    indexed_ord.append((idx, idx_ord))
                    continue

            # Ordena las listas por <índice>
            indexed_desc.sort(key=lambda x: x[0])
            indexed_ord.sort(key=lambda x: x[0])

            # Extrae solo los valores (en el orden correcto)
            descripciones = [v for _, v in indexed_desc]
            ordenes = [v for _, v in indexed_ord]

            # Valida que las listas tengan la misma longitud
            if len(all_files) != len(descripciones) or len(all_files) != len(ordenes):
                return Response(
                    {
                        'detail': (
                            "Si envía varios archivos en 'files', debe incluir "
                            "tanto 'descripciones[<i>]’ como 'ordenes[<i>]' para cada índice."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Arma la lista de AdopcionFoto
            fotos = []
            for idx, file_obj in enumerate(all_files):
                foto = AdopcionFoto(
                    id_institucion_animal_id=id_ia,
                    descripcion=descripciones[idx],
                    orden=ordenes[idx],
                )

                foto.image_data = file_obj.read()
                foto.mime_type  = file_obj.content_type
                fotos.append(foto)

            # Hace el Bulk‐create en una sola transacción
            with transaction.atomic():
                created_list = AdopcionFoto.objects.bulk_create(fotos)

            serializer = self.get_serializer(created_list, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # 3) Si vino un solo file
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'detail': "Debe enviar al menos un 'file'."},
                            status=status.HTTP_400_BAD_REQUEST)

        foto = AdopcionFoto(
            id_institucion_animal_id=id_ia,
            descripcion=request.data.get('descripcion', ''),
            orden=int(request.data.get('orden', 0) or 0),
        )
        self.perform_save(foto, file_obj)

        serializer = self.get_serializer(foto)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        file_obj = request.FILES.get('file')
        if file_obj:
            instance.image_data = file_obj.read()
            instance.mime_type  = file_obj.content_type

        if 'descripcion' in request.data:
            instance.descripcion = request.data['descripcion']
        if 'orden' in request.data:
            try:
                instance.orden = int(request.data['orden'])
            except ValueError:
                pass

        instance.save()
        return Response(self.get_serializer(instance).data)
    

class AdopcionViewSet(viewsets.ModelViewSet):
    queryset = Adopcion.objects.all()
    serializer_class = AdopcionSerializer

