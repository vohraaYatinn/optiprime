from django.db import models
from django.utils import timezone
from UsersDetails.models import UsersDetails


class ProductsCustomer(models.Model):
    user = models.ForeignKey(UsersDetails, max_length=100, on_delete=models.CASCADE, related_name="user_products")
    products_unique_id = models.CharField(max_length=50, null=True)
    photo_url = models.FileField(upload_to='static/products-photos/')
    product_name = models.CharField(max_length=30,null=True)
    product_drop_shipping_url = models.TextField(null=True)
    quoted_price = models.IntegerField(null=True)
    asked_price = models.IntegerField(null=True)
    description = models.TextField(null=True)
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = "products_customer"
