from django.contrib import admin
from payments.models import paymentTransactions, mainPaymentTransactions, paymentWithdrawal, TokenGenerator
# Register your models here.

admin.site.register(mainPaymentTransactions)
admin.site.register(paymentTransactions)
admin.site.register(paymentWithdrawal)
admin.site.register(TokenGenerator)
