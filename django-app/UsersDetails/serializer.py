from rest_framework import serializers

from CoinsSystem.models import CoinsSystem
from CoinsSystem.serializer import CoinSystemSerializer
from UsersDetails.models import UsersDetails, CustomerDetails, InvoicesTable

class UserCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerDetails
        fields = "__all__"

class CoinSystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoinsSystem
        fields = "__all__"


class UsersDetailsSerializer(serializers.ModelSerializer):
    user_coins = CoinSystemSerializer(many=True)
    user = UserCompanySerializer(many=True)
    class Meta:
        model = UsersDetails
        fields = "__all__"


class UsersDetailsWithCoinsSerializer(serializers.ModelSerializer):
    coins_user = CoinSystemSerializer(many=True)
    class Meta:
        model = UsersDetails
        fields = "__all__"


class CustomerDetailsSerializer(serializers.ModelSerializer):
    user = UsersDetailsWithCoinsSerializer()
    class Meta:
        model = CustomerDetails
        fields = "__all__"


class PDFFileSerializer(serializers.ModelSerializer):
    user = UsersDetailsSerializer()
    class Meta:
        model = InvoicesTable
        fields = '__all__'