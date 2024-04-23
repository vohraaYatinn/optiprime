from rest_framework import serializers
from UsersDetails.serializer import UsersDetailsSerializer
from orderManagement.models import ordersCreated, pendingQuery, lineOrderCreated
from productManagement.models import ProductsCustomer


class ProductDetailsSerializer(serializers.ModelSerializer):
    user = UsersDetailsSerializer()

    class Meta:
        model = ProductsCustomer
        fields = "__all__"


class PendingCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = pendingQuery
        fields = "__all__"


class LineObjSerializer(serializers.ModelSerializer):
    product_obj = ProductDetailsSerializer()
    class Meta:
        model = lineOrderCreated
        fields = "__all__"


class OrderCategorySerializer(serializers.ModelSerializer):
    order_id = LineObjSerializer(many=True)

    class Meta:
        model = ordersCreated
        fields = "__all__"