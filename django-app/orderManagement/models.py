from django.db import models
from UsersDetails.models import UsersDetails
from django.utils import timezone

from orderManagement.constants import deliveryConstants
from productManagement.models import ProductsCustomer

import datetime


class ordersCreated(models.Model):
    order_unique_id = models.CharField(max_length=10 , null=True)
    customer_address = models.TextField(null=True)
    created_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(UsersDetails, max_length=100, on_delete=models.CASCADE, related_name="user_id_order", null=True)

    class Meta:
        managed = True
        db_table = "orders_created"

class lineOrderCreated(models.Model):
    line_unique_id = models.CharField(max_length=10 , null=True)
    order_id = models.ForeignKey(ordersCreated, max_length=100, on_delete=models.CASCADE, related_name="order_id", null=True)

    product_obj = models.ForeignKey(ProductsCustomer, max_length=100, on_delete=models.CASCADE, related_name="product_obj", null=True)
    quantity = models.IntegerField(null=True, default=1)
    status = models.CharField(max_length=15, default=deliveryConstants.status['draft'])
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = "line_order_created"



class pendingQuery(models.Model):
    full_name = models.CharField(max_length=40)
    phone_name = models.CharField(max_length=20)
    email = models.CharField(max_length=40)
    comment = models.TextField()
    status = models.CharField(max_length=10)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = "pending_query"