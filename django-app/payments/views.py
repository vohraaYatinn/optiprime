# views.py

from rest_framework.response import Response

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import razorpay
import json
from rest_framework.views import APIView
from CoinsSystem.models import CoinsSystem
from CoinsSystem.serializer import CoinSystemSerializer
from UsersDetails.models import UsersDetails, InvoicesTable
from orderManagement.constants import paymentConstants
from payments.constants import mainPaymentTransactionConstants
from payments.models import paymentTransactions
from payments.manager import paymentManager
from payments.serializers import mainPaymentSerializer, paymentTransactionSerializer
from django.http import HttpResponse

from django.conf import settings
import io



class PaymentCreateView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            json_string = request.body.decode('utf-8')
            data_dict = json.loads(json_string)
            user = data_dict.get("email")
            amount = data_dict.get("amount")

            # You can customize the payload based on your requirements
            payload = {
                'amount': int(amount)*100,  # Amount in paise (e.g., 100 paise = 1 INR)
                'currency': 'INR',
                'receipt': 'order_receipt_123',
                'payment_capture': 1,  # Auto capture payment
            }

            order = client.order.create(data=payload)
            user_obj = UsersDetails.objects.get(email=user)
            payment_tran = paymentTransactions.objects.create(payment_id=order['id'], user=user_obj, amount=amount)

            return JsonResponse({'id': order['id'], 'amount': order['amount'], 'currency': order['currency']  })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class PaymentVerifyView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

            # Extract and verify payment details from the request
            json_string = request.body.decode('utf-8')
            payment_id_razor = request.POST.get('razorpay_payment_id')
            order_id = request.POST.get('razorpay_order_id')
            signature = request.POST.get('razorpay_signature')

            params_dict = {
                'razorpay_payment_id': payment_id_razor,
                'razorpay_order_id': order_id,
                'razorpay_signature': signature,
            }

            check = client.utility.verify_payment_signature(params_dict)
            payment_tran = paymentTransactions.objects.get(payment_id=order_id)

            if check:
                payment_tran.status = paymentConstants.status['completed']
                # coins = CoinsSystem.objects.get(user=payment_tran.user)
                # coins.coin = int(coins.coin) + int(payment_tran.amount)
                # coins.save()
                paymentManager.add_latest_transaction(payment_tran.user, payment_tran.amount, mainPaymentTransactionConstants.type['topup'])
                file_name = paymentManager.generate_pdf(request)
                if True:
                    invoice = InvoicesTable.objects.create(user=payment_tran.user, unique_id=file_name, amount=payment_tran.amount,
                                                 file="file_name_response")


            else:
                payment_tran.status = paymentConstants.status['failed']
            payment_tran.save()
            return JsonResponse({"result":"success", "message":"Thanks for your payment, You wallet has been updated successfully", "file_name":file_name,"amount":payment_tran.amount, "created_at":invoice.created_at})


        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class PaymentCustomerDashboard(APIView):
    @staticmethod
    def get(request):
        try:
            data = request.query_params
            Insights, transactions, top_us_history = paymentManager.fetch_customer_payment_dashboard(data)
            lastest_transaction_data = paymentTransactionSerializer(top_us_history, many=True).data
            transactions_data = mainPaymentSerializer(transactions, many=True).data

            data = {
                "insights": Insights,
                "lastest_transaction_data":lastest_transaction_data,
                "transactions_data":transactions_data

            }
            return Response({"result":"success", "message": "successfully updated the status","data":data }, 200)
        except Exception as err:
            return Response(str(err), 500)


class PaymentRequestWithdraw(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            coins_obj = paymentManager.withdraw_customer_request(data)
            if coins_obj:
                return Response({"result":"success", "message": "Successfully raised the withdrawal request, Payment will be settled down in your account soon","updated_coins":coins_obj.coin }, 200)
            else:
                raise Exception
        except Exception as err:
            return Response(str(err), 500)




class GeneratePaymentToken(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            token_generated = paymentManager.payment_token_generator(data)
            if token_generated:
                return Response({"result":"success", "message": "Successfully generated the token","token":token_generated }, 200)
            else:
                raise Exception
        except Exception as err:
            return Response(str(err), 500)


class RedeemToken(APIView):
    @staticmethod
    def post(request):
        try:
            data = request.data
            token_reedemed, file_name, invoice = paymentManager.payment_token_redeem(data)
            if token_reedemed:
                return Response({"result":"success", "message": "Successfully redeemed the token", "file_name":file_name,"amount":invoice.amount, "created_at":invoice.created_at  }, 200)
            else:
                return Response({"result":"failure", "message": "Either the token is expired or already been used" }, 200)
        except Exception as err:
            return Response({"result": "failure", "message": "Either the token is expired or already been used"}, 200)


class useruser(APIView):
    @staticmethod
    def get(request):
        try:
            paymentManager.user_ab()
            return Response({"result":"success"}, 200)
        except Exception as err:
            return Response({"result": "failure", "message": "Either the token is expired or already been used"}, 200)
