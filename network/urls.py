
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("following_p", views.following_p, name="following_p"),
    
    #API Routes
    path("posts", views.n_post, name="n_post"),
    path("d_posts", views.d_post, name="d_post"),
    path("a_user", views.a_user, name="a_user"),
    path("p_follow", views.p_follow, name="p_follow"),
    path("is_following/<str:username>", views.is_following, name="is_following"),
    path("f_posts", views.f_posts, name="f_posts"),
]
