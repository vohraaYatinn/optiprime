import datetime
from django.db import models
from django.utils import timezone


# Create your models here.
class UsersDetails(models.Model):
    full_name = models.CharField(max_length=200, null=False)
    email = models.EmailField(null=True)
    phone = models.CharField(max_length=20)
    country = models.CharField(max_length=20)
    password = models.CharField(max_length=20, null=True)
    verified = models.BooleanField(default=False)
    status = models.CharField(default="active", max_length=20)
    role = models.CharField(default="customer", max_length=20)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = "user_table"


class CustomerDetails(models.Model):
    user = models.ForeignKey(to=UsersDetails, max_length=100, on_delete=models.CASCADE, related_name="user")
    brand_name = models.CharField(max_length=20, null=True)
    company_address = models.TextField(null=True)

    class Meta:
        managed = True
        db_table = "customer_details"


class InvoicesTable(models.Model):
    user = models.ForeignKey(to=UsersDetails, max_length=100, on_delete=models.CASCADE, related_name="user_invoice")
    unique_id = models.CharField(max_length=10)
    amount = models.IntegerField()
    file = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = "invoices_table"

