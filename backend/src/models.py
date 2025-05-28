from django.db import models
from django.conf import settings


class Animal(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    sexo = models.CharField(max_length=1)
    año_nacimiento = models.IntegerField()
    pelaje_color = models.CharField(max_length=255, blank=True, null=True)
    id_responsable = models.ForeignKey(
        'Responsable', models.DO_NOTHING, db_column='id_responsable', blank=True, null=True)
    id_especie = models.ForeignKey(
        'Especie', models.DO_NOTHING, db_column='id_especie')
    id_raza = models.ForeignKey('Raza', models.DO_NOTHING, db_column='id_raza')
    fallecido = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'animal'


class Atencion(models.Model):
    id = models.AutoField(primary_key=True)
    id_efector = models.ForeignKey(
        'Efector', models.DO_NOTHING, db_column='id_efector')
    id_responsable = models.ForeignKey(
        'Responsable', models.DO_NOTHING, db_column='id_responsable')
    id_domicilio_responsable = models.ForeignKey(
        'Domicilio', models.DO_NOTHING, db_column='id_domicilio_responsable', blank=True, null=True)
    id_animal = models.ForeignKey(
        Animal, models.DO_NOTHING, db_column='id_animal')
    id_servicio = models.ForeignKey(
        'Servicio', models.DO_NOTHING, db_column='id_servicio')
    id_profesional = models.ForeignKey(
        'Profesional', models.DO_NOTHING, db_column='id_profesional')
    señas_particulares = models.CharField(
        max_length=255, blank=True, null=True)
    observaciones_animal = models.CharField(
        max_length=255, blank=True, null=True)
    fecha_ingreso = models.DateField(blank=True, null=True)
    hora_ingreso = models.TimeField(blank=True, null=True)
    fecha_egreso = models.DateField(blank=True, null=True)
    hora_egreso = models.TimeField(blank=True, null=True)
    estado_sanitario_egreso = models.CharField(
        max_length=255, blank=True, null=True)
    observaciones_atencion = models.CharField(
        max_length=255, blank=True, null=True)
    estado = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'atencion'


class AtencionInsumo(models.Model):
    id = models.AutoField(primary_key=True)
    id_atencion = models.ForeignKey(
        Atencion, models.DO_NOTHING, db_column='id_atencion')
    id_insumo = models.ForeignKey(
        'Insumo', models.DO_NOTHING, db_column='id_insumo')
    cant_ml = models.IntegerField(blank=True, null=True)
    cant_ml_prequirurgico = models.IntegerField(blank=True, null=True)
    cant_ml_induccion = models.IntegerField(blank=True, null=True)
    cant_ml_quirofano = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'atencion_insumo'


class Domicilio(models.Model):
    id = models.AutoField(primary_key=True)
    calle = models.CharField(max_length=255)
    altura = models.IntegerField()
    bis = models.IntegerField()
    letra = models.CharField(max_length=1, blank=True, null=True)
    piso = models.IntegerField(blank=True, null=True)
    depto = models.CharField(max_length=10, blank=True, null=True)
    monoblock = models.IntegerField(blank=True, null=True)
    barrio = models.CharField(max_length=255, blank=True, null=True)
    vecinal = models.CharField(max_length=255, blank=True, null=True)
    distrito = models.CharField(max_length=255, blank=True, null=True)
    seccional_policial = models.CharField(
        max_length=255, blank=True, null=True)
    localidad = models.CharField(max_length=255)
    coordenada_x = models.CharField(max_length=255, blank=True, null=True)
    coordenada_y = models.CharField(max_length=255, blank=True, null=True)
    punto_x = models.CharField(max_length=255, blank=True, null=True)
    punto_y = models.CharField(max_length=255, blank=True, null=True)
    latitud = models.CharField(max_length=255, blank=True, null=True)
    longitud = models.CharField(max_length=255, blank=True, null=True)
    fraccion_censal = models.CharField(max_length=255, blank=True, null=True)
    radio_censal = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'domicilio'


class Efector(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    domicilio = models.CharField(max_length=255)
    latitud = models.CharField(max_length=255, blank=True, null=True)
    longitud = models.CharField(max_length=255, blank=True, null=True)
    coordenadas = models.CharField(max_length=255, blank=True, null=True)
    distrito = models.CharField(max_length=255, blank=True, null=True)
    vecinal = models.CharField(max_length=255, blank=True, null=True)
    punto_x = models.CharField(max_length=255, blank=True, null=True)
    punto_y = models.CharField(max_length=255, blank=True, null=True)
    lineas_tup = models.CharField(max_length=500, blank=True, null=True)
    barrio = models.CharField(max_length=255, blank=True, null=True)
    fraccion_censal = models.CharField(max_length=255, blank=True, null=True)
    radio_censal = models.CharField(max_length=255, blank=True, null=True)
    tipo_efector = models.CharField(max_length=255, blank=True, null=True)
    unidad_movil = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'efector'


class Especie(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'especie'


class Insumo(models.Model):
    id = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=255)
    tope_max = models.IntegerField(blank=True, null=True)
    tope_min = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'insumo'


class Profesional(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    dni = models.IntegerField()
    sexo = models.CharField(max_length=1, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    mail = models.CharField(max_length=255, blank=True, null=True)
    matricula = models.CharField(max_length=15)
    firma = models.TextField(null=True)
    legajo = models.IntegerField()
    estado = models.IntegerField()
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

    class Meta:
        managed = False
        db_table = 'profesional'


class ProfesionalEfector(models.Model):
    id = models.AutoField(primary_key=True)
    id_profesional = models.ForeignKey(
        Profesional, models.DO_NOTHING, db_column='id_profesional')
    id_efector = models.ForeignKey(
        Efector, models.DO_NOTHING, db_column='id_efector')
    estado = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'profesional_efector'


class Raza(models.Model):
    id = models.AutoField(primary_key=True)
    id_especie = models.ForeignKey(
        Especie, models.DO_NOTHING, db_column='id_especie')
    nombre = models.CharField(max_length=255)
    tamaño = models.CharField(max_length=10)
    limite_inf_altura_cm = models.IntegerField(blank=True, null=True)
    limite_sup_altura_cm = models.IntegerField(blank=True, null=True)
    limite_inf_peso_kg = models.IntegerField(blank=True, null=True)
    limite_sup_peso_kg = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'raza'


class Responsable(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    dni = models.IntegerField()
    sexo = models.CharField(max_length=1)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    id_domicilio_renaper = models.ForeignKey(
        Domicilio, models.DO_NOTHING, db_column='id_domicilio_renaper', related_name='domicilio_renaper', blank=True, null=True)
    id_domicilio_actual = models.ForeignKey(
        Domicilio, models.DO_NOTHING, db_column='id_domicilio_actual', related_name='domicilio_actual')
    telefono = models.CharField(max_length=15, blank=True, null=True)
    mail = models.CharField(max_length=255, blank=True, null=True)
    firma = models.TextField(null=True)

    class Meta:
        managed = False
        db_table = 'responsable'


class Servicio(models.Model):
    id = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'servicio'
