from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    text = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    like = models.IntegerField(default=0)
    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "post": self.text,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "like": self.like,
        }
        
class Follow(models.Model):
    followed = models.ForeignKey("User", on_delete=models.CASCADE, related_name = "follow")
    follower = models.ForeignKey("User", on_delete=models.CASCADE, related_name = "follower")

    