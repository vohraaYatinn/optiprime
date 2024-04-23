from rest_framework.response import Response
from rest_framework.views import APIView
from productManagement.manager import productManager
from productManagement.models import ProductsCustomer
from productManagement.serializers import ProductsCustomerSerializer


class ProductCustomer(APIView):

    @staticmethod
    def get(request):
        try:
            data = request.query_params
            data_obj = productManager.fetch_products_details_customer(data)
            serialized_data = ProductsCustomerSerializer(data_obj, many=True)
            insights = {
                "approved": data_obj.filter(status="approved").count(),
                "pending": data_obj.filter(status="pending").count()
            }
            return Response({"result": "success", "data": serialized_data.data, "insights":insights}, 200)
        except Exception as err:
            return Response(str(err), 500)

    @staticmethod
    def post(request):
        try:
            data = request.data
            data_obj = productManager.add_products_customer(request, data)
            return Response({"result": "success", "message": "Product has been successfully added for quotation request."}, 200)
        except Exception as err:
            return Response(str(err), 500)


class ProductCustomerAdmin(APIView):

    @staticmethod
    def get(request):
        try:
            data = request.query_params
            data_obj = productManager.fetch_products_details_admin(data)
            serialized_data = ProductsCustomerSerializer(data_obj, many=True)
            insights = {
                "approved": ProductsCustomer.objects.filter(status="approved").count(),
                "pending": data_obj.filter(status="pending").count()
            }
            return Response({"result": "success", "data": serialized_data.data, "insights":insights}, 200)
        except Exception as err:
            return Response(str(err), 500)


class ProductCustomerStatus(APIView):

    @staticmethod
    def post(request):
        try:
            data = request.data
            data_obj = productManager.change_products_status(data)
            return Response({"result": "success", "message": "Action on the product has been done successfully."}, 200)
        except Exception as err:
            return Response(str(err), 500)