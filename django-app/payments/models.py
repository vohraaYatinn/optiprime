from django.db import models
from UsersDetails.models import UsersDetails
from django.utils import timezone
from orderManagement.constants import paymentConstants


class paymentTransactions(models.Model):
    payment_id = models.CharField(max_length=50 , null=True)
    user = models.ForeignKey(UsersDetails, max_length=100, on_delete=models.CASCADE, related_name="Users_payment", null=True)
    amount = models.IntegerField(null=True)
    status = models.CharField(max_length=15, default=paymentConstants.status['completed'])
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = "payments_created"


class paymentWithdrawal(models.Model):
    payment_id = models.CharField(max_length=50 , null=True)
    user = models.ForeignKey(UsersDetails, max_length=100, on_delete=models.CASCADE, related_name="Users_payment_with", null=True)
    amount = models.IntegerField(null=True)
    status = models.CharField(max_length=15, default=paymentConstants.status['pending'])
    bank_account = models.TextField(null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = "payments_withdraw"


class mainPaymentTransactions(models.Model):
    transaction_id = models.CharField(max_length=50 , null=True)
    user = models.ForeignKey(UsersDetails, max_length=100, on_delete=models.CASCADE, related_name="main_user_transactions", null=True)
    amount = models.IntegerField(null=True)
    type = models.CharField(max_length=15, default=paymentConstants.status['pending'])
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = "main_payment_transactions"


class pdfSaver(models.Model):
    pdf = models.FileField(upload_to='static/')

    class Meta:
        managed = True
        db_table = "main_payment_transdsaactions"


class TokenGenerator(models.Model):
    token_generator = models.CharField(max_length=255 , null=True)
    user = models.ForeignKey(UsersDetails, max_length=100, on_delete=models.CASCADE, related_name="user_generated_token", null=True)
    amount = models.IntegerField(null=True)
    status = models.CharField(max_length=15, default="unclaimed")
    user_redeemed = models.ForeignKey(UsersDetails, max_length=100, on_delete=models.CASCADE, related_name="user_redeemed_token", null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = "token_payments"