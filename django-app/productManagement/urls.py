from django.urls import path
from productManagement.views import ProductCustomer, ProductCustomerAdmin, ProductCustomerStatus

urlpatterns = [
    path(r'fetch-customer-products/', ProductCustomer.as_view(), name="product-fetch"),
    path(r'add-customer-products/', ProductCustomer.as_view(), name="product-add-customer"),
    path(r'fetch-customer-products-admin/', ProductCustomerAdmin.as_view(), name="product-admin-customer"),
    path(r'admin-customer-status/', ProductCustomerStatus.as_view(), name="product-admin-status"),
]