from django.db import models
import datetime
from UsersDetails.models import UsersDetails
from django.utils import timezone

class CoinsSystem(models.Model):
    user = models.ForeignKey(UsersDetails, max_length=100, on_delete=models.CASCADE, related_name="user_coins")
    coin = models.TextField(null=True)
    last_updated = models.DateTimeField(default=timezone.now)
    class Meta:
        managed = True
        db_table = "coin_systems"


class CoinsRequest(models.Model):
    user = models.ForeignKey(UsersDetails, max_length=100, on_delete=models.CASCADE, related_name="user_coins_request")
    coin_amount = models.IntegerField(null=True)
    request_type = models.CharField(max_length=20)
    status = models.CharField(max_length=10, default="pending")
    last_updated = models.DateTimeField(default=timezone.now)
    class Meta:
        managed = True
        db_table = "coin_request"
