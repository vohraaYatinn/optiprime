import random
import uuid
from datetime import datetime, timedelta

from django.db.models import Count
from django.db.models.functions import TruncMonth
import string

from CoinsSystem.models import CoinsSystem
from CustomApp.manager import CustomManager
from orderManagement.models import ordersCreated, pendingQuery, lineOrderCreated
from UsersDetails.models import UsersDetails
from productManagement.models import ProductsCustomer
import uuid

class orderManager:
    @staticmethod
    def fetch_dashboard_details(data):
        if(CustomManager.check_if_admin_exists(data.get("email"))):
            seven_days_ago = datetime.now() - timedelta(days=7)
            total_orders = ordersCreated.objects.filter().count()
            orders_last_Week = ordersCreated.objects.filter(created_at__range=[seven_days_ago, datetime.now()]).count()
            pending_query = pendingQuery.objects.filter(status="pending").count()
            pending_orders = lineOrderCreated.objects.filter(status="pending").count()
            order_deliver = lineOrderCreated.objects.filter(status="delivered").count()
            monthly_order_counts = ordersCreated.objects.annotate(
                        month=TruncMonth('created_at')
                    ).values('month').annotate(count=Count('id')).order_by('month')
            monthly_order_pending = lineOrderCreated.objects.filter(status="pending").annotate(
                        month=TruncMonth('created_at')
                    ).values('month').annotate(count=Count('id')).order_by('month')
            monthly_order_delivered = lineOrderCreated.objects.filter(status="delivered").annotate(
                        month=TruncMonth('created_at')
                    ).values('month').annotate(count=Count('id')).order_by('month')
            order_counts_list = [entry['count'] for entry in monthly_order_counts][0:10]
            order_counts_list_pending = monthly_order_pending.count()
            order_counts_list_delivered = monthly_order_delivered.count()




            graphOrders = {
                "order_counts_list": order_counts_list,
                "order_counts_list_pending": order_counts_list_pending,
                "order_counts_list_delivered": order_counts_list_delivered,
            }


            return total_orders, orders_last_Week, pending_query, pending_orders, order_deliver, graphOrders
        else:
            raise BaseException("User not authenticated")


    @staticmethod
    def fetch_dashboard_details_customer(data):
        if(CustomManager.check_if_admin_exists(data.get("email"))):
            user = data.get("email")
            seven_days_ago = datetime.now() - timedelta(days=7)
            total_orders = ordersCreated.objects.filter(user__email=user).count()
            orders_last_Week = ordersCreated.objects.filter(created_at__range=[seven_days_ago, datetime.now()], user__email=user).count()
            pending_query = pendingQuery.objects.filter(status="pending").count()
            pending_orders = lineOrderCreated.objects.filter(status="pending", product_obj__user__email=user).count()
            order_deliver = lineOrderCreated.objects.filter(status="delivered", product_obj__user__email=user).count()
            monthly_order_counts = ordersCreated.objects.filter(user__email=user).annotate(
                        month=TruncMonth('created_at')
                    ).values('month').annotate(count=Count('id')).order_by('month')
            monthly_order_pending = lineOrderCreated.objects.filter(status="pending", product_obj__user__email=user).annotate(
                        month=TruncMonth('created_at')
                    ).values('month').annotate(count=Count('id')).order_by('month')
            monthly_order_delivered = lineOrderCreated.objects.filter(status="delivered", product_obj__user__email=user).annotate(
                        month=TruncMonth('created_at')
                    ).values('month').annotate(count=Count('id')).order_by('month')
            order_counts_list = [entry['count'] for entry in monthly_order_counts][0:10]
            order_counts_list_pending = monthly_order_pending.count()
            order_counts_list_delivered = monthly_order_delivered.count()




            graphOrders = {
                "order_counts_list": order_counts_list,
                "order_counts_list_pending": order_counts_list_pending,
                "order_counts_list_delivered": order_counts_list_delivered,
            }


            return total_orders, orders_last_Week, pending_query, pending_orders, order_deliver, graphOrders
        else:
            raise BaseException("User not authenticated")


    @staticmethod
    def populate_orders():
        user = UsersDetails.objects.get(email="yatin@gmail.com")
        status = ["pending", "delivered", "packed"]

        for i in range(0, 400):
            ordersCreated.objects.create(user=user, customer_link="www.abc.com", drop_shipper_link="www.momo.com",
                                         quantity=random.randint(1,100), status = status[random.randint(0,2)],created_at=datetime.now() - timedelta(days=i))

    @staticmethod
    def fetch_all_orders(data):
        if(CustomManager.check_if_admin_exists(data.get("email"))):
            total_orders = ordersCreated.objects.filter().select_related("user")
            return total_orders
        else:
            raise BaseException("User not authenticated")

    @staticmethod
    def action_admin_orders(data):
        status = data.get("status", False)
        line_id = data.get("lineId", False)
        if(status and line_id):
            order_obj = lineOrderCreated.objects.get(id=line_id)
            order_obj.status = status
            order_obj.save()


    @staticmethod
    def fetch_all_query(data):
        if(CustomManager.check_if_admin_exists(data.get("email"))):
            total_query = pendingQuery.objects.filter()
            return total_query
        else:
            raise BaseException("User not authenticated")


    @staticmethod
    def action_pending_orders(data):
        status = data.get("status", False)
        pending_id = data.get("pendingId", False)
        if(status and pending_id):
            pending_obj = pendingQuery.objects.get(id=pending_id)
            pending_obj.status = status
            pending_obj.save()    \


    @staticmethod
    def fetch_customer_orders(data):
        email = data.get("email", False)
        orders = []
        if(email):
            orders = ordersCreated.objects.filter(user__email=email).prefetch_related("order_id", "order_id__product_obj")
        return orders


    @staticmethod
    def fetch_customer_orders_admin(data):
        email = data.get("email", False)
        orders = []
        if(email):
            orders = ordersCreated.objects.filter().prefetch_related("order_id", "order_id__product_obj").order_by("-created_at")
        return orders

    @staticmethod
    def place_customer_order(data):
        productId = data.get("productId", False)
        quantity = data.get("quantity", False)

        orders = []
        if productId and quantity:
            product_obj = ProductsCustomer.objects.filter(id=productId).select_related("user")
            coins_obj = CoinsSystem.objects.get(user__email = product_obj[0].user.email)
            coins_obj.coin = str(int(coins_obj.coin) - (int(product_obj[0].quoted_price) * int(quantity)))
            coins_obj.save()
            orders = ordersCreated.objects.create(
                product_obj = product_obj[0],
                order_unique_id= ''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=10)),
                customer_address="demo address",
                quantity=quantity
            )
        return orders, coins_obj.coin

    @staticmethod
    def place_cart_order(data):
        productId = data.get("productId", False)
        product_obj = ProductsCustomer.objects.filter(id=productId).select_related("user")
        line_check = lineOrderCreated.objects.filter(product_obj_id=product_obj[0].id, status="draft")
        if not line_check:
            lineOrderCreated.objects.create(
                line_unique_id = ''.join(random.choices(string.ascii_uppercase +
                                 string.digits, k=10)),
                product_obj = product_obj[0],
                status="draft"
            )

    @staticmethod
    def cart_order_fetch(data):
        email = data.get("email", False)
        objs = lineOrderCreated.objects.filter(product_obj__user__email=email, status="draft").select_related("product_obj")
        return objs


    @staticmethod
    def fetch_customer_orders_dash(data):
        email = data.get("email", False)
        seven_days_ago = datetime.now() - timedelta(days=7)
        total_orders = ordersCreated.objects.filter(user__email = email).count()
        orders_last_Week = ordersCreated.objects.filter(created_at__range=[seven_days_ago, datetime.now()],
                                                        user__email = email).count()
        pending_orders = lineOrderCreated.objects.filter(status="pending", product_obj__user__email = email).count()
        order_deliver = lineOrderCreated.objects.filter(status="delivered", product_obj__user__email = email).count()
        return total_orders, orders_last_Week, pending_orders, order_deliver


    @staticmethod
    def cart_quantity(data):
        order_id = data.get("order", False)
        quantity = data.get("quantity", False)
        objs = lineOrderCreated.objects.filter(id=order_id)
        if objs:
            if quantity > 0:
                objs[0].quantity = quantity
                objs[0].save()
            else:
                objs[0].delete()
        return objs


    @staticmethod
    def place_order(data):
        address = data.get("address")
        del data['address']
        amount_to_debit = 0
        if (len(data.keys())):
            product_obj_list = []
            for obj in data:
                product_obj_list.append(data[obj]['id'])
            line_objs = lineOrderCreated.objects.filter(id__in=product_obj_list)
            for i in line_objs:
                amount_to_debit = int(amount_to_debit + (int(i.quantity) * int(i.product_obj.quoted_price)))
            userAmount = CoinsSystem.objects.get(user = line_objs[0].product_obj.user)
            if int(userAmount.coin) > amount_to_debit:
                order_created = ordersCreated.objects.create(
                    order_unique_id = uuid.uuid4(),
                    customer_address=address,
                    user=line_objs[0].product_obj.user
                )

                for i in line_objs:
                    i.order_id = order_created
                    i.status = "pending"
                    i.save()
                userAmount.coin = int(userAmount.coin) - amount_to_debit
                userAmount.save()
                return order_created, userAmount.coin
            else:
                return False, False


