from rest_framework import serializers
from .models import Responsable, Animal, Especie, Raza, Efector, Insumo, Atencion, Domicilio, AtencionInsumo, Profesional, ProfesionalEfector
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class EspecieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especie
        fields = '__all__'


class RazaSerializer(serializers.ModelSerializer):
    especie = EspecieSerializer(
        source='id_especie', read_only=True, required=False)

    class Meta:
        model = Raza
        fields = '__all__'


class AnimalSerializer(serializers.ModelSerializer):
    especie = EspecieSerializer(
        source='id_especie', read_only=True, required=False)
    raza = RazaSerializer(source='id_raza', read_only=True, required=False)

    raza_nombre = serializers.SerializerMethodField()
    edad = serializers.SerializerMethodField()
    raza_tamaño = serializers.SerializerMethodField()

    class Meta:
        model = Animal
        fields = '__all__'

    def get_raza_nombre(self, obj):
        return obj.id_raza.nombre

    def get_raza_tamaño(self, obj):
        return obj.id_raza.tamaño

    def get_edad(self, obj):
        from datetime import date
        if obj.año_nacimiento:
            current_year = date.today().year
            return current_year - obj.año_nacimiento
        return None


class DomicilioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domicilio
        fields = '__all__'


class ResponsableSerializer(serializers.ModelSerializer):
    felinos = serializers.SerializerMethodField()
    caninos = serializers.SerializerMethodField()
    edad = serializers.SerializerMethodField()
    domicilio_actual = DomicilioSerializer(
        source='id_domicilio_actual', read_only=True, required=False)

    class Meta:
        model = Responsable
        fields = '__all__'

    def get_felinos(self, obj):
        felinos = Animal.objects.filter(
            id_responsable=obj.id, id_especie=2)
        return AnimalSerializer(felinos, many=True).data

    def get_caninos(self, obj):
        caninos = Animal.objects.filter(
            id_responsable=obj.id, id_especie=1)
        return AnimalSerializer(caninos, many=True).data

    def get_edad(self, obj):
        from datetime import date
        if obj.fecha_nacimiento:
            today = date.today()
            return today.year - obj.fecha_nacimiento.year - (
                (today.month, today.day) < (
                    obj.fecha_nacimiento.month, obj.fecha_nacimiento.day)
            )
        return None


class EfectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Efector
        fields = ['id', 'nombre', 'unidad_movil']


class InsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insumo
        fields = '__all__'


class AtencionSerializer(serializers.ModelSerializer):
    efector_nombre = serializers.SerializerMethodField()
    profesional_nombre = serializers.SerializerMethodField()
    animal = AnimalSerializer(
        source='id_animal', read_only=True, required=False)

    class Meta:
        model = Atencion
        fields = '__all__'

    def get_efector_nombre(self, obj):
        return obj.id_efector.nombre

    def get_profesional_nombre(self, obj):
        nombre = obj.id_profesional.nombre
        apellido = obj.id_profesional.apellido
        return nombre + ' ' + apellido


class AtencionInsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AtencionInsumo
        fields = '__all__'


class ProfesionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesional
        fields = '__all__'


class ProfesionalEfectorSerializer(serializers.ModelSerializer):
    id_efector = serializers.IntegerField(source='id_efector.id')
    nombre = serializers.CharField(source='id_efector.nombre')
    unidad_movil = serializers.IntegerField(source='id_efector.unidad_movil')

    class Meta:
        model = ProfesionalEfector
        fields = ['id_efector', 'nombre', 'unidad_movil']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        data['username'] = user.username

        profesional = getattr(user, 'profesional', None)
        data['profesional'] = (
            ProfesionalSerializer(profesional).data
            if profesional else None
        )

        if profesional:
            prof_efecs = profesional.profesionalefector_set\
                .filter(estado=1)\
                .select_related('id_efector')
            data['efectores'] = ProfesionalEfectorSerializer(
                prof_efecs, many=True).data
        else:
            data['efectores'] = []

        return data
