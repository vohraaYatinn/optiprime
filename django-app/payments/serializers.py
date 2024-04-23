from rest_framework import serializers

from UsersDetails.models import UsersDetails
from payments.models import mainPaymentTransactions, paymentWithdrawal, paymentTransactions


class mainPaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = mainPaymentTransactions
        fields = "__all__"


class paymentWithdrawSerializer(serializers.ModelSerializer):

    class Meta:
        model = paymentWithdrawal
        fields = "__all__"


class paymentTransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = paymentTransactions
        fields = "__all__"



class UsersDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersDetails
        fields = "__all__"

class paymentWithdrawSerializerUser(serializers.ModelSerializer):
    user = UsersDetailsSerializer()
    class Meta:
        model = paymentWithdrawal
        fields = "__all__"


class paymentTransactionSerializerUser(serializers.ModelSerializer):
    user = UsersDetailsSerializer()
    class Meta:
        model = paymentTransactions
        fields = "__all__"
