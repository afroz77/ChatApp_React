from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

class Message(models.Model):
    auther = models.ForeignKey(User, related_name='auther_message', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.auther.username
    
    def last_10_message():
        return Message.objects.order_by('-timestamp').all()[:10]