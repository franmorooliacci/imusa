from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    PersonaViewSet, AnimalViewSet, RazaViewSet, 
    EfectorViewSet, CirugiaViewSet, InsumoViewSet, 
    DomicilioViewSet, CirugiaInsumoViewSet, PersonalViewSet, 
    CustomTokenObtainPairView, ExternalDataViewSet, InformeAPIView,
    ColorViewSet, TamañoViewSet, SendInformeEmailAPIView, TipoCirugiaViewSet,
    EstadoEgresoViewSet, ConsultaViewSet, ConsultaInsumoViewSet, 
    MotivoConsultaViewSet, ConsultaMotivoConsultaViewSet, AtencionesView
)

router = DefaultRouter()
router.register('personas', PersonaViewSet, basename='persona')
router.register('animales', AnimalViewSet, basename='animal')
router.register('razas', RazaViewSet, basename='raza')
router.register('efectores', EfectorViewSet, basename='efector')
router.register('cirugias', CirugiaViewSet, basename='cirugia')
router.register('consultas', ConsultaViewSet, basename='consulta')
router.register('insumos', InsumoViewSet, basename='insumo')
router.register('domicilios', DomicilioViewSet, basename='domicilio')
router.register('cirugia_insumo', CirugiaInsumoViewSet, basename='cirugia_insumo')
router.register('consulta_insumo', ConsultaInsumoViewSet, basename='consulta_insumo')
router.register('personal', PersonalViewSet, basename='personal')
router.register('external_data', ExternalDataViewSet, basename='external_data')
router.register('colores', ColorViewSet, basename='color')
router.register('tamaños', TamañoViewSet, basename='tamaño')
router.register('tipos_cirugia', TipoCirugiaViewSet, basename='tipo_cirugia')
router.register('estados_egreso', EstadoEgresoViewSet, basename='estado_egreso')
router.register('motivos_consulta', MotivoConsultaViewSet, basename='motivo_consulta')
router.register('consulta_motivo_consulta', ConsultaMotivoConsultaViewSet, basename='consulta_motivo_consulta')
router.register('pesonal', ,base_name='personal')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('informes/', InformeAPIView.as_view(), name='informe'),
    path('informes/email/', SendInformeEmailAPIView.as_view(), name='informe_email'),
    path('atenciones',AtencionesView.as_view(), name='atenciones')
]
