from datetime import datetime, timedelta

from django.db.models import Prefetch

from UsersDetails.models import UsersDetails, CustomerDetails, InvoicesTable
from CoinsSystem.models import CoinsSystem
import string
import random
from django.http import FileResponse
import jwt

class UserManager:

    @staticmethod
    def login_user_admin(data):
        username = data.get("email", False)
        password = data.get("password", False)
        check_login = False
        if username and password:
                check_login = UsersDetails.objects.filter(email=username, password=password).prefetch_related("user_coins","user")
        else:
            raise BaseException("Both Username and Password is required")
        if check_login.exists():
            return True, check_login[0]
        return False, []

    @staticmethod
    def fetch_customer_details():
        prefetch_value = Prefetch('user__user_coins',
                                  queryset=CoinsSystem.objects.order_by('-last_updated'), to_attr="coins_user")
        user = CustomerDetails.objects.all().select_related("user").prefetch_related(prefetch_value).order_by("-user__created_at")
        return user

    @staticmethod
    def populate_user_and_customer():
        for i in range(100):
            res = ''.join(random.choices(string.ascii_uppercase +
                                         string.digits, k=10))
            object_user = UsersDetails.objects.create(full_name=res+" "+"singh", email=f"www.{res}.com", phone=f"www.{res}.com",
                                         country=res, password = res+res)
            CustomerDetailssds = CustomerDetails.objects.create(user=object_user, brand_name=f"www.{res}.com", company_address=res+" enterpresise")

    @staticmethod
    def handle_user_actions(data):
        id = data.get("id", False)
        action = data.get("action", False)
        if action == "unban":
            action = "active"
        if(id and action):
            user = UsersDetails.objects.get(id=id)
            user.status = action
            user.save()
        else:
            raise BaseException("both id and action required")

    @staticmethod
    def fetch_invoice(data):
        email = data.get("email")
        invoices = InvoicesTable.objects.filter(user__email=email).select_related("user").order_by("-created_at")
        return invoices

    @staticmethod
    def add_invoice(request, data):
        file = request.FILES['file[file][originFileObj]']
        email = data.get("email", False)
        unique_id = data.get("generatedKey", False)
        amount = data.get("amount", False)
        user = UsersDetails.objects.get(email="www.8RD4MFZ2IR.com")
        uploaded_file = InvoicesTable.objects.create(user=user, file=file, unique_id=unique_id, amount=amount)
        return uploaded_file

    @staticmethod
    def fetch_pdf(data):
        url = data.get("pdfUrl", False)
        if url:
            invoices_path = "../backendAuto"+url
            return FileResponse(open(invoices_path, 'rb'), content_type='application/pdf')
        else:
            return False

    @staticmethod
    def token_auth(token):
        token_decode = jwt.decode(jwt=token,
                                  key='secretKeyRight34',
                                  algorithms=["HS256"])
        check_login = UsersDetails.objects.filter(email=token_decode['email'], role=token_decode['role']).prefetch_related(
            "user_coins", "user")
        return check_login.exists(), check_login[0]

    @staticmethod
    def signup_user(data):

        email = data.get("email")
        firstname = data.get("firstname")
        lastname = data.get("lastname")
        password = data.get("pass2")
        countrycode = data.get("countryCode")
        phonenumber = data.get("phonenumber")
        companyname = data.get("companyname")
        companyaddress = data.get("companyAddress")


        user_obj = UsersDetails.objects.create(full_name=firstname+" "+lastname, email=email, phone=countrycode+" "+phonenumber,
                                                  password=password)
        CustomerDetails.objects.create(user=user_obj,brand_name=companyname, company_address=companyaddress)
        CoinsSystem.objects.create(user=user_obj, coin=0)

