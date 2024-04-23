from rest_framework import serializers
from productManagement.models import ProductsCustomer
from UsersDetails.models import UsersDetails


class UsersDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersDetails
        fields = "__all__"


class ProductsCustomerSerializer(serializers.ModelSerializer):
    user = UsersDetailsSerializer()

    class Meta:
        model = ProductsCustomer
        fields = "__all__"
