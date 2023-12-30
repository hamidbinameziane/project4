
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
    #API Routes
    path("posts", views.n_post, name="n_post"),
    path("d_posts", views.d_post, name="d_post"),
    path("a_user", views.a_user, name="a_user"),
]
