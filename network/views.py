from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import User, Post, Follow

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    
    
@csrf_exempt
@login_required
def n_post(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    post = data.get("text", "")
    if post == "":
        return JsonResponse({
            "error": "There is nothing to post."
        }, status=400)
    new_post = Post(
        user = request.user,
        text = post
    )
    new_post.save()
    return JsonResponse({"message": "Posted successfully."}, status=201)

def d_post(request):
    posts = Post.objects.all().order_by("-timestamp")
    return JsonResponse([post.serialize() for post in posts], safe=False)

def a_user(request):
    au_user = str(request.user)
        
    return JsonResponse({"au_user": au_user}, status=201)

def profile(request, username):
    follower_c = Follow.objects.filter(followed__username=username).count()
    following_c = Follow.objects.filter(follower__username=username).count()
    print(following_c)
    return render(request, "network/profile.html", {
        "follower": follower_c,
        "following": following_c,
        "p_name": username,
    })
@csrf_exempt  
@login_required
def p_follow(request):
    
    data = json.loads(request.body)
    flrs = Follow.objects.filter(followed__username=data["followed"])
    for i in flrs:
        if request.user == i.follower:
            f = Follow.objects.get(followed__username=data["followed"], follower__username=request.user)
            f.delete()
            return HttpResponse(status=204)
    fld = User.objects.get(username=data["followed"])
    new_f = Follow(
       followed=  fld,
       follower = request.user
    )
    new_f.save()
    return HttpResponse(status=204)

@login_required
def is_following(request, username):
    follower_c = Follow.objects.filter(followed__username=username).count()
    following_c = Follow.objects.filter(follower__username=username).count()
    flrs = Follow.objects.filter(followed__username=username)
    for i in flrs:
        if request.user == i.follower:
            stat = 'Following'
            return JsonResponse({
                    "stat": stat,
                    "follower_c": follower_c,
                    "following_c": following_c
                    } , safe=False)
    stat = 'Follow' 
    return JsonResponse({
                    "stat": stat,
                    "follower_c": follower_c,
                    "following_c": following_c
                    } , status=201)
    
@login_required
def following_p(request):
    return render(request, "network/following_p.html")

@login_required
def f_posts(request):
    f = []
    flwg = Follow.objects.filter(follower__username=request.user)
    for flw in flwg:
        f.append(flw.followed)
    posts = Post.objects.filter(user__in=f).order_by("-timestamp")
    return JsonResponse([post.serialize() for post in posts], safe=False)
