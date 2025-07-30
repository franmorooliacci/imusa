from django.db import models
from django.conf import settings


class Domicilio(models.Model):
    id = models.AutoField(primary_key=True)
    calle = models.CharField(max_length=255)
    codigo_calle = models.IntegerField(blank=True, null=True)
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
    lineas_tup = models.CharField(max_length=500, blank=True, null=True)
    coordenada_x = models.CharField(max_length=255, blank=True, null=True)
    coordenada_y = models.CharField(max_length=255, blank=True, null=True)
    fraccion_censal = models.CharField(max_length=255, blank=True, null=True)
    radio_censal = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'domicilio'


class Persona(models.Model):
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

    class Meta:
        managed = False
        db_table = 'persona'

class Institucion(models.Model):
    id = models.AutoField(primary_key=True)
    nombre  = models.CharField(max_length=255)
    id_representante = models.ForeignKey(
        Persona, models.DO_NOTHING, db_column='id_responsable')
    
    class Meta:
        managed = False
        db_table = 'institucion'

class Especie(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'especie'


class Raza(models.Model):
    id = models.AutoField(primary_key=True)
    id_especie = models.ForeignKey(
        Especie, models.DO_NOTHING, db_column='id_especie')
    nombre = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'raza'


class Color(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'color'


class Tamaño(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'tamaño'


class Animal(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    sexo = models.CharField(max_length=1)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    id_tamaño = models.ForeignKey(Tamaño, models.DO_NOTHING, db_column='id_tamaño')
    id_responsable = models.ForeignKey(Persona, models.DO_NOTHING, db_column='id_responsable', blank=True, null=True)
    id_especie = models.ForeignKey(Especie, models.DO_NOTHING, db_column='id_especie')
    id_raza = models.ForeignKey('Raza', models.DO_NOTHING, db_column='id_raza')
    fallecido = models.IntegerField()
    esterilizado = models.IntegerField()
    adoptado_imusa = models.IntegerField()
    colores = models.ManyToManyField(Color, through='AnimalColor')

    class Meta:
        managed = False
        db_table = 'animal'


class AnimalColor(models.Model):
    id = models.AutoField(primary_key=True)
    id_animal = models.ForeignKey(Animal, models.DO_NOTHING, db_column='id_animal')
    id_color = models.ForeignKey(Color, models.DO_NOTHING, db_column='id_color')

    class Meta:
        managed = False
        db_table = 'animal_color'


class TipoEfector(models.Model):
    id     = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    class Meta:
        db_table  = 'tipo_efector'
        managed   = False


class Efector(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    id_domicilio = models.ForeignKey(Domicilio, models.DO_NOTHING, db_column='id_domicilio')
    id_tipo_efector = models.ForeignKey(TipoEfector, models.DO_NOTHING, db_column='id_tipo_efector')
    unidad_movil = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'efector'


class Servicio(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'servicio'


class TipoPersonal(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'tipo_personal'


class Personal(models.Model):
    id = models.AutoField(primary_key=True)
    id_persona = models.ForeignKey(Persona, models.DO_NOTHING, db_column='id_persona')
    matricula = models.CharField(max_length=15)
    firma = models.TextField(null=True)
    legajo = models.IntegerField()
    estado = models.IntegerField()
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING, null=True)
    efectores = models.ManyToManyField(Efector, through='PersonalEfector')
    id_tipo_personal = models.ForeignKey(TipoPersonal, models.DO_NOTHING, db_column='id_tipo_personal')

    class Meta:
        managed = False
        db_table = 'personal'


class PersonalEfector(models.Model):
    id = models.AutoField(primary_key=True)
    id_personal = models.ForeignKey(
        Personal, models.DO_NOTHING, db_column='id_personal')
    id_efector = models.ForeignKey(
        Efector, models.DO_NOTHING, db_column='id_efector')
    estado = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'personal_efector'


class Insumo(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    cant_min = models.IntegerField()
    cant_max = models.IntegerField()
    consulta = models.IntegerField()
    cirugia = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'insumo'


class TipoCirugia(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    
    class Meta:
        managed = False
        db_table = 'tipo_cirugia'


class EstadoEgreso(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'estado_egreso' 

class Cirugia(models.Model):
    id = models.AutoField(primary_key=True)
    id_animal = models.ForeignKey(
        Animal, models.DO_NOTHING, db_column='id_animal')
    id_responsable = models.ForeignKey(
        Persona, models.DO_NOTHING, db_column='id_responsable',  blank=True, null=True, related_name='cirugia_responsable')
    id_responsable_atencion = models.ForeignKey(
        Persona, models.DO_NOTHING, db_column='id_responsable_atencion',  blank=True, null=True, related_name='cirugia_responsable_atencion')
    id_domicilio_responsable = models.ForeignKey(
        Domicilio, models.DO_NOTHING, db_column='id_domicilio_responsable', blank=True, null=True)
    id_intitucion = models.ForeignKey(
        Institucion, models.DO_NOTHING, db_column='id_institucion', blank=True, null=True)
    id_efector = models.ForeignKey(
        Efector, models.DO_NOTHING, db_column='id_efector')
    id_personal = models.ForeignKey(
        Personal, models.DO_NOTHING, db_column='id_personal')
    fecha = models.DateField(blank=True, null=True)
    hora_ingreso = models.TimeField(blank=True, null=True)
    firma_ingreso = models.TextField(null=True)
    hora_egreso = models.TimeField(blank=True, null=True)
    firma_egreso = models.TextField(null=True)
    insumos = models.ManyToManyField(Insumo, through='CirugiaInsumo', related_name='cirugias') 
    id_tipo_cirugia = models.ForeignKey(
        TipoCirugia, models.DO_NOTHING, db_column='id_tipo_cirugia')
    id_estado_egreso =  models.ForeignKey(
        EstadoEgreso, models.DO_NOTHING, db_column='id_estado_egreso', blank=True, null=True)
    observaciones = models.CharField(
        max_length=255, blank=True, null=True)
    finalizada = models.IntegerField()
    
    class Meta:
        managed = False
        db_table = 'cirugia'


class CirugiaInsumo(models.Model):
    id = models.AutoField(primary_key=True)
    id_cirugia = models.ForeignKey(
        Cirugia, models.DO_NOTHING, db_column='id_cirugia')
    id_insumo = models.ForeignKey(
        Insumo, models.DO_NOTHING, db_column='id_insumo')
    cant_ml = models.IntegerField(blank=True, null=True)
    cant_ml_prequirurgico = models.IntegerField(blank=True, null=True)
    cant_ml_induccion = models.IntegerField(blank=True, null=True)
    cant_ml_quirofano = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cirugia_insumo'


class Diagnotisco(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    
    class Meta:
        managed = False
        db_table = 'diagnostico'


class MotivoConsulta(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'motivo_consulta'



class Consulta(models.Model):
    id = models.AutoField(primary_key=True)
    id_animal = models.ForeignKey(
        Animal, models.DO_NOTHING, db_column='id_animal')
    id_responsable = models.ForeignKey(
        Persona, models.DO_NOTHING, db_column='id_responsable',  blank=True, null=True, related_name='consulta_responsable')
    id_responsable_atencion = models.ForeignKey(
        Persona, models.DO_NOTHING, db_column='id_responsable_atencion',  blank=True, null=True, related_name='consulta_responsable_atencion')
    id_domicilio_responsable = models.ForeignKey(
        Domicilio, models.DO_NOTHING, db_column='id_domicilio_responsable', blank=True, null=True)
    id_intitucion = models.ForeignKey(
        Institucion, models.DO_NOTHING, db_column='id_institucion', blank=True, null=True)
    id_efector = models.ForeignKey(
        Efector, models.DO_NOTHING, db_column='id_efector')
    id_personal = models.ForeignKey(
        Personal, models.DO_NOTHING, db_column='id_personal')    
    fecha = models.DateField(blank=True, null=True)
    hora_ingreso = models.TimeField(blank=True, null=True)
    hora_egreso = models.TimeField(blank=True, null=True)
    insumos = models.ManyToManyField(Insumo, through='ConsultaInsumo', related_name='consultas') 
    motivos = models.ManyToManyField(MotivoConsulta, through='ConsultaMotivoConsulta')
    id_diagnostico = models.ForeignKey(
        Diagnotisco, models.DO_NOTHING, db_column='id_diagnostico')
    finalizada = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'consulta'



class ConsultaInsumo(models.Model):
    id = models.AutoField(primary_key=True)
    id_consulta = models.ForeignKey(
        Consulta, models.DO_NOTHING, db_column='id_consulta')
    id_insumo = models.ForeignKey(
        Insumo, models.DO_NOTHING, db_column='id_insumo')
    cant_ml = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'consulta_insumo'


class ConsultaMotivoConsulta(models.Model):
    id = models.AutoField(primary_key=True)
    id_consulta = models.ForeignKey(
        Consulta, models.DO_NOTHING, db_column='id_consulta')
    id_motivo = models.ForeignKey(
        MotivoConsulta, models.DO_NOTHING, db_column='id_motivo')
    
    class Meta:
        managed = False
        db_table = 'consulta_motivoconsulta'




class TipoLesion(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'tipo_lesion'


class ParteAnimal(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'parte_animal'


class Trauma(models.Model):
    id = models.AutoField(primary_key=True)
    id_consulta = models.ForeignKey(
        Consulta, models.DO_NOTHING, db_column='id_consulta')
    id_tipo_lesion = models.ForeignKey(
        TipoLesion, models.DO_NOTHING, db_column='id_tipo_lesion')
    id_parte_animal = models.ForeignKey(
        ParteAnimal, models.DO_NOTHING, db_column='id_parte_animal')
    
    class Meta:
        managed = False
        db_table = 'trauma'

class Seguimiento(models.Model):
    id_consulta = models.ForeignKey(
        Consulta, models.DO_NOTHING, db_column='id_consulta', related_name='seguimientos_asociados')
    id_seguimiento = models.ForeignKey(
        Consulta, models.DO_NOTHING, db_column='id_seguimiento', related_name='como_seguimiento_de')
