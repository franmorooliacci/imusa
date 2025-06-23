from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import (
    Responsable, Animal, Raza,
    Efector, Insumo, Atencion, 
    Domicilio, AtencionInsumo, Profesional, 
    Color, Tamaño
)


class RazaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Raza
        fields = '__all__'


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = '__all__'


class TamañoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tamaño
        fields = '__all__'


class AnimalSerializer(serializers.ModelSerializer):
    raza = serializers.CharField(source='id_raza.nombre', read_only=True, required=False)
    tamaño = serializers.CharField(source='id_tamaño.nombre', read_only=True)
    colores = ColorSerializer(many=True, read_only=True)
    edad = serializers.SerializerMethodField()

    class Meta:
        model = Animal
        fields = '__all__'

    def get_edad(self, obj):
        birth = obj.fecha_nacimiento
        if not birth:
            return None

        from datetime import date
        today  = date.today()
        years  = today.year  - birth.year
        months = today.month - birth.month

        if months < 0:
            years  -= 1
            months += 12

        return f"{years} años {months} meses"


class DomicilioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domicilio
        fields = '__all__'


class ResponsableSerializer(serializers.ModelSerializer):
    felinos = AnimalSerializer(source='felinos_cache', many=True, read_only=True)
    caninos = AnimalSerializer(source='caninos_cache', many=True, read_only=True)
    domicilio_actual = DomicilioSerializer(source='id_domicilio_actual', read_only=True, required=False)
    edad = serializers.SerializerMethodField()

    class Meta:
        model = Responsable
        fields = '__all__'

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
    efector_nombre     = serializers.CharField(source='id_efector.nombre', read_only=True)
    profesional_nombre = serializers.CharField(source='profesional_full_name', read_only=True)
    animal = AnimalSerializer(source='id_animal', read_only=True, required=False)
    insumos = InsumoSerializer(many=True, read_only=True)

    class Meta:
        model = Atencion
        fields = '__all__'


class AtencionInsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AtencionInsumo
        fields = '__all__'


class ProfesionalSerializer(serializers.ModelSerializer):
    efectores = EfectorSerializer(many=True, read_only=True)

    class Meta:
        model = Profesional
        fields = '__all__'



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        data['username'] = user.username

        profesional = getattr(user, 'profesional', None)
        data['profesional'] = (
            ProfesionalSerializer(profesional, context=self.context).data
            if profesional else None
        )

        if profesional:
            efectores_qs = profesional.efectores.filter(
                profesionalefector__estado=1
            )
            data['efectores'] = EfectorSerializer(
                efectores_qs,
                many=True,
                context=self.context
            ).data
        else:
            data['efectores'] = []

        return data

