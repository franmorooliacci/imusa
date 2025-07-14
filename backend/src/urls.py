from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    PersonaViewSet, AnimalViewSet, RazaViewSet, 
    EfectorViewSet, AtencionViewSet, InsumoViewSet, 
    DomicilioViewSet, AtencionInsumoViewSet, PersonalViewSet, 
    CustomTokenObtainPairView, ExternalDataViewSet, InformeAPIView,
    ColorViewSet, TamañoViewSet, SendInformeEmailAPIView
)

router = DefaultRouter()
router.register('personas', PersonaViewSet, basename='persona')
router.register('animales', AnimalViewSet, basename='animal')
router.register('razas', RazaViewSet, basename='raza')
router.register('efectores', EfectorViewSet, basename='efector')
router.register('atenciones', AtencionViewSet, basename='atencion')
router.register('insumos', InsumoViewSet, basename='insumo')
router.register('domicilios', DomicilioViewSet, basename='domicilio')
router.register('atencion_insumo', AtencionInsumoViewSet, basename='atencion_insumo')
router.register('personal', PersonalViewSet, basename='personal')
router.register('external_data', ExternalDataViewSet, basename='external_data')
router.register('colores', ColorViewSet, basename='color')
router.register('tamaños', TamañoViewSet, basename='tamaño')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('informes/', InformeAPIView.as_view(), name='informe'),
    path('informes/email/', SendInformeEmailAPIView.as_view(), name='informe_email')
]
