from rest_framework.response import Response
from rest_framework.views import APIView
import jwt

from UsersDetails.manager import UserManager
from UsersDetails.serializer import CustomerDetailsSerializer, PDFFileSerializer, UsersDetailsSerializer


class user_auth(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            loggined_user = False
            token = False
            login_verified, login_user_admin = UserManager.login_user_admin(data)
            if(login_verified):
                loggined_user = UsersDetailsSerializer(login_user_admin).data
                payload = {
                    'email': login_user_admin.email,
                    'role': login_user_admin.role
                }
                token = jwt.encode(payload, 'secretKeyRight34', algorithm='HS256')
            return Response({"result" : "success", "data": login_verified, "loginUser": loggined_user, "token":token}, 200)
        except Exception as err:
            return Response(str(err), 500)

class customer_details_fetch(APIView):
    @staticmethod
    def get(request):
        try:
            total_customers = UserManager.fetch_customer_details()
            data = CustomerDetailsSerializer(total_customers, many=True).data

            return Response({"result": "success", "data": data}, 200)
        except Exception as err:
            return Response(str(err), 500)



class token_auth_user(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            token = data.get("jsonToken", False)
            loggined_user = False
            if token:
                login_verified, user = UserManager.token_auth(token)
                if (login_verified):
                    loggined_user = UsersDetailsSerializer(user).data
                    payload = {
                        'email': user.email,
                        'role': user.role
                    }
                    token = jwt.encode(payload, 'secretKeyRight34', algorithm='HS256')
            else:
                return Response({"result": "failure", "message": "login failed"}, 200)
            return Response({"result": "success", "message": "token auth successfully", "loggined_user":loggined_user, "token":token}, 200)
        except Exception as err:
            return Response(str(err), 500)

class customer_action_handling(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            UserManager.handle_user_actions(data)
            return Response({"result": "success", "message": "data updated successfully"}, 200)
        except Exception as err:
            return Response(str(err), 500)


class InvoiceHandling(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            UserManager.add_invoice(request, data)
            return Response({"result": "success", "message": "data updated successfully"}, 200)
        except Exception as err:
            return Response(str(err), 500)

    @staticmethod
    def get(request):
        try:
            data = request.query_params
            invoices = UserManager.fetch_invoice(data)
            data = PDFFileSerializer(invoices, many=True).data
            return Response({"result": "success", "data": data}, 200)
        except Exception as err:
            return Response(str(err), 500)

class fetchPdf(APIView):
    @staticmethod
    def get(request):
        try:
            data = request.query_params
            return UserManager.fetch_pdf(data)
        except Exception as err:
            return Response(str(err), 500)


class signUpUser(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            UserManager.signup_user(data)
            return Response({"result": "success"}, 200)

        except Exception as err:
            return Response(str(err), 500)


class InvoiceHandlingAdmin(APIView):

    @staticmethod
    def get(request):
        try:
            data = request.query_params
            invoices = UserManager.fetch_invoice(data)
            data = PDFFileSerializer(invoices, many=True).data
            return Response({"result": "success", "data": data}, 200)
        except Exception as err:
            return Response(str(err), 500)