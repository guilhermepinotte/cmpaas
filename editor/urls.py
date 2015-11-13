from django.conf.urls import url

from . import views

urlpatterns = [
    # ex: /editor/
    url(r'^$', views.index, name='index'),
    # ex: /editor/save/
    url(r'^save/$', views.saveMap, name='save'),
    # ex: /editor/load/
    url(r'^load/$', views.loadMap, name='load'),

    # ex: /editor/5/
    # url(r'^(?P<question_id>[0-9]+)/$', views.detail, name='detail'),
    # # ex: /editor/5/results/
    # url(r'^(?P<question_id>[0-9]+)/results/$', views.results, name='results'),
    # # ex: /editor/5/vote/
    # url(r'^(?P<question_id>[0-9]+)/vote/$', views.vote, name='vote'),
]