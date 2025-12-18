from django.urls import path, re_path, include
from django.views.generic import TemplateView, RedirectView
from django.templatetags.static import static

urlpatterns = [
    path('api/', include('src.urls')),
    path('favicon.ico', RedirectView.as_view(url=static('favicon.ico'), permanent=True)),
    path('', TemplateView.as_view(template_name='index.html')),
    re_path(r'^(?!api/|static/).*$', TemplateView.as_view(template_name='index.html')),
]
