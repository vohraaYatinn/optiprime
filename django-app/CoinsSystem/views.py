from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from CoinsSystem.manager import CoinsManager
from CoinsSystem.serializer import coinSystemRequestSerializer
from payments.serializers import paymentWithdrawSerializer, paymentTransactionSerializer, \
    paymentTransactionSerializerUser, paymentWithdrawSerializerUser


class coinsManagement(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            CoinsManager.coins_management_handling(data)
            return Response({"result":"success", "message": "Coins Updated Successfully"}, 200)
        except Exception as err:
            return Response(str(err), 500)


class coinsFetchCustomer(APIView):
    @staticmethod
    def get(request):
        try:
            data_obj = CoinsManager.coins_fetch_customer()
            data = coinSystemRequestSerializer(data_obj, many=True).data
            return Response({"result": "success", "data": data}, 200)
        except Exception as err:
            return Response(str(err), 500)


class coinsRequestCustomer(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            CoinsManager.coins_user_request(data)
            return Response({"result":"success", "message": "Your Request has been raised Successfully"}, 200)
        except Exception as err:
            return Response(str(err), 500)

class coinsFetchUser(APIView):
    @staticmethod
    def get(request):
        try:
            data = request.query_params
            coins_req = CoinsManager.coins_user_fetch(data)
            data = coinSystemRequestSerializer(coins_req, many=True).data
            return Response({"result":"success", "data" : data}, 200)
        except Exception as err:
            return Response(str(err), 500)


class coinsAdmin(APIView):
    @staticmethod
    def get(request):
        try:
            data = request.query_params
            payment, action = CoinsManager.coins_admin(data)
            required_data=[]
            if action == "withdraw":
                required_data = paymentWithdrawSerializerUser(payment, many=True).data
            elif action == "topup":
                required_data = paymentTransactionSerializerUser(payment, many=True).data
            return Response({"result":"success", "data" : required_data}, 200)
        except Exception as err:
            return Response(str(err), 500)


class withdrawAdminIssue(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            CoinsManager.coins_withdraw_amount_status(data)
            return Response({"result": "success", "message": "Status of the request has been changed successfully"}, 200)
        except Exception as err:
            return Response(str(err), 500)


class amountChangeUser(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            CoinsManager.user_amount_change(data)
            return Response({"result": "success", "message": "Status of the request has been changed successfully"}, 200)
        except Exception as err:
            return Response(str(err), 500)