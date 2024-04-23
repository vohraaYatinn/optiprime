from rest_framework import serializers
from CoinsSystem.models import CoinsSystem, CoinsRequest
from UsersDetails.models import UsersDetails

class UsersDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersDetails
        fields = "__all__"


class CoinSystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoinsSystem
        fields = "__all__"


class coinSystemRequestSerializer(serializers.ModelSerializer):
    user = UsersDetailsSerializer()
    class Meta:
        model = CoinsRequest
        fields = "__all__"
