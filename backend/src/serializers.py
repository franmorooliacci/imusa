from __future__ import annotations
from typing import Any, cast
from django.contrib.auth.models import AbstractUser
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import (
    Persona, Animal, Raza,
    Efector, Insumo, Atencion, 
    Domicilio, AtencionInsumo, Personal, 
    Color, Tamaño
)


class RazaSerializer(serializers.ModelSerializer[Raza]):
    class Meta:
        model = Raza
        fields = '__all__'


class ColorSerializer(serializers.ModelSerializer[Color]):
    class Meta:
        model = Color
        fields = '__all__'


class TamañoSerializer(serializers.ModelSerializer[Tamaño]):
    class Meta:
        model = Tamaño
        fields = '__all__'


class AnimalSerializer(serializers.ModelSerializer[Animal]):
    colores = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(),
        many=True
    )
    raza: serializers.CharField = serializers.CharField(source='id_raza.nombre', read_only=True, required=False)
    tamaño: serializers.CharField = serializers.CharField(source='id_tamaño.nombre', read_only=True)
    edad: serializers.SerializerMethodField = serializers.SerializerMethodField()

    class Meta:
        model  = Animal
        fields = [
            'id', 'nombre', 'sexo', 'fecha_nacimiento',
            'id_tamaño', 'id_responsable', 'id_especie', 'id_raza',
            'fallecido', 'esterilizado', 'adoptado_imusa',
            'colores',
            'raza', 'tamaño', 'edad',
        ]

    def create(self, validated_data: dict[str, Any]) -> Animal:
        colores = validated_data.pop('colores', [])
        animal = super().create(validated_data)
        animal.colores.set(colores)
        return animal

    def update(self, instance: Animal, validated_data: dict[str, Any]) -> Animal:
        colores = validated_data.pop('colores', None)
        animal = super().update(instance, validated_data)
        if colores is not None:
            animal.colores.set(colores)
        return animal

    # POST/PUT/PATCH -> colores: [ids]
    # GET            -> colores: [{id, nombre}]
    def to_representation(self, instance: Animal) -> dict[str, Any]:
        data = super().to_representation(instance)
        data['colores'] = ColorSerializer(instance.colores.all(), many=True).data
        return data

    def get_edad(self, obj: Animal) -> str | None:
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


class DomicilioSerializer(serializers.ModelSerializer[Domicilio]):
    class Meta:
        model = Domicilio
        fields = '__all__'


class PersonaSerializer(serializers.ModelSerializer[Persona]):
    felinos: AnimalSerializer = AnimalSerializer(source='felinos_cache', many=True, read_only=True)
    caninos: AnimalSerializer = AnimalSerializer(source='caninos_cache', many=True, read_only=True)
    domicilio_actual: DomicilioSerializer = DomicilioSerializer(source='id_domicilio_actual', read_only=True, required=False)
    edad: serializers.SerializerMethodField = serializers.SerializerMethodField()

    class Meta:
        model = Persona
        fields = '__all__'

    def get_edad(self, obj: Persona) -> int | None:
        from datetime import date
        if obj.fecha_nacimiento:
            today = date.today()
            return today.year - obj.fecha_nacimiento.year - (
                (today.month, today.day) < (
                    obj.fecha_nacimiento.month, obj.fecha_nacimiento.day)
            )
        return None


class EfectorSerializer(serializers.ModelSerializer[Efector]):
    class Meta:
        model = Efector
        fields = ['id', 'nombre', 'unidad_movil']


class InsumoSerializer(serializers.ModelSerializer[Insumo]):
    class Meta:
        model = Insumo
        fields = '__all__'


class AtencionSerializer(serializers.ModelSerializer[Atencion]):
    efector_nombre: serializers.CharField = serializers.CharField(source='id_efector.nombre', read_only=True)
    personal_nombre: serializers.CharField  = serializers.CharField(source='personal_full_name', read_only=True)
    animal: AnimalSerializer = AnimalSerializer(source='id_animal', read_only=True, required=False)
    insumos: InsumoSerializer = InsumoSerializer(many=True, read_only=True)

    class Meta:
        model = Atencion
        fields = '__all__'


class AtencionInsumoSerializer(serializers.ModelSerializer[AtencionInsumo]):
    class Meta:
        model = AtencionInsumo
        fields = '__all__'


class PersonalSerializer(serializers.ModelSerializer[Personal]):
    persona: PersonaSerializer = PersonaSerializer(source='id_persona', read_only=True, required=False)
    efectores: EfectorSerializer = EfectorSerializer(many=True, read_only=True)

    class Meta:
        model = Personal
        fields = '__all__'



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        data: dict[str, Any] = super().validate(attrs)

        user = cast(AbstractUser, self.user)
        data['username'] = user.username

        personal: Personal | None = getattr(user, 'personal', None)
        data['personal'] = (
            PersonalSerializer(personal, context=self.context).data
            if personal else None
        )

        return data

