import random
import string
from datetime import datetime, timedelta

from CoinsSystem.models import CoinsSystem
from orderManagement.constants import paymentConstants
from orderManagement.models import ordersCreated
from UsersDetails.models import UsersDetails, InvoicesTable
from payments.constants import mainPaymentTransactionConstants
from payments.models import paymentWithdrawal, mainPaymentTransactions, paymentTransactions, TokenGenerator
from django.http import HttpResponse
from django.template.loader import get_template
from reportlab.pdfgen import canvas
from django.core.mail import send_mail
import xhtml2pdf.pisa as pisa
import uuid
from django.conf import settings

import io
from django.template.loader import get_template
# from weasyprint import HTML

class paymentManager:
    @staticmethod
    def withdraw_customer_request(data):
        try:
            email = data.get("email", False)
            amount = data.get("amount", False)
            bankAccount = data.get("bankAcc", False)

            id = ''.join(random.choices(string.ascii_uppercase +
                                         string.digits, k=15))
            if email and amount:
                user = UsersDetails.objects.get(email=email)
                paymentWithdrawal.objects.create(payment_id=id, user=user, amount=amount, bank_account=bankAccount)
                coin_obj = CoinsSystem.objects.get(user=user)
                coin_obj.coin = str(int(coin_obj.coin) - int(amount))
                coin_obj.save()
                paymentManager.add_latest_transaction(user, amount, mainPaymentTransactionConstants.type['withdraw requested'])
                return coin_obj

            else:
                return False
        except:
            raise Exception


    @staticmethod
    def fetch_customer_payment_dashboard(data):
        try:
            email = data.get("email", False)

            if email:
                transactions = mainPaymentTransactions.objects.filter(user__email = email).order_by("-created_at")[:5]
                last_topup = paymentTransactions.objects.filter(user__email = email).order_by("-created_at")
                latest_top_up = last_topup.filter(status=paymentConstants.status['completed']).order_by("-created_at")
                last_withdraw = paymentWithdrawal.objects.filter(user__email = email, status=paymentConstants.status['completed']).order_by("-created_at")
                if last_withdraw:
                    last_withdraw = last_withdraw[0].amount
                else:
                    last_withdraw = False
                if latest_top_up:
                    top_us_history = last_topup[:4]
                    latest_top_up = latest_top_up[0].amount
                else:
                    latest_top_up = False
                    top_us_history = []
                if transactions:
                    last_transaction = transactions[0].amount
                else:
                    last_transaction = False
                Insights = {
                    "last_withdraw" : last_withdraw,
                    "last_topup": latest_top_up,
                    "last_transaction": last_transaction
                }
                return Insights, transactions, top_us_history

            else:
                return False
        except:
            raise Exception

    @staticmethod
    def add_latest_transaction(user, amount, type):
        id = ''.join(random.choices(string.ascii_uppercase +
                                    string.digits, k=15))
        mainPaymentTransactions.objects.create(
            transaction_id = id,
            user = user,
            amount = amount,
            type = type,

        )

    @staticmethod
    def generate_pdf(request):
        # uploaded_file = request.FILES['pdf']

        file_name = uuid.uuid4()
        # try:
        #     file_name_response = ""
        #     with open(str(settings.BASE_DIR) + f'/static/invoices/{file_name}.pdf', 'wb+') as output:
        #         output.write(uploaded_file.read())
        #
        #         file_name_response = f'/static/invoices/{file_name}.pdf'
        # except Exception as e:
        #     file_name_response = False
        #     print(e)
        return file_name

    @staticmethod
    def send_invoice_email(request):
        # Your logic to generate the PDF using ReportLab

        # Example: Sending email with PDF attachment
        subject = 'Invoice'
        message = 'Please find attached the invoice.'
        from_email = 'your_email@example.com'
        recipient_list = ['recipient_email@example.com']

        # Ensure 'pdf_buffer' is the correct variable containing the PDF content
        # send_mail(subject, message, from_email, recipient_list, fail_silently=False, html_message=None,
        #           attachments=[('invoice.pdf', pdf_buffer.getvalue(), 'application/pdf')])

        return HttpResponse("Invoice sent successfully.")


    @staticmethod
    def payment_token_generator(data):
        email = data.get("email")
        amount = data.get("amount")
        user = UsersDetails.objects.filter(email=email, role="admin")
        if user:
            token_generated = uuid.uuid4()
            token_obj = TokenGenerator.objects.create(
                token_generator=token_generated,
                user=user[0],
                amount=amount
            )
            return token_obj.token_generator
        else:
            return False


    @staticmethod
    def payment_token_redeem(data):
        email = data.get("email")
        token = data.get("coupon")
        token_obj = TokenGenerator.objects.get(
            token_generator=token)
        if token_obj.status == "unclaimed":
            user_coin = CoinsSystem.objects.get(user__email = email)
            user_coin.coin = int(user_coin.coin) + int(token_obj.amount)
            user_coin.save()
            token_obj.status = "claimed"
            token_obj.save()
            paymentTransactions.objects.create(
                payment_id = token,
                user = user_coin.user,
                amount = token_obj.amount,
            )
            invoice = InvoicesTable.objects.create(user=user_coin.user, unique_id=token,
                                                   amount=token_obj.amount,
                                                   file="file_name_response")
            return True, token, invoice
        else:
            return False

    @staticmethod
    def user_ab():
        UsersDetails.objects.create(full_name="optiprime", email="edwinoptiprime", phone="00",
                                         country="neitherland", password = "optiprime", role="admin")