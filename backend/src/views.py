from .models import Responsable, Especie, Raza, Efector, Animal, Atencion, Insumo, Domicilio, AtencionInsumo, Profesional
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.exceptions import NotFound
from .serializers import ResponsableSerializer, AnimalSerializer, RazaSerializer, EfectorSerializer, AtencionSerializer, InsumoSerializer, DomicilioSerializer, AtencionInsumoSerializer, ProfesionalSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class ResponsableViewSet(viewsets.ModelViewSet):
    queryset = Responsable.objects.all()
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
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

    def update(self, request, pk=None):
        animal = self.get_object()
        serializer = self.get_serializer(animal, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        animal = self.get_object()
        animal.delete()
        return Response(status=204)

    def perform_create(self, serializer):
        responsable = Responsable.objects.get(
            id_responsable=self.request.data['id_responsable'])
        especie = Especie.objects.get(
            id_especie=self.request.data['id_especie'])
        raza = Raza.objects.get(id_raza=self.request.data['id_raza'])

        serializer.save(id_responsable=responsable,
                        id_especie=especie, id_raza=raza)


class RazaViewSet(viewsets.ModelViewSet):
    queryset = Raza.objects.all()
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
    queryset = Atencion.objects.all()
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
            raise NotFound('El domicilio no está registrado en la base de datos.')

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

