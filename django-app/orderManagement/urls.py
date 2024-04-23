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
from orderManagement.views import dashboard_fetch, handleAdminOrders, handlePendingQuery, \
    fetchCustomerOrder, placeCustomerOrder, placeCartOrder, fetchCustomerOrderDash, fetchCustomerOrderAdmin, placeCartOrderCustomer, cartQuantity, placeOrder

urlpatterns = [
    path(r'fetch-dashboard/', dashboard_fetch.as_view(), name="dashboard-fetch"),
    path(r'fetch-order-dashboard/', handleAdminOrders.as_view(), name="fetch-order-dashboard"),
    path(r'fetch-customer-order-dash/', fetchCustomerOrderDash.as_view(), name="fetch-order-dashboard"),
    path(r'fetch-customer-order/', fetchCustomerOrder.as_view(), name="fetch-order-dashboard"),
    path(r'fetch-customer-order-admin/', fetchCustomerOrderAdmin.as_view(), name="fetch-order-dashboard-admin"),
    path(r'action-order-admin/', handleAdminOrders.as_view(), name="action-order-admin"),
    path(r'fetch-pending-query/', handlePendingQuery.as_view(), name="action-query-admin"),
    path(r'action-pending-query/', handlePendingQuery.as_view(), name="action-query-admin"),
    path(r'place-customer-order/', placeCustomerOrder.as_view(), name="place-customer-order"),
    path(r'place-cart-order/', placeCartOrder.as_view(), name="place-customer-order"),
    path(r'get-cart-order/', placeCartOrder.as_view(), name="get-customer-order"),
    path(r'place-customer-cart/', placeCartOrderCustomer.as_view(), name="get-customer-order"),
    path(r'place-customer-quantity/', cartQuantity.as_view(), name="cart-customer-order"),
    path(r'place-order/', placeOrder.as_view(), name="place-customer-order"),

]