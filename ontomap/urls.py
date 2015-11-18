from django.conf.urls import url

from . import views

urlpatterns = [
    # ex: /ontomap/
    url(r'^$', views.index, name='index'),

]