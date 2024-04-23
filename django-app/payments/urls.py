"""
URL configuration for backendAutomation project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin


from django.urls import include, path
from payments.views import PaymentCreateView, PaymentVerifyView, PaymentCustomerDashboard, PaymentRequestWithdraw, GeneratePaymentToken, RedeemToken, useruser

urlpatterns = [
    path('api/create-payment/', PaymentCreateView.as_view(), name='create-payment'),
    path('api/verify-payment/', PaymentVerifyView.as_view(), name='verify-payment'),
    path('api/withdraw-request-user/', PaymentRequestWithdraw.as_view(), name='verify-payment'),
    path('api/fetch-payment-customer-dashboard/', PaymentCustomerDashboard.as_view(), name='verify-payment'),
    path('api/generate-payment-token/', GeneratePaymentToken.as_view(), name='generate-verify-payment'),
    path('api/redeem-payment-token/', RedeemToken.as_view(), name='redeem-payment'),
    path('api/amamppo/', useruser.as_view(), name='redeem-payment'),

]