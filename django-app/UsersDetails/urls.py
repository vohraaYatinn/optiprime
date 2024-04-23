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
from UsersDetails.views import user_auth, customer_details_fetch, \
    customer_action_handling,InvoiceHandling, fetchPdf, token_auth_user, signUpUser, InvoiceHandlingAdmin

urlpatterns = [
    path(r'login-admin/', user_auth.as_view(), name="users_auth"),
    path(r'login-customer/', user_auth.as_view(), name="users_auth"),
    path(r'sign-up/', signUpUser.as_view(), name="signup-user"),
    path(r'token-auth/', token_auth_user.as_view(), name="token_auth_user"),
    path(r'fetch-customer-details/', customer_details_fetch.as_view(), name="dashboard_fetch"),
    path(r'customer-actions/', customer_action_handling.as_view(), name="dashboard_fetch"),
    path(r'invoice-upload/', InvoiceHandling.as_view(), name="invoice_upload"),
    path(r'invoice-fetch/', InvoiceHandling.as_view(), name="invoice_fetch"),
    path(r'invoice-fetch-admin/', InvoiceHandlingAdmin.as_view(), name="invoice_fetch"),
    path(r'pdf-fetch/', fetchPdf.as_view(), name="invoice_fetch"),


]