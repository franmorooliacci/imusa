from django.urls import path, re_path, include
from django.views.generic import TemplateView, RedirectView

urlpatterns = [
    path("api/", include("src.urls")),
    path("", TemplateView.as_view(template_name="index.html"), name="react_app"),
]

urlpatterns += [
    path(
        "favicon.ico", RedirectView.as_view(url="/static/favicon.ico", permanent=True)
    ),
]

urlpatterns += [
    re_path(
        r"^(?!api/|admin/|static/|media/).*$",
        TemplateView.as_view(template_name="index.html"),
    ),
]

