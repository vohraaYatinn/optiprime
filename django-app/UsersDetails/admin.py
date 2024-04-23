from django.contrib import admin
from UsersDetails.models import UsersDetails, CustomerDetails,InvoicesTable

# Register your models here.

admin.site.register(UsersDetails)

admin.site.register(CustomerDetails)
admin.site.register(InvoicesTable)

