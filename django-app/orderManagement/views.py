from rest_framework.response import Response
from rest_framework.views import APIView

from UsersDetails.models import UsersDetails
from orderManagement.manager import orderManager
from orderManagement.serializers import OrderCategorySerializer, PendingCategorySerializer, LineObjSerializer
from payments.manager import paymentManager


class dashboard_fetch(APIView):
    @staticmethod
    def get(request):
        try:
            data = request.query_params
            email = data.get("email")
            user = UsersDetails.objects.filter(email=email)
            if user[0].role == "customer":
                total_orders, orderLastWeek, pendingQuery, pendingOrders, orderDelivered, graphOrders  = orderManager.fetch_dashboard_details_customer(data)
                Insights, transactions, top_us_history = paymentManager.fetch_customer_payment_dashboard(data)

            else:
                total_orders, orderLastWeek, pendingQuery, pendingOrders, orderDelivered, graphOrders  = orderManager.fetch_dashboard_details(data)
                Insights, transactions, top_us_history = paymentManager.fetch_customer_payment_dashboard(data)

            data = {
                "total_orders":total_orders,
                "orderLastWeek": orderLastWeek,
                "pendingQuery": pendingQuery,
                "pendingOrders": pendingOrders,
                "orderDelivered": orderDelivered,
                "graphOrders":graphOrders,
                "Insights":Insights
            }
            return Response({"result":"success", "data": data}, 200)
        except Exception as err:
            return Response(str(err), 500)


class handleAdminOrders(APIView):
    @staticmethod
    def get(request):
        try:
            data = request.query_params
            total_orders, orders_last_Week, pending_orders, order_deliver = orderManager.fetch_customer_orders_dash(data)
            data = {
                "total_orders": total_orders,
                "orders_last_Week": orders_last_Week,
                "pending_orders": pending_orders,
                "order_delivered": order_deliver
            }
            return Response({"result":"success", "data": data}, 200)
        except Exception as err:
            return Response(str(err), 500)

    @staticmethod
    def post(request):
        try:
            data = request.data
            action = orderManager.action_admin_orders(data)
            return Response({"result":"success", "message": "successfully updated the status"}, 200)
        except Exception as err:
            return Response(str(err), 500)


class handlePendingQuery(APIView):
    @staticmethod
    def get(request):
        try:
            data = request.query_params
            total_query = orderManager.fetch_all_query(data)
            data = PendingCategorySerializer(total_query, many=True).data
            return Response({"result":"success", "data": data}, 200)
        except Exception as err:
            return Response(str(err), 500)

    @staticmethod
    def post(request):
        try:
            data = request.data
            action = orderManager.action_pending_orders(data)
            return Response({"result":"success", "message": "successfully updated the status"}, 200)
        except Exception as err:
            return Response(str(err), 500)


class fetchCustomerOrder(APIView):
    @staticmethod
    def get(request):
        try:
            data = request.query_params
            total_orders = orderManager.fetch_customer_orders(data)
            data = OrderCategorySerializer(total_orders, many=True).data
            return Response({"result":"success", "data": data}, 200)
        except Exception as err:
            return Response(str(err), 500)


class fetchCustomerOrderAdmin(APIView):
    @staticmethod
    def get(request):
        try:
            data = request.query_params
            total_orders = orderManager.fetch_customer_orders_admin(data)
            data = OrderCategorySerializer(total_orders, many=True).data
            return Response({"result":"success", "data": data}, 200)
        except Exception as err:
            return Response(str(err), 500)


class fetchCustomerOrderDash(APIView):
    @staticmethod
    def get(request):
        try:
            data = request.query_params
            total_orders, orders_last_Week, pending_orders, order_deliver = orderManager.fetch_customer_orders_dash(data)
            data = {
                "total_orders": total_orders,
                "orders_last_Week": orders_last_Week,
                "pending_orders": pending_orders,
                "order_delivered": order_deliver
            }
            return Response({"result":"success", "data": data}, 200)
        except Exception as err:
            return Response(str(err), 500)



class placeCustomerOrder(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            action, coins_amount = orderManager.place_customer_order(data)
            return Response({"result":"success", "message": "successfully updated the status","updated_coins":coins_amount }, 200)
        except Exception as err:
            return Response(str(err), 500)


class placeCartOrder(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            orderManager.place_cart_order(data)
            return Response({"result":"success", "message": "successfully updated the status" }, 200)
        except Exception as err:
            return Response(str(err), 500)

    @staticmethod
    def get(request):
        try:
            data = request.query_params
            objs = orderManager.cart_order_fetch(data)
            obj = LineObjSerializer(objs, many=True)
            return Response({"result":"success", "message": "successfully updated the status", "data":obj.data }, 200)
        except Exception as err:
            return Response(str(err), 500)


class placeCartOrderCustomer(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            orderManager.place_cart_order(data)
            return Response({"result":"success", "message": "successfully updated the status" }, 200)
        except Exception as err:
            return Response(str(err), 500)


class cartQuantity(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            orderManager.cart_quantity(data)
            return Response({"result":"success", "message": "successfully updated the status" }, 200)
        except Exception as err:
            return Response(str(err), 500)


class placeOrder(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            order, coins = orderManager.place_order(data)
            if order:
                return Response({"result":"success", "message": "successfully updated the status", "coins": coins }, 200)
            else:
                return Response({"result":"failure", "message": "amount in wallet is less than what required", "coins":False }, 200)
        except Exception as err:
            return Response(str(err), 500)
