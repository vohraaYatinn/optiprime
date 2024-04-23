import uuid

from productManagement.models import ProductsCustomer
from UsersDetails.models import UsersDetails

class productManager:

    @staticmethod
    def fetch_products_details_customer(data):
        email = data.get("email", False)
        products = []
        if email:
            products = ProductsCustomer.objects.filter(user__email=email).select_related("user")
        return products

    @staticmethod
    def add_products_customer(request, data):
        email = data.get("email", False)
        link = data.get("link", False)
        label = data.get("label", False)
        description = data.get("description", False)
        asked_price = data.get("price", False)
        photo = request.FILES['photo']

        if email and link and photo  and label:
            user_obj = UsersDetails.objects.filter(email=email)
            if user_obj:
                products = ProductsCustomer.objects.create(user=user_obj[0],
                                                           description=description,
                                                           photo_url=photo,
                                                           products_unique_id=uuid.uuid4(),
                                                           product_drop_shipping_url=link,
                                                           product_name=label,
                                                           asked_price=asked_price
                                                           )
                return products
            else:
                return False

        else:
            return False


    @staticmethod
    def fetch_products_details_admin(data):
        email = data.get("email", False)

        products = []

        if email:
            products = ProductsCustomer.objects.filter(status="pending").select_related("user")
        return products

    @staticmethod
    def change_products_status(data):
        price = data.get("price", False)
        productId = data.get("product", False)

        if price and productId:
            products = ProductsCustomer.objects.get(id=productId)
            products.quoted_price = price
            products.status = "approved"
            products.save()
        return products