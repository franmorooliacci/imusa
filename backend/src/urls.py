from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView)
from .views import (
    ResponsableViewSet, AnimalViewSet, RazaViewSet, 
    EfectorViewSet, AtencionViewSet, InsumoViewSet, 
    DomicilioViewSet, AtencionInsumoViewSet, ProfesionalViewSet, 
    CustomTokenObtainPairView, ExternalDataViewSet, PDFAPIView
)

router = DefaultRouter()
router.register('responsables', ResponsableViewSet, basename='responsable')
router.register('animales', AnimalViewSet, basename='animal')
router.register('razas', RazaViewSet, basename='raza')
router.register('efectores', EfectorViewSet, basename='efector')
router.register('atenciones', AtencionViewSet, basename='atencion')
router.register('insumos', InsumoViewSet, basename='insumo')
router.register('domicilios', DomicilioViewSet, basename='domicilio')
router.register('atencion_insumo', AtencionInsumoViewSet,
                basename='atencion_insumo')
router.register('profesionales', ProfesionalViewSet, basename='profesional')
router.register('external_data', ExternalDataViewSet, basename='external_data')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('pdf/', PDFAPIView.as_view(), name='pdf'),

]
