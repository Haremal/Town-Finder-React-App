from django.urls import path
from . import views

urlpatterns = [
    path('towns/', views.get_town_list, name='town_list'),
    path('towns/add/', views.add_town, name='add_town'),
    path('towns/delete/<int:id>/', views.delete_town, name='delete_town'),
    path('towns/search/', views.search_towns, name='search_town'),
]
